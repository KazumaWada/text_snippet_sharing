//ここにはnodeとdbを接続するためだけのコードが書かれている。
const mysql = require('mysql');

// データベースへの接続情報
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'snippet',
    password: 'wmkm0511',
    database: 'snippet_db'
});

// データベースに接続
connection.connect((err) => {
    if (err) {
        console.error('データベースへの接続に失敗しました。', err);
        throw err;
    }
    console.log('データベースに接続しました。');
});

exports.connection = connection; // 他のファイルから接続を使えるようにする
