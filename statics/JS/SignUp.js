/* 
    This file contains all the locally used stuff like a base layer. 
    
    Page.html -> - main.js (code used across all pages like the navbar updates)
                 - Page.js (code that is specific for that page and that page only wich is not included in the other pages)
*/

// Toggles between show password in input or hiding it (for password or confirm password)

var UsernameInput = document.getElementById("InputUsername");
var PasswordInput = document.getElementById("InputPassword");

var PasswordIcon = document.getElementById("PasswordIcon");


/*
var PasswordShow = false;
var ConfirmPasswordShow = false;

var PasswordInput = document.getElementById("PasswordIcon");
var PasswordConfirmInput = document.getElementById("ConfirmPasswordIcon");

var PasswordInput = document.getElementById("InputPassword");
var PasswordConfirmInput = document.getElementById("InputConfirmPassword");


function TogggleShowPassword(WichInput)
{
    if(WichInput == "Password")
    {
        if(PasswordShow == false)
        {
            PasswordIcon.classList.remove("fa-lock");
            PasswordIcon.classList.add("fa-lock-open");

            PasswordInput.type = "text";
        }

        if(PasswordShow == true)
        {
            PasswordIcon.classList.remove("fa-lock");
            PasswordIcon.classList.add("fa-lock-open");

            PasswordInput.type = "password";
        }
    }

    if(WichInput == "ConfirmPassword")
    {
        if(ConfirmPasswordShow == true)
        {
            ConfirmPasswordIcon.classList.remove("fa-lock");
            ConfirmPasswordIcon.classList.add("fa-lock-open");

            ConfirmPasswordInput.type = "text";
        }

        if(ConfirmPasswordShow == false)
        {
            ConfirmPasswordIcon.classList.remove("fa-lock");
            ConfirmPasswordIcon.classList.add("fa-lock-open");

            ConfirmPasswordInput.type = "password";
        }
    }
}
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