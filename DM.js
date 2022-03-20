const express = require('express');
const axios = require('axios').default;
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

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

function ReadUserDataFile(Users,Password){
    var data = '';
    const StreamReader = fs.createReadStream(__dirname+'/_users/Users.txt','utf8');
    StreamReader.setEncoding('UTF8');

    StreamReader.on('data', function(chunk) {
        data += chunk;
     });
     
     StreamReader.on('end',function() {
        console.log(data);
     });

    StreamReader.on('error', function (error) {
        console.log(`error: ${error.message}`);
    });
    
}


app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/_web/index.html");
});

app.post('/Login_Data_Send.html',(req,res)=>{
    try {
        if(req.body.Name == "" || req.body.Pass == ""){
            //console.log(req.body.Name +"|"+req.body.Pass);
            res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
        }else{
            console.log(req.body.Name +"|"+req.body.Pass);

            var UserName = req.query.Name;
            var Pass = req.query.Pass;
            ReadUserDataFile();
            res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
        }

    } catch (error) {
        console.log(error);
    }
});

https.createServer(credentials, app).listen(3000,function(){
    console.log("Oi cunt server is running on port 3000");
});

app.use(express.static(__dirname+'/_web'));

