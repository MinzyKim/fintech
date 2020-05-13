const express = require('express')
const app = express()
const path = require('path')
var request = require('request')

app.set('views', path.join(__dirname, 'views')); //ejs의 view파일이 어디에 있는지 알려줌
app.set('view engine', 'ejs'); // ejs라는 템플릿엔진이 파일을 읽어오는 디렉토리로 선정하는 구문

app.use(express.static(path.join(__dirname, 'public')));//to use static asset

app.use(express.json());  
app.use(express.urlencoded({extended:false}));  //express 에서 json을 보내는걸 허용하겠다

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
    console.log(authCode)
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
        else{
            console.log(body);
        }
    })
})

app.listen(3000)