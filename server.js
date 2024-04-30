const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 5501;

// CORS対応のためにcorsミドルウェアを追加
app.use(cors({
  origin: 'http://127.0.0.1:5500', // クライアントのポート番号5500を許可
  methods: ['GET', 'POST'], // 許可するHTTPメソッド
  allowedHeaders: ['Content-Type'] // Content-Typeを許可する
}));

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

//DBからuserInputをgetしてserverへ送る
//serverへ送る部分はfunctionで分離した方がいいかも。
app.get('/:randomURL', (req, res) => {
  console.log("app get randomURL")
  const random = req.params.randomURL; // 上の:/randomURLの値を取得
  //DBのrandom列からrandomURLと一致する行を取得
  //[重要]そもそもこれが間違っているのでは??
  // db.connection.query('SELECT content FROM departments WHERE random = ?', [random], (err, results) => {
    db.connection.query('SELECT content FROM departments WHERE JSON_EXTRACT(content, \'$.random\') = ?', [random], (err, results) => {
    if (err) {
      console.log('DBデータ取得エラー', err);
      res.status(500).send('error fetching data');
      return;
    }
    if (results.length === 0) {
      // 該当するデータが見つからない場合は404を返す
      res.status(404).send('Data not found');
      return;
    }
    const randomURL = JSON.parse(results);
    res.send(randomURL); // データをクライアント側に返す
  });
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
