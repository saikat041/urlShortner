function create(){
    var longUrl = document.getElementById("longUrl").value;
    var url = "/api/getShortURL";

    var body = JSON.stringify({ longUrl : longUrl });
    var headers = new Headers({ 'Content-Type' : 'application/json' });

    fetch(url, {method : 'POST', body : body, headers : headers})
    .then(res => res.json())
    .then(function(res){
        document.getElementById("output").innerHTML = res.shortUrl;
        document.getElementById("link").setAttribute("href", res.shortUrl);
    });

}

function copyShortUrl(){
  var shortUrl = document.getElementById("output").innerText;
  navigator.clipboard.writeText(shortUrl);
}