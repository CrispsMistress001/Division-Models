const express = require('express');
const axios = require('axios').default;
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();
const asyncHandler = require('express-async-handler')
// to use my own functions


// SESSION AND COOCKIE CONTROL
const oneDay = 1000 * 60 * 60 * 24;
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

//
var sanitizer_string = require("string-sanitizer");
const { callbackify } = require('util');
const { resolve } = require('path');



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

const privateKey = fs.readFileSync(__dirname+'/SSL/server.key', 'utf8');
const certificate = fs.readFileSync(__dirname+'/SSL/server.cert', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/DLS.com/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate
};

// END OF CERTIFICATES


async function Check_Login(Users,Password){
    var userFound = false;
    // This is to check whether they have inserted symbols or no
    if(sanitizer_string.sanitize(Users) == Users && sanitizer_string.sanitize(Password)==Password){
        // get sanitized results
        Users = sanitizer_string.sanitize(Users);
        Password = sanitizer_string.sanitize(Password);

        
        //var data = '';
        //created a stream reader as it is better for peformance as it 
        //uses less memory as it does not save the file into RAM before reading
        const StreamReader = fs.createReadStream(__dirname+'/_users/Users.txt','utf8');
        StreamReader.setEncoding('UTF8');

        StreamReader.on('data', function(chunk) {
            //data += chunk;
            // check whether password and username is matching
            console.log("Username|"+Users+"|password|"+Password);
            if(chunk.split('|')[0] == Users && chunk.split('|')[1] == Password){
                console.log("Found user");
                userFound = true;
                StreamReader.destroy(); // to stop the reader from continuing to save peformance
            }
        });
        
        StreamReader.on('end',function() {
        });

        StreamReader.on('error', function (error) {
            console.log(`error: ${error.message}`);
        });

        if(userFound){
            return ("true");

        }else{
            return ("false");
        }
    }
    else{
        return ("Please make sure you have not inserted any symbols");
    }

}


app.get('/',(req,res)=>{
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

            var returnVal = await Check_Login(UserName,Pass);
            console.log("User check - "+returnVal);


            if(returnVal == "true"){
                session=req.session;
                session.userid=UserName;
                console.log(req.session);
                res.send("Logged in");
            }else if (returnVal== "false"){
                res.send('Invalid username or password');
            }else{
                res.send(returnVal);
                
            }
 
            //var returnVal =  Check_Login(UserName,Pass);




            //res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
        }

    } catch (error) {
        console.log(error);
    }
});

https.createServer(credentials, app).listen(3000,function(){
    console.log("Oi cunt server is running on port 3000");
});

