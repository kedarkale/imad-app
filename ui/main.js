var request = new XMLHttpRequest();
request.open("GET","http://kedarcoc.imad.hasura-app.io/visits");
requst.send(null);
var count=request.responsetext();
var span =document.getElementById('visits');
span.innerHTML=count;