const express = require('express');
const axios = require('axios').default;
const https = require('https');
const bodyParser = require('body-parser');
const app = express();
const asyncHandler = require('express-async-handler')
// to use my own functions


const fs = require('fs'), readline = require("readline"); // file reader



// SESSION AND COOCKIE CONTROL
const oneDay = 1000 * 60 * 60 * 24;
const cookieParser = require("cookie-parser");

//
var sanitizer_string = require("string-sanitizer");
const { callbackify } = require('util');
const { resolve } = require('path');
const { ppid } = require('process');
const sessions = require('express-session');



// session middleware
app.set('trust proxy', 1)
app.use(sessions({
    secret: "thisismysecrsflkvnshkldfnbjdflbjioej234y48ry69lolnice",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(express.static(__dirname+'/_web'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

var session;
// CERTIFICATES PART

const privateKey = fs.readFileSync(__dirname+'/SSL/server.key', 'utf8');
const certificate = fs.readFileSync(__dirname+'/SSL/server.cert', 'utf8');


const credentials = {
    key: privateKey,
    cert: certificate
};

// END OF CERTIFICATES

// THIS APPLICATION IS MADE TO CHECK EXISTING USERS BY PASSING A NEW PROMISE STATEMENT LIKE EXAMPLE BELOW:
//Check_User(UserName,Pass).then((resp)=> {
// });

// HOWEVER IF NULL DATA PASSED ONTO PASSWORD IT WILL CHECK ONLY FOR MATCHING USERS
function Check_User(Users,Password){
    return new Promise((resolve,reject)=> {

            var userFound = false;

            const readInterface = readline.createInterface({
                input: fs.createReadStream(__dirname+'/_users/Users.txt')
            });

            readInterface.on('line', function(chunk) {
                //console.log(chunk);
                if(chunk.split('|')[0] == Users && Password == null){
                    // console.log("Found user");
                    userFound = true;
                    readInterface.close(); // to stop the reader from continuing to save peformance
                    readInterface.removeAllListeners()
                }else if(chunk.split('|')[0] == Users && chunk.split('|')[1] == Password){
                    // console.log("Found user");
                    userFound = true;
                    readInterface.close(); // to stop the reader from continuing to save peformance
                    readInterface.removeAllListeners()
                }
            });

            readInterface.on('end',function() {
                // console.log("Found user");
                resolve(userFound);
            });

            readInterface.on('close',function() {
                resolve(userFound);
            });

            readInterface.on('error', function (error) {    
                console.log(`error: ${error.message}`);
            });

    });

}

app.get('/',function(req,res){
    res.sendFile(__dirname + "/_web/index.html");
});

app.get('/test',function(req,res){
    session=req.session;
    console.log(session.userid);
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else{
        res.send("Well you are not logged in fucker")
    }

});

app.get('/logout',function(req,res){
    // req.session.destroy(function(err){
    //     console.log("Failed destroying session!:"+err);
    // });
    // req.session = null;


    sess=req.session;
    var data = {
        "Data":""
    };
    sess.destroy(function(err) {
        if(err){
            data["Data"] = 'Error destroying session';
            res.json(data);
            console.log(data);
        }else{
            data["Data"] = 'Session destroy successfully';
            res.json(data);
            console.log(data);

 //res.redirect("/login");
        }
    });
});


app.post('/Login_Data_Send.html',async(req,res)=>{
    try {
        if(req.body.Name == "" || req.body.Pass == ""){
            //console.log(req.body.Name +"|"+req.body.Pass);
            res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
        }else{

            var UserName = req.body.Name;
            var Pass = req.body.Pass;
            //console.log(req.body.Name +"|"+req.body.Pass);

            Check_User(UserName,Pass).then((resp)=> {
                //console.log(resp);
                if(resp){
                    session=req.session;
                    session.userid=UserName;

                    console.log(req.session);

                    res.send("Logged in!");
                }else if (!resp){
                    res.send('Invalid username or password');
                }else{
                    res.send("Unkown error has occured");
                }
                console.log("User check - "+resp);

            });

        }

    } catch (error) {
        console.log(error);
    }
});

/////////////// REGISTER

app.post('/Register_User.html',(req,res)=>{
    try {
        console.log(req.body.Name +"|"+req.body.Pass+"|"+req.body.Pass2);

        if(req.body.Name == "" || req.body.Email == "" || req.body.Pass == "" || req.body.Pass2==""){
            res.send("Each information must be filled!");
        }else if (req.body.Pass != req.body.Pass2){
            res.send("Passwords must be matching!");
        }
        else{
            var UserName = req.body.Name;
            var Email = req.body.Email;
            var Pass = req.body.Pass;
            console.log(UserName +"|"+Pass+"|"+Email);
            Check_User(UserName,null).then((resp)=> {
                if(!resp){
                    session=req.session;
                    session.userid=UserName;

                    console.log(req.session);

                    Register_User(UserName,Pass,Email).then((resp)=> {
                        if(resp){
                            res.send("User account has been succesfully created!");
                        }else if (!resp){
                            res.send('Failed to create the user!');
                        }else{
                            res.send("Unkown error has occured");
                        }
                    });
                }else if (resp){
                    res.send('User with same username has been found');
                }else{
                    res.send("Unkown error has occured");
                }
            });
            
        }

    } catch (error) {
        console.log(error);
        res.send("Unknown error has occured...");
    }
});

function Register_User(Users,Password,Email){
    return new Promise((resolve,reject)=> {
        fs.appendFile(__dirname+'/_users/Users.txt',"\n"+Users+"|"+Password+"|"+Email, function(err){
            if (err) {
                console.log(err);
                resolve(false);
            }
        });
        resolve(true);
    });
}

///////////////// END
// https.createServer(credentials, app).listen(3000,function(){
//     console.log("Oi cunt server is running on port 3000");
// });
app.listen(3000,function(){
    console.log("Oi cunt server is running on port 3000");
});

