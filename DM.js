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
const sessions = require('express-session');

//
var sanitizer_string = require("string-sanitizer");
const { callbackify } = require('util');
const { resolve } = require('path');
const { ppid } = require('process');



// session middleware
app.use(sessions({
    secret: "thisismysecrctekeysadfouhbq3345yuylajlsdcv",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(express.static(__dirname+'/_web'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// CERTIFICATES PART

// const privateKey = fs.readFileSync(__dirname+'/SSL/server.key', 'utf8');
// const certificate = fs.readFileSync(__dirname+'/SSL/server.cert', 'utf8');


// const credentials = {
//     key: privateKey,
//     cert: certificate
// };

// END OF CERTIFICATES


function Check_Login(Users,Password){
    return new Promise((resolve,reject)=> {

        // This is to check whether they have inserted symbols or no

            var userFound = false;

            const readInterface = readline.createInterface({
                input: fs.createReadStream(__dirname+'/_users/Users.txt')
            });

            readInterface.on('line', function(chunk) {
                //console.log(chunk);
                if(chunk.split('|')[0] == Users && chunk.split('|')[1] == Password){
                    //console.log("Found user");
                    userFound = true;
                    readInterface.close(); // to stop the reader from continuing to save peformance
                    readInterface.removeAllListeners()
                }
            });

            readInterface.on('end',function() {
                if (userFound){
                    resolve("true");
                }else{
                    resolve("false");
                }
            });

            readInterface.on('close',function() {
                if (userFound){
                    resolve("true");
                }else{
                    resolve("false");
                }
            });

            readInterface.on('error', function (error) {
                console.log(`error: ${error.message}`);
            });


    });

}



function UserName_Found(Users){
    return new Promise((resolve,reject)=> {

        var userFound = false;

        const readInterface = readline.createInterface({
            input: fs.createReadStream(__dirname+'/_users/Users.txt'),
            output: process.stdout,
            console: false
        });

        readInterface.on('line', function(chunk) {
            //data += chunk;
            // check whether password and username is matching
            //console.log("Username|"+Users+"|password|"+Password);
            if(chunk.split('|')[0] == Users){
                //console.log("Found user");
                userFound = true;
                readInterface.close(); // to stop the reader from continuing to save peformance
                readInterface.removeAllListeners();
            }
        });
        
        readInterface.on('end',function() {
            if (userFound){
                resolve("true");
            }else{
                resolve("false");
            }
        });

        readInterface.on('close',function() {
            if (userFound){
                resolve("true");
            }else{
                resolve("false");
            }
        });

        readInterface.on('error', function (error) {
            console.log(`error: ${error.message}`);
        });


    });
}

app.get('/',function(req,res){
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else{
        res.sendFile(__dirname + "/_web/index.html");
    }

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

            Check_Login(UserName,Pass).then((resp)=> {
                

                if(resp == "true"){
                    session=req.session;
                    session.userid=UserName;
                    // console.log(req.session);

                    res.send("Logged in!");
                }else if (resp == "false"){
                    res.send('Invalid username or password');
                }else{
                    res.send("Unkown error has occured");
                }
                console.log("User check - "+returnVal);

            });

        }

    } catch (error) {
        console.log(error);
    }
});

// https.createServer(credentials, app).listen(3000,function(){
//     console.log("Oi cunt server is running on port 3000");
// });
app.listen(3000,function(){
    console.log("Oi cunt server is running on port 3000");
});

