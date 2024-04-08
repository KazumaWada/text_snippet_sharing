//ここにはnodeとdbを接続, db関連のするためだけのコードが書かれている。
const mysql = require('mysql');

// データベースへの接続情報
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'snippet',
    password: 'wmkm0511',
    database: 'snippet_db'
});

// //server.jsでもconection変数を使えるようにする。
// module.exports = connection;

// データベースに接続
connection.connect((err) => {
    if (err) {
        console.error('データベースへの接続に失敗しました。', err);
        throw err;
    }
    console.log('データベースに接続しました。');
});

// DBにあるデータを取得(これをさらにクライアントに送りたい。)
connection.query('SELECT * FROM departments', (err, results, fields) => {
    if (err) {
      console.error('クエリ実行中にエラーが発生しました。エラー:', err);
      return;
    }
    //console.log('取得したデータ:', results);
  });

// server側でimportした時にqueryを定義していないといけないから。
function query(sql, callback) {
  connection.query(sql, callback);
}

module.exports = {
  connection: connection,
  query: query
}
