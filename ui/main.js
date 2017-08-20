var request = new XMLHttpRequest();
request.open("GET","http://kedarcoc.imad.hasura-app.io/visits",true);
var count=request.responseText;
var span =document.getElementById('visits');
span.innerHTML=count.toString();
request.send(null);