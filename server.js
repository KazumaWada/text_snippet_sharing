// Expressを読み込む
const express = require('express');
const app = express();

// db.jsを読み込む
const db = require('./db');

// サーバーのポート番号を指定
const PORT = 5501;

// CORS対応のために追加
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // クライアントのポート番号5500を許可
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

// GETリクエストを処理するエンドポイントを追加
app.get('/', (req, res) => {
  // DBから全snippetsデータを取得する
  db.connection.query('SELECT content FROM departments', (err, results) => {
    if (err) {
      console.log('全データ取得しようとしたらエラー', err);
      res.status(500).send('error fetching data');
      return;
    }
    res.json(results);
  });
});

// POSTリクエストを処理するエンドポイントを追加
app.post('/', (req, res) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    try {
      const userInput = JSON.parse(data).userInput;
      console.log("user input:", userInput);
      // DBにデータを挿入するクエリ
      db.connection.query('INSERT INTO departments (content) VALUES (?)', [userInput], (err, results) => {
        if (err) {
          console.error('クエリの実行に失敗しました。', err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('クエリの実行結果:', results);
          res.status(200).json({ message: 'Data inserted successfully' });
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(400).send('Bad Request');
    }
  });
});

// HTTPサーバーを起動
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
