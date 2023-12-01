import requests
import json


def location_lat_long(latt,lonn,rangee,typee,radius):
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
            "lon": i["point"]["lon"]
        })

    return r