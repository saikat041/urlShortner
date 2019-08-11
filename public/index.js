function create(){
    var longUrl = document.getElementById("longUrl").value;
    var url = 'http://localhost:3000/api/getShortURL';

    var body = JSON.stringify({ longUrl : longUrl });
    var headers = new Headers({ 'Content-Type' : 'application/json' });

    fetch(url, {method : 'POST', body : body, headers : headers})
    .then(res => res.json())
    .then(function(res){
        document.getElementById("output").innerHTML = res;
    });

}