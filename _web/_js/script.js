

function Login(){
    Name = document.getElementById("Input_UserName").value;
    Pass = document.getElementById("Input_Password").value;
    var DataSent = "Name="+Name+"&Pass="+Pass;
    Send_Post_Info("Login_Data_Send.html",DataSent,"test").then((resp)=>{
        document.getElementById("Response_Tag").innerText = resp;
        if (resp == "Logged in!"){
            setTimeout(() => {
            window.location.href = 'index.html';
            }, 1000);
        }
    });
}

function Register(){
    Name = document.getElementById("Input_UserName").value;
    Pass = document.getElementById("Input_Password").value;
    Pass2 = document.getElementById("Input_Password2").value;
    Email = document.getElementById("Input_Email").value;

    var DataSent = "Name="+Name+"&Pass="+Pass+"&Pass2="+Pass2+"&Email="+Email;
    Send_Post_Info("Register_User.html",DataSent,"test").then((resp)=>{
        document.getElementById("Response_Tag").innerText = resp;
            
        if (resp == "Logged in!"){
            setTimeout(() => {
            window.location.href = 'index.html';
            }, 1000);
        }
    });
}

function Send_Post_Info(file,value){
    return new Promise((resolve,reject)=> {
        var xttp = new XMLHttpRequest();
        xttp.onreadystatechange = function(){
            if(xttp.readyState == 4 && xttp.status == 200){
                var response = this.responseText;
                resolve(response);
            }
        }
        xttp.open("POST",file,true);
        xttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xttp.send(value); 
    });
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

var Toggled_Burgar = false;

function BurgerMenu_Toggle(x) {
    x.classList.toggle("change");
    if (1000>window.innerWidth){
        document.getElementById("Nav_Burgar_Menu").offsetHeight;
        if(!Toggled_Burgar){
            Toggled_Burgar = true;
            document.getElementById("Nav_Burgar_Menu").style.display = "flex";
        }else{
            Toggled_Burgar = false;
            document.getElementById("Nav_Burgar_Menu").style.display = "none";
        }
    }



}

function BurgerMenu_Toggler(){
    if (1000<window.innerWidth){
        document.getElementById("Nav_Burgar_Menu").style.display = "none";
    }else{
        if(Toggled_Burgar == true){
            document.getElementById("Nav_Burgar_Menu").style.display = "flex";
        }
    }
}

addEventListener("onload",function(event){
    BurgerMenu_Toggler();
});
addEventListener("resize",function(event){
    BurgerMenu_Toggler();
});