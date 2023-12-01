# #######
# imports
# #######

from flask import Flask,render_template, send_from_directory,request,redirect,url_for,jsonify
import mysql.connector
import random
import string
import hashlib
import uuid
import requests
from bs4 import BeautifulSoup
from covid import Covid
from countryinfo import CountryInfo
import pandas as pd
import json
from google_images_download import google_images_download
import sys
import random

app = Flask(__name__)


mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="root",
  database="degru"
)

mycursor = mydb.cursor()

# ======================
# routes and other stuff
# ======================

@app.route("/")
def home_page():
    return render_template("index.html", session="failed")

@app.route("/profile")
def render_page():
    return render_template("Profile.html")

@app.route('/login')
def login_serve():
    return render_template("Login.html")

@app.route("/signup")
def signup_serve():
    return render_template("SignUp.html")

@app.route('/statics/<path:path>')
def send_js(path):
    return send_from_directory('statics', path)

# ======================
# rendering the templates
# ======================

@app.route("/verify-login", methods = ["POST"])
def login():
    # again, as i said, only for demo, should not be used for production
    user = request.form["Username"]
    password = hashlib.sha256(request.form["Password"].encode()).hexdigest()
    mycursor.execute("SELECT * FROM login WHERE user = %s AND password = %s", (user, password))
    result = mycursor.fetchall()
    print(result)
    if len(result) == 0:
        return render_template("Login.html", error="The combination of the User and Password is not found")
    else:
        session = get_random_string(8)
        mycursor.execute("UPDATE login SET session = %s WHERE user = %s", (session, user))
        mydb.commit() 
        return redirect(url_for('.home_page', session=session))

@app.route("/verify-signup", methods = ["POST"])
def signup():
    user = request.form["Username"]
    # password = request.form["InputPassword"] *to be later hashed
    mycursor.execute("SELECT user from login WHERE user = %s", (user, ))
    resulta = mycursor.fetchall()
    if resulta == []:
        if len(request.form["Password"]) < 8:
            return render_template("SignUp.html", error="The password is too short (min 8 characters)")
        else:

            password = hashlib.sha256(request.form["Password"].encode()).hexdigest()
            session = get_random_string(8)
            # only for demo, should not be used for production
            mycursor.execute("INSERT INTO login (user, password, session) VALUES (%s, %s, %s)", (user, password, session))
            mydb.commit()
            return redirect(url_for('.home_page', session=session))
    else:
            return render_template("SignUp.html", error="User already exists")

@app.route("/search-save", methods = ["POST"])
def searchsave():
    indataa = request.json
    session = indataa["SessionId"]
    idd = indataa["ID"]
    mycursor.execute("UPDATE login SET saved = %s WHERE session = %s", (idd, session))
    mydb.commit()


@app.route("/saved", methods = ["POST"])
def servesave():
    indataaa = request.json
    session = indataaa["SessionId"]
    mycursor.execute("SELECT saved FROM login WHERE session = %s", (session, ))
    result = mycursor.fetchall()

    print(postid)
    postid = result[0]

    mycursor.execute("SELECT * FROM places WHERE id = %s", (postid, ))
    resultt = mycursor.fetchall()

    return jsonify(resultt)

@app.route("/search-data", methods = ["POST"])
def searchdata():
    indata = request.json
    session = indata["SessionId"]
    vacation_type = indata["VacationType"]

    first_day = indata["FirstDay"]
    day_number = int(indata["DayNumber"])
    covid_note = int(indata["Covid"])

    if vacation_type == "Beach":
        vacation_type = "beaches"
    if vacation_type == "Mountain":
        vacation_type = "geological_formations"
    if vacation_type == "City-break":
        vacation_type = "urban_environment"

    visited_countries = get_most_visited_contries()

    r = []
    for country in visited_countries:
        print("shit", country)
        try:
            covid = CalculateCovidSafeness(country.lower())
            if covid >= covid_note:
                print(country)
                print("shut", covid)
                lat,longg,radius = GetCountryCenterRadius(country.lower())
                debug = location_lat_long(lat,longg,20, vacation_type, radius, covid)
                r.append(debug)
                print(debug)
        except:
            pass
    res = []
    for x in r:
        if x not in res:
            res.append(x)
    
    ress = []
    for i in res[0]:
        urll = imageSearch(i["name"])
        weather = GetWeather(i["lat"], i["lon"])
        abc = get_random_string(10)
        ress.append({
            "name": i["name"],
            "lat": i["lat"],
            "long": i["lon"],
            "covid": i["covid"],
            "image_url": urll,
            "weather": str(weather),
            "loc_id": abc
        })
        mycursor.execute("INSERT INTO places (id, name, photo_loc, covid_rate, weather) VALUES (%s, %s, %s, %s, %s)", (abc, i["name"], urll, i["covid"], str(weather)))
        mydb.commit()

    return jsonify(ress)


# ======================
# misc (nici nu stiu cum sa le numesc creierul meu nu mai duce)
# ======================

def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return(result_str) 

def get_most_visited_contries():
    Countries = [
        "France",
        "Spain",
        "United States",
        "China",
        "Italy",
        "Mexico",
        "United Kingdom",
        "Turkey",
        "Germany",
        "Thailand",
        "Austria",
        "Japan",
        "Greece",
        "Malaysia",
        "Russia",
        "Canada",
        "Poland",
        "Netherlands",
        "Croatia",
        "Portugal",
        "Ukraine",
        "Denmark",
        "Belarus",
        "Romania",
        "Ireland",
        "Czech Republic",
        "Switzerland",
        "Bulgaria",
        "Australia",
        "Belgium",
        "Egypt",
        "Sweden",
        "Brazil",
        "Georgia",
        "Chile",
        "Norway",
        "Hungary",
    ]

    return Countries

def CalculateCovidSafeness(Location):
    try:
        Covidel = Covid()

        if Location == "united states":
            Location = "usa"

        Country = CountryInfo(Location).info()

        Population = int(Country["population"])

        if Location == "usa":
            Location = "US"
        
        Cases = int(Covidel.get_status_by_country_name(Location)["active"])

        CovidSafeness = float(format(Cases / Population, 'f'))
        if CovidSafeness < 0.00001:
            return 10

        elif CovidSafeness < 0.00005:
            return 9
        
        elif CovidSafeness < 0.0001:
            return 8

        elif CovidSafeness < 0.0005:
            return 7

        elif CovidSafeness < 0.001:
            return 6

        elif CovidSafeness < 0.005:
            return 5;

        elif CovidSafeness < 0.01:
            return 4

        elif CovidSafeness < 0.05:
            return 3

        elif CovidSafeness < 0.1:
            return 2

        elif CovidSafeness < 0.5:
            return 1
        else:
            return 0
    except:
        return 0

def GetCountryCenterRadius(Location):
    Country = CountryInfo(Location)

    CenterLong = 0
    CenterLat = 0

    Coordinates = Country.geo_json()["features"][0]["geometry"]["coordinates"][0]

    try:
        for Coord in Coordinates:
            CenterLong = CenterLong + Coord[0]
            CenterLat = CenterLat + Coord[1]

        CenterLong = CenterLong / len(Coordinates)
        CenterLat = CenterLat / len(Coordinates)
    except:
        Coordinates = Country.geo_json()["features"][0]["geometry"]["coordinates"][0][0]

        for Coord in Coordinates:
            CenterLong = CenterLong + Coord[0]
            CenterLat = CenterLat + Coord[1]

        CenterLong = CenterLong / len(Coordinates)
        CenterLat = CenterLat / len(Coordinates)

    return CenterLat, CenterLong, 1000000

def location_lat_long(latt,lonn,rangee,typee,radius,covid):
    headers = {
        'accept': 'application/json',
    }

    params = (
        ('radius', str(radius)),
        ('lon', lonn),
        ('lat', latt),
        ('kinds', typee),
        ('rate', '2h'),
        ('format', 'json'),
        ('limit', str(rangee)),
        ('apikey', '5ae2e3f221c38a28845f05b6bb345c95c2512f932ee7eaba63765f27'),
    )

    response = requests.get('http://api.opentripmap.com/0.1/en/places/radius', headers=headers, params=params)
    resp = json.loads(response.text)
    r = []

    for i in resp:
        r.append({
            "name": i["name"],
            "lat": i["point"]["lat"],
            "lon": i["point"]["lon"],
            "covid": covid
        })

    return r

def GetWeather(Lat, Long):
    url = "https://api.openweathermap.org/data/2.5/onecall?lat=%s&lon=%s&appid=%s&units=metric" % (Lat, Long, "6c8e40014b37743ddb08a55b914bbd96")

    response = requests.get(url)
    data = json.loads(response.text)
    
    return data["current"]["temp"]

def imageSearch(img):
    headers = {
        'Ocp-Apim-Subscription-Key': '4a0060cc77894f4ca21ecf663cae20ee',
    }

    params = (
        ('q', img),
    )

    response = requests.get('https://api.bing.microsoft.com/v7.0/images/search', headers=headers, params=params)
    data = json.loads(response.text)
    print(data)
    return data["value"][0]["contentUrl"]

app.run(host = "0.0.0.0", port=80, debug=True)