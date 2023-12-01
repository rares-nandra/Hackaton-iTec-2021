/* 
    This file contains all the locally used stuff like a base layer. 
    
    Page.html -> - main.js (code used across all pages like the navbar updates)
                 - Page.js (code that is specific for that page and that page only wich is not included in the other pages)
*/

// Toggles between show password in input or hiding it

var UsernameInput = document.getElementById("InputUsername");
var PasswordInput = document.getElementById("InputPassword");

var PasswordIcon = document.getElementById("PasswordIcon");

/*
var PasswordShow = false;


PasswordIcon.onclick = function()
{
    console.log("hey");
    if(PasswordShow == false)
    {
        PasswordIcon.classList.remove("fa-lock");
        PasswordIcon.classList.add("fa-lock-open");

        PasswordInput.type = "text";
        PasswordShow = true;
    }

    if(PasswordShow == true)
    {
        PasswordIcon.classList.remove("fa-lock");
        PasswordIcon.classList.add("fa-lock-open");

        PasswordInput.type = "password";
        PasswordShow = false;
    }
};
*/

var RememberMe = document.getElementById("RememberMe");

function CreateCookie()
{
    if(RememberMe.checked == true)
    {
        document.cookie = "RememberMe=true;expires=Sat, 10 Apr 2021 12:00:00 UTC";
    }
    else
    {
        document.cookie = "RememberMe=false;expires=Sat, 10 Apr 2021 12:00:00 UTC";
    }
} 
