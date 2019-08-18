const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const shortid = require("shortid");
const validUrl = require('valid-url');

// Configuration
const { PORT, BASE_URL, DB_URL} = process.env;
if(!(PORT && BASE_URL && DB_URL)){
    throw new Error("Define environment variables properly");
}

var myDb;

// Database connection
MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    myDb = db.db('urlshortner');
  });


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


// Showing home page
app.get('/', function(req, res){
   res.sendFile(__dirname + '/public/index.html');
});


// API for getting shorter url of input url
app.post('/api/getShortURL', async function(req, res) {
    var { longUrl } = req.body;

    if(!validUrl.isUri){
        res.json({error : "Invalid URL"});
    }

    var result  = await myDb.collection("urlMapping").find({longUrl}).toArray();
    if(result.length === 0){
        let key = shortid.generate();
        let shortUrl = BASE_URL + '/' + key;
        let obj = {longUrl, shortUrl}
        await myDb.collection('urlMapping').insertOne(obj);
        result.push(obj);
    }

    res.json({ shortUrl : result[0].shortUrl });
});


// Redirection happens here.
app.get('/:key', async function(req, res){
    var key = req.params["key"];
    var shortUrl = BASE_URL + '/' + key;
    var result = await myDb.collection('urlMapping').find({shortUrl}).toArray();
    if(result.length === 0){
        res.status(404).send("Not found");
    }
    var { longUrl } = result[0];

    if( !(longUrl.startsWith("http://") || longUrl.startsWith('https://')) ) {
        longUrl = 'http://' + longUrl;
    }

    res.redirect(longUrl);    
});


// Creating a server
app.listen(PORT, function(){
    console.log('listening on port : ' + PORT);
});