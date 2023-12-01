import requests
import json

def GetWeather(Lat, Long):
    url = "https://api.openweathermap.org/data/2.5/onecall?lat=%s&lon=%s&appid=%s&units=metric" % (Lat, Long, "6c8e40014b37743ddb08a55b914bbd96")

    response = requests.get(url)
    data = json.loads(response.text)
    return data["current"]["temp"]

