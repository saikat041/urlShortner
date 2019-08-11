const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sha1 = require('sha1');

const baseUrl = "http://localhost:3000"
const PORT = 3000; 
const map = {}

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Showing home page
app.get('/', function(req, res){
   res.sendFile(__dirname + '/public/index.html');
});

// API for getting shorter url of input url
app.post('/api/getShortURL', function(req, res){
    var longUrl = req.body.longUrl;
    var key = sha1(longUrl);
    map[key] = longUrl;
    res.json(baseUrl + '/' + key);
});


// Redirection happens here.
app.get('/:key', function(req, res){
    var key = req.params["key"];
    if(key in map) {
        res.redirect(map[key]);
        return;
    }
    res.status(404).send("Not found");
});


// Creating a server
app.listen(PORT, function(){
    console.log('listening on port : ' + PORT);
});