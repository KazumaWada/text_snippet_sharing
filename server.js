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

// GETリクエストを処理するエンドポイントを追加
//DBからget
app.get('/', (req, res) => {
  db.connection.query('SELECT content FROM departments', (err, results) => {
    if (err) {
      console.log('DBデータ取得エラー', err);
      res.status(500).send('error fetching data');
      return;
    }
    // res.json(results);
    //{\"userInput\":\"//Hello, Monaco Editor!\",\"random\":\"zjaVOu3Twh\"}"}]
    // const contentObj = JSON.parse(results);
    // console.log(contentObj);
    // const userInput = contentObj.userInput;
    // res.json({userInput:userInput});
    //jsonデータをclientに渡す。
    res.json(results);//expressでは、jsonだけでjson.parseの意味になる
    //DBからgetしたデータ//
    //{"content":"{\"userInput\":\"//Hello, Monaco Editor!\",\"random\":10}"}].content
    // const contentObj = JSON.parse(results[0].content);
    // const userInput = contentObj.userInput;
    // const random = contentObj.random;

    // res.json({userInput: userInput, random:random});
  });
});

// サーバー側でランダムなURLに対応するエンドポイントを作成する部分
// /:これで動的にrouteが扱われる事ができている。
// /:randomURLはexpressルーティングによって提供されているパラメーター。(ってことはreq.params.randomURLも元々備わっている。)
//randomURLのおかげでいちいちひとつづつファイル(エンドポイント)を作らなくて良い、変更が容易
app.get('/index.html/:randomURL', (req, res) => {
  console.log("app get randomURL")
  const random = req.params.randomURL; // URLからランダムな部分を取得
  //DBのrandom列からrandomURLと一致する行を取得
  db.connection.query('SELECT content FROM departments WHERE random = ?', [random], (err, results) => {
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
    const content = JSON.parse(results[0].content);
    const userInput = content.userInput;
    res.send(userInput); // データをクライアント側に返す
  });
});


// POSTリクエストを処理するエンドポイントを追加
//DBにpost

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
      
      console.log("user input:", userInput);
      console.log("random: ",random);
      db.connection.query('INSERT INTO departments (content) VALUES (?)', [clientData], (err, results) => {
        if (err) {
          console.error('クエリの実行に失敗しました。', err);
          res.status(500).send('Internal Server Error');
        } else {
          // console.log('クエリの実行結果:', results);
          console.log("clientData: "+clientData);
          res.status(200).json({ message: 'Data inserted successfully' });
        }
      });
    } catch (error) {
      console.error('Error parsing json:', error);
      res.status(400).send('Bad Request');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
