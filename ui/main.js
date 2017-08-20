var request = new XMLHttpRequest();
request.open("GET","http://kedarcoc.imad.hasura-app.io/visits");
var count=request.responseText;
var span =document.getElementById('visits');
span.innerHTML=count;
request.send(null);