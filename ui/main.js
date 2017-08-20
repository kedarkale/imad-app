var request = new XMLHttpRequest();

request.onreadystatechange = function () {
    if(request.readyState===XMLHttpRequest.DONE){
        var count=request.responseText;
        var span =document.getElementById('visits');
        span.innerHTML=count.toString();
    }
}

request.open("GET","http://kedarcoc.imad.hasura-app.io/visits",true);
request.send(null);