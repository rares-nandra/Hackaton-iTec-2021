function SendSearch()
{
    VacationType = document.getElementById("InputVacationType").value;
    FirstDay = document.getElementById("InputDateStart").value;
    DayNumber = document.getElementById("InputDayNumber").value;
    Covid = document.getElementById("InputCovid").value;

    if(VacationType != '' && FirstDay != '' && DayNumber != '' && Covid)
    {
        document.getElementById("Error").innerHTML = "";

        var xhr = new XMLHttpRequest();

        xhr.open("POST", "/search-data", true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4)
            {
                if (xhr.status == 200)
                {
                    var Response = JSON.parse(xhr.response);

                    for(var i = 0; i < Response.length; i++)
                    {
                        var Id = Response[i]["lock_id"];
                        var Name = Response[i]["name"];
                        var Photo = Response[i]["image_url"];
                        var CovidRisk = Response[i]["covid"];
                        var Weather = Response[i]["weather"];
                        var lat = Response[i]["lat"];
                        var long = Response[i]["lon"];
                        
                        if(i % 2 == 0)
                        {
                            RenderResult(Id, Name, Photo, CovidRisk, Weather, "right", lat, long);
                        }
                        else 
                        {
                            RenderResult(Id, Name, Photo, CovidRisk, Weather, "left", lat, long);
                        }
                    }
                }
            }
        }
        
        xhr.send(JSON.stringify({
            SessionId: SessionId,
            VacationType: VacationType,
            FirstDay: FirstDay, 
            DayNumber: DayNumber,
            Covid: Covid    
        }));
    
    }
    else
    {
        document.getElementById("Error").innerHTML = "Invalid Data";
    }   
}

function RenderResult(Id, Name, Photo, CovidRisk, Weather, Orientation, lat, long)
{
    /* 
        <div class = "ResultPost">
            <div class = "BackgroundImage ResultImage ResultImageRight" style = "background-image: url(../statics/Images/Placeholder.png);"></div>

            <div class = "ResultTextContainer ResultTextRight BackgroundAccentPrimary text-center">
                <h1 class = "SubTitle ResultTitle" id = "ResultElement">Locatie</h1>
                
                <p class = "ResultText TextMedium">Covid Risk: </p>
                <p class = "ResultText TextMedium">Weather: </p>

                <p class = "ResultText TextMedium" onclick = "SaveResult('');">Save Result <i class = "far fa-star" id = "SaveIcon"></i></p>

                <div class = "AnimationIncrease0">
                    <a class = "ButtonTransparentMedium ResultReadMore" href = "PlanTrip.html">Plan trip <i class = "fas fa-angle-right ReadMoreIcon"></i></a>
                </div>
            </div>
        </div>
    */
    
    Post = document.createElement("div"); 
    MapsLink = "https://www.google.ro/maps/@" + String(lat) + "," + String(long) + ",17z";

    if(Orientation == "right")
    {
        PostString = '<div class = "ResultPost"><div class = "BackgroundImage ResultImage ResultImageRight" style = "background-image: url(' + Photo + ');"></div><div class = "ResultTextContainer ResultTextRight BackgroundAccentPrimary text-center"><h1 class = "SubTitle ResultTitle" id = "ResultElement">' + Name + '</h1><p class = "ResultText TextMedium">Covid Safeness: ' + CovidRisk + '</p><p class = "ResultText TextMedium">Weather: ' + Weather + ' Degrees</p><p class = "ResultText TextMedium" id = "' + Id + '" onclick = "SaveResult(\'' + Id + '\');">Save Result <i class = "far fa-star" id = "SaveIcon"></i></p><div class = "AnimationIncrease0"><a class = "ButtonTransparentMedium ResultReadMore" href = "' + MapsLink + '">Plan trip <i class = "fas fa-angle-right ReadMoreIcon"></i></a>';
    }
    else 
    {
        PostString = '<div class = "ResultPost"><div class = "BackgroundImage ResultImage ResultImageLeft" style = "background-image: url(' + Photo + ');"></div><div class = "ResultTextContainer ResultTextLeft BackgroundAccentPrimary text-center"><h1 class = "SubTitle ResultTitle" id = "ResultElement">' + Name + '</h1><p class = "ResultText TextMedium">Covid Safeness: ' + CovidRisk + '</p><p class = "ResultText TextMedium">Weather: ' + Weather + ' Degrees</p><p class = "ResultText TextMedium" id = "' + Id + '" onclick = "SaveResult(\'' + Id + '\');">Save Result <i class = "far fa-star" id = "SaveIcon"></i></p><div class = "AnimationIncrease0"><a class = "ButtonTransparentMedium ResultReadMore" href = "' + MapsLink + '">Plan trip <i class = "fas fa-angle-right ReadMoreIcon"></i></a>';
    }

    Post.innerHTML = PostString;
    document.getElementById("SearchResultRow").appendChild(Post);
}

function SaveResult(Id)
{
    document.getElementById(Id).innerHTML = 'Save Result <i class = "fas fa-star" id = "SaveIcon"></i>';

    var xhr = new XMLHttpRequest();

    xhr.open("POST", "/search-save", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.send(JSON.stringify({
        SessionId: SessionId,
        ID: Id
    }));
}

function CreateCookie()
{
    document.cookie = SessionId + ";expires=Sat, 10 Apr 2021 12:00:00 UTC";
} 

