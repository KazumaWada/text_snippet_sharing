const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const fs = require('fs');//fileSystem
const PORT = 5501;

// CORS対応のためにcorsミドルウェアを追加
app.use(cors({
  origin: 'http://127.0.0.1:5500', // クライアントのポート番号5500を許可
  methods: ['GET', 'POST'], // 許可するHTTPメソッド
  allowedHeaders: ['Content-Type'] // Content-Typeを許可する
}));
//clientに/snippetsのアクセスも許可
app.use('/snippets', express.static('snippets'));

//global//
const clientRoot = 'http://127.0.0.1:5500';

// {userInput,random}をDBに格納
app.post('/', (req, res) => {  
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    try {
      //dataの中身はバッファだから
      const parsedData = JSON.parse(data);
      //送られてきたjsonを文字列へ直す。DBに格納するために。
      const userInput = parsedData.userInput;
      const random = parsedData.random;
      
      //こでもう一度stringifyを書いてこの形でも文字列にする。
      const clientData = JSON.stringify({
        userInput: userInput,
        random: random
      });
      console.log("before insert user input:" + userInput);
      console.log("before insert random: " + random);
      db.connection.query('INSERT INTO departments (content) VALUES (?)', [clientData], (err, results) => {
        if (err) {
          console.error('クエリの実行に失敗しました。', err);
          res.status(500).send('Internal Server Error');
        } else {
          //成功メッセージ
          console.log('Data successfully inserted to DB');
          console.log("after insert user input:" + userInput);
          console.log("after insert random: " + random);
          //成功したらDBに挿入されたデータを返す
          res.status(200).json({ userInput: userInput, random: random });
        }
      });
    } catch (error) {
      console.error('Error parsing json:', error);
      res.status(400).send('Bad Request');
    }
  });
});

//DBから{userInput,random}をget//
app.get('/', (req, res) => {
  db.connection.query('SELECT content FROM departments', (err, results) => {
    if (err) {
      console.log('DBデータ取得エラー', err);
      res.status(500).send('error fetching data');
      return;
    }
    //.sendは必要ないの?
    res.json(results);//expressでは、jsonだけでjson.parseの意味になる
  });
});

//serverにdataが入ったhtmlファイルを送る
app.post('/random', (req, res) => {
  //userInput,randomのデータを取得して、jsonに変換する
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    try {
      let parsedData = JSON.parse(data);
      let userInput = parsedData.userInput;
      let random = parsedData.random;
      let fileURL = `${random}.html`;

      function htmlContent(userInput) {
        return `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Generated HTML</title>
          </head>
          <body>
            <p>${userInput}</p>
            <a href="${clientRoot}">back to home</a>
          </body>
          </html>`;
      }

      //ファイルを作成&それとfileURLを結びつける
      fs.writeFile(`snippets/${random}.html`, htmlContent(userInput),(err) =>{
        if(err){
          console.error("ファイル作成中にerror発生",err);
          res.status(500).send('Internal server error');
          //return;
        }
        //send to client(htmlFile&URL connected to it)
        console.log({fileURL: `http://127.0.0.1:5500/snippets/${fileURL}`,htmlContent: htmlContent});
        res.status(200).json({fileURL: `http://127.0.0.1:5500/snippets/${fileURL}`,htmlContent: htmlContent});
      })
    } catch (error) {
      console.error('Error parsing json:', error);
      res.status(400).send('Bad Request');
    }
  });

  //3userInput,randomを使って動的ファイルを作成する
  //4client側に送信する
  
  
});

app.get('/all',(req,res) =>{
  console.log("try to grab all snippets")
  //{userInput,random}を取ってくる
  //↑すでにclientで両方取ってくる前提で書かれているから
  db.connection.query('SELECT content FROM departments', (err, results)=>{
    if(err){
      console.log('DBデータ取得エラー', err);
      res.status(500).send('error fetching data');
      return;
    }
    res.json(results);
  })
  //DBからのresをclientへ送信する
  
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
