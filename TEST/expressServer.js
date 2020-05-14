const express = require('express')
const app = express()
const path = require('path')
var jwt = require('jsonwebtoken');
var request = require('request')
var mysql = require('mysql');

app.set('views', path.join(__dirname, 'views')); //ejs의 view파일이 어디에 있는지 알려줌
app.set('view engine', 'ejs'); // ejs라는 템플릿엔진이 파일을 읽어오는 디렉토리로 선정하는 구문

app.use(express.static(path.join(__dirname, 'public')));//to use static asset

app.use(express.json());  
app.use(express.urlencoded({extended:false}));  //express 에서 json을 보내는걸 허용하겠다

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1q2w3e4r',
    database : 'fintech'
})

connection.connect();

app.get('/', function (req, res) {
    var title = "javascript"
  res.send('<html><h1>'+title+'</h1><h2>contents</h2></html>')
})

app.get('/ejs', function (req, res) {
    res.render('test')//render 함수, 뭘 보여줄건지 결정하는 함수
})

app.get('/test', function(req,res){
    res.send('Test')
}) // framework 는 룰을 강요, library는 시점을 개발자가 지정할 수 있다

app.get('/design', function(req,res){
    res.render('designTest')
})

app.get('/login', function(req, res){
    res.render('login')
})

//datasend Router add
app.get('/dataSend', function(req,res){
    res.render('dataSend')
})

app.post('/getTime', function(req, res){
    var nowTime = new Date();
    res.json(nowTime);
})

app.post('/getData', function(req, res){
    var userData=req.body.userInputData;
    console.log('userData = '+ userData);
    res.json(userData + "!!!!!!")
})

//--------------service start //
app.get('/signup', function(req,res){
    res.render('signup')//데이터 받을거 아니니까 render
})


app.get('/authResult', function(req, res){
    var authCode = req.query.code
    //console.log(authCode)
    //res.json(authCode);

    var option = {
        method: "POST",
        url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
        header : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        form : {
            code: authCode,
            client_id:'VjmBN2T6n1yY5xWny2lqJdZcMsnMcvJINSVsPp1s',
            client_secret:'0rmRcngVr87GTQG4VFZeQcQlitHcxV6rmzj5v5HJ',
            redirect_uri:'http://localhost:3000/authResult',
            grant_type:'authorization_code'

        }
    }
    request(option, function(err, response, body){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            var accessRequestResult = JSON.parse(body);
            console.log(accessRequestResult);
            res.render('resultChild', {data : accessRequestResult} )

        }
    })
})

app.post('/signup', function(req, res){
    //data req get db store
    var userName = req.body.userName
    var userEmail = req.body.userEmail
    var userPassword = req.body.userPassword
    var userAccessToken = req.body.userAccessToken
    var userRefreshToken = req.body.userRefreshToken
    var userSeqNo = req.body.userSeqNo
    console.log(userName, userAccessToken, userSeqNo);

    var sql = "INSERT INTO fintech.user (name, email, password, accesstoken, refreshtoken, userseqnum) values (?, ?, ?, ?, ?, ?)";
    connection.query(sql, 
        [userName, userEmail, userPassword, userAccessToken, userRefreshToken, userSeqNo],
    function(err, result){
        if(err){
            console.log(err);
            res.json(0);
            throw err;
        }
        else{
            res.json(1)
        }
    })
})

app.post('/login', function(req, res){
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    var sql = "SELECT * FROM user WHERE email = ?";
    connection.query(sql, [userEmail], function(err, result){
        if(err){
            console.error(err);
            res.json(0);
            throw err;
        }
        else {
            if(result.length == 0){
                res.json(3)
            }
            else {
                var dbPassword = result[0].password;
                if(dbPassword == userPassword){
                    var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%"
                    jwt.sign(
                      {
                          userId : result[0].id,
                          userEmail : result[0].email
                      },
                      tokenKey,
                      {
                          expiresIn : '10d',
                          issuer : 'fintech.admin',
                          subject : 'user.login.info'
                      },
                      function(err, token){
                          console.log('로그인 성공', token)
                          res.json(token)
                      }
                    )            
                }
                else {
                    res.json(2);
                }
            }
        }
    })
})

app.listen(3000)