

function Login(){
    Name = document.getElementById("Input_UserName").value;
    Pass = document.getElementById("Input_Password").value;
    var DataSent = "Name="+Name+"&Pass="+Pass;
    Send_Post_Info("Login_Data_Send.html",DataSent,"test")
}

function Send_Post_Info(file,value,responseID){
    var xttp = new XMLHttpRequest();
    xttp.onreadystatechange = function(){
        if(xttp.readyState == 4 && xttp.status == 200){
            document.getElementById(responseID).innerText = this.responseText;
        }
    }
    xttp.open("POST",file,true);
    xttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xttp.send(value); 
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function Slide_Menu_Toggle(){
    Menu = document.getElementById("Slide_Menu");
    Menu.offsetHeight;

    if(Menu.style.display == "none"){
        Menu.classList.remove("SlideIn_Anim");

        Menu.classList.add("SlideOut_Anim");
        Menu.style.display = "block";
    }else{
        Menu.classList.remove("SlideOut_Anim");

        Menu.classList.add("SlideIn_Anim");
        await delay(1000);
        Menu.style.display = "none";
    }
}