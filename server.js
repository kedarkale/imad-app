var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config ={
    user:'kedarcoc',
    database:'kedarcoc',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:'---',
}

var app = express();
app.use(morgan('combined'));

function createArticle (content){
    title=content.title;
    date=content.date;
    heading=content.heading;
    matter=content.matter;
    
    var articleTemplate = `<!doctype html>
                        <html>
                            <head>
                                <title>${title}</title>
                                <link href="/ui/style.css" rel="stylesheet" />
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <!--bootstrap-->
                                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
                                
                            </head>
                            <body>
                                <div class="center">
                                    <img src="/ui/madi.png" class="img-medium"/>
                                </div>
                                <br>
                                <div class="jumbotron">
                                    <h3 class="display-3">${heading}</h3>
                                    <h6 class="display-4">${date.toDateString()}</h6>
                                </div>
                                <div class = "container">
                                    <p>
                                        ${matter}
                                    </p>
                                </div>
                                <div class="articles">
                                    <bold>
                                    <a href='http://kedarcoc.imad.hasura-app.io/'>Home &nbsp&nbsp</a>
                                    
                                    <a href='http://kedarcoc.imad.hasura-app.io/article_one'>Article 1 &nbsp&nbsp</a>
                                    
                                    <a href='http://kedarcoc.imad.hasura-app.io/article_two'>Article 2 &nbsp&nbsp</a>
                                    
                                    <a href='http://kedarcoc.imad.hasura-app.io/article_three'>Article 3 &nbsp&nbsp</a>
                                    
                                    </bold>
                                </div>
                                <!--do not increment counter for every sub-page-->
                                <!--<script type="text/javascript" src="/ui/main.js">-->
                                </script>
                            </body>
                        </html>`
                        
    return articleTemplate;
    
}

//deprecated
/*var articles =  {
    article_one : {
        title : 'A1 | kedar',
        date : '16/08/17',
        heading : 'what is lorem ipsum ?',
        matter : `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
        
    },
    article_two : {
        title : 'A2 | kedar',
        date : '17/08/17',
        heading : 'where does lorem ipsum come from ?',
        matter : `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
        
    },
    article_three : {
        title : 'A3 | kedar',
        date : '16/08/17',
        heading : 'why lorem ipsum ?',
        matter : `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose `,
        
    },
}*/

var visits=0;
function updateVisits (){
    visits+=1;
    return visits.toString();
}

app.get('/visits', function (req, res) {
  res.send(updateVisits());
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/testdb', function (req, res) {
  pool.query('SELECT * FROM "user"', function (error,result){
      if (error){
          res.status(500).send(error.toString());
      }else{
          res.send(JSON.stringify(result.rows));
      }
  });
});

app.get('/:article_name', function (req, res) {
   var article_name = req.params.article_name; 
   console.log(`about to query`);
   pool.query("SELECT * FROM articles WHERE link = $1",[article_name],function (error,result){
       console.log(`fired query`);
       if(error){
           res.status(500).send(error.toString());
       }else{
           if (result.rows.length===0){
               res.status(404).send('Article not found');
           }else{
               var articleData = result.rows[0];
               res.send(createArticle(articleData));
           }
       }
   });
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/kedar.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'kedar.jpg'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
