// db.jsを読み込む
const db = require('./db');
const http = require('http');

const PORT = 5501; // サーバーのポート番号を指定
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // CORS対応のために追加
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // クライアントのポート番号5500を許可
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  // 追加: プリフライトリクエストに対応するための設定
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Max-Age': '86400' // キャッシュする秒数
    });
    res.end();
    return;
  }

  if (method === 'POST' && url === '/') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        //クライアントデータ
        const userInput = JSON.parse(data).userInput;
        console.log("user input:", userInput);
        //DBクエリ実行
        //クライアントデータをdbのtableに挿入
        db.connection.query('INSERT INTO departments (content) VALUES (?)', [userInput], (err, results) => {
          if (err) {
            console.error('クエリの実行に失敗しました。', err);
            res.writeHead(500);
            res.end('Internal Server Error');
          } else {
            console.log('クエリの実行結果:', results);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`data: ${userInput}\n`);
          }
        });
        //DBクエリ実行
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// HTTPサーバーを起動
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
