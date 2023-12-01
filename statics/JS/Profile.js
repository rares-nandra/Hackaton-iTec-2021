SessionId = document.cookie;

function GetSaved()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "/saved", false );
    xmlHttp.send(SessionId);

    var Response = JSON.parse(xmlHttp.response); 

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
        PostString = '<div class = "ResultPost"><div class = "BackgroundImage ResultImage ResultImageRight" style = "background-image: url(' + Photo + ');"></div><div class = "ResultTextContainer ResultTextRight BackgroundAccentPrimary text-center"><h1 class = "SubTitle ResultTitle" id = "ResultElement">' + Name + '</h1><p class = "ResultText TextMedium">Covid Safeness: ' + CovidRisk + '</p><p class = "ResultText TextMedium">Weather: ' + Weather + ' Degrees</p><p class = "ResultText TextMedium"><i class = "fas fa-star" id = "SaveIcon"></i></p><div class = "AnimationIncrease0"><a class = "ButtonTransparentMedium ResultReadMore" href = "' + MapsLink + '">Plan trip <i class = "fas fa-angle-right ReadMoreIcon"></i></a>';
    }
    else 
    {
        PostString = '<div class = "ResultPost"><div class = "BackgroundImage ResultImage ResultImageLeft" style = "background-image: url(' + Photo + ');"></div><div class = "ResultTextContainer ResultTextLeft BackgroundAccentPrimary text-center"><h1 class = "SubTitle ResultTitle" id = "ResultElement">' + Name + '</h1><p class = "ResultText TextMedium">Covid Safeness: ' + CovidRisk + '</p><p class = "ResultText TextMedium">Weather: ' + Weather + ' Degrees</p><p class = "ResultText TextMedium"><i class = "fas fa-star" id = "SaveIcon"></i></p><div class = "AnimationIncrease0"><a class = "ButtonTransparentMedium ResultReadMore" href = "' + MapsLink + '">Plan trip <i class = "fas fa-angle-right ReadMoreIcon"></i></a>';
    }

    Post.innerHTML = PostString;
    document.getElementById("SavedResultRow").appendChild(Post);
}
