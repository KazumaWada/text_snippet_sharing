Text Snippet Sharing Service
ユーザーがプレーンテキストやコードスニペットを共有できるオンラインコード＆テキストスニペット共有サービスです。このプラットフォームは、ユーザーアカウントの必要がなく、簡単にテキストとコードを共有できます。

ユーザーは、テキストエリアにテキストやコードを貼り付け、共有コンテンツの一意の URL が生成される機能を持たせる必要があります。この URL は、他の人とコンテンツを共有するために使用できます。一般的なプログラミング言語の構文のハイライトがコア機能として必要です。

機能要件

1. スニペットのアップロード
   ユーザーはテキストエリアにテキストやコードを貼り付けます。
   可読性を向上させるために、構文ハイライトを適用したいプログラミング言語を選択できます。
   ユーザーが内容を送信すると、スニペット用の一意の URL が生成されます。URL は一意の文字列に基づいています。フォーマットは、https://{domain}/{path}/{unique-string} のような形で、URL のパースには、例えば parse_url のようなライブラリを活用することが可能です。

2. スニペットの閲覧
   一意の URL にアクセスしてスニペットを閲覧できます。
   コードの場合、提出時に選択した言語に基づいてシンタックスハイライトを適用します。

3. スニペットの有効期限設定
   スニペットの有効期限（例：10 分、1 時間、1 日、永続）を設定するオプションを持ちます。
   期限切れになったスニペットは自動的に削除され、「Expired Snippet」というメッセージを表示します。

4. データストレージ
   バックエンドへ送信される全てのユーザーからの入力は、厳格に検証とサニタイズが行われる必要があります。
   SQL インジェクションを防ぐために、スニペットは安全に保存します。

5. フロントエンドインターフェース
   シンプルで使いやすいインターフェースを持ち、テキストまたはコードの送信を容易にします。
   スニペットが成功して送信されると、その内容にアクセスできる一意の URL が生成され、ユーザーに表示されます。

6. エラーハンドリング
   大量のテキストやコード、またはサポートされていない文字が送信された場合でも、適切に処理し、エラーメッセージを表示します。

技術要件

ウェブインターフェース
フロントエンドのデザインには HTML/CSS を使用します。
ダイナミックなインタラクションには JavaScript を利用します。
テキストやコード入力に monaco エディタの使用を検討します。

バックエンド
スニペットの送信、URL の生成、スニペットの提供を処理するために、静的型付けが可能なサーバサイドの OOP 言語、例えば PHP 8.0 を使用します。
一意の URL 生成には、hash()のようなハッシュ関数を利用します。

データベース
提出されたスニペット、それらの URL、ハイライト用のプログラム言語、送信時刻、有効期限を記録するために MySQL を使用します。

ミドルウェア
必要なすべてのデータベーススキーマをセットアップするためのマイグレーション管理システムを使用します。
データベースとのインタラクションには MySQLWrapper クラスを採用します。

非機能要件

デプロイメント
サービスは、ユーザーが簡単に記憶できるドメインやサブドメインで公開する必要があります。
サービスが常に利用可能で、サービスが利用できない時間が極力少ない状態を保つ必要があります。
エンジニアが迅速に開発とデプロイを行えるように、リポジトリ同期の Git コマンドを実行するだけでコードの更新と同期がライブで行える必要があります。

パフォーマンス
スニペットを効率よく取得し、ユーザーが迅速に閲覧できるようにする必要があります。
ページの読み込みが極端に遅くなることなく、速やかに構文ハイライトを表示できるようにします。

スケーラビリティ
大量のスニペットが同時に送信されても、それらをスムーズに処理できるシステムを確立する必要があります。

セキュリティ
スニペットは安全に保存され、不正アクセスを防ぐ仕組みを整える必要があります。
安全な接続とデータの暗号化を保証するために、HTTPS を採用する必要があります。

---

monaco エディターをブラウザに貼っつける
↓
スニペットの送信ボタン,送信内容を console に表示できるようにする
↓
monaco editor の input どうやって取得するんだ?
gpt に聞く
doc を見る->そもそも doc の見方を調べる
続き
どうやって取得するかは gpt に聞いた。
↓

Monaco Editor でユーザーが入力したコードを取得するには、editor.getValue()メソッドを使用します。このメソッドは、現在のエディターの内容を取得します。

この例では、Monaco Editor でユーザーが入力したコードを取得するために、editor.getValue()メソッドを使っています。ユーザーが入力したコードは userCode 変数に格納され、それを使って任意の処理を行うことができます。

```javascript
// Monaco Editorを初期化する
var editor = monaco.editor.create(document.getElementById("editor"), {
  value: 'console.log("Hello, Monaco Editor!");',
  language: "javascript",
  theme: "vs-dark", // テーマを選択する（例：'vs', 'vs-dark', 'hc-black'など）
});

// sendボタンの要素を取得する
var sendButton = document.getElementById("sendButton");

// sendボタンがクリックされた時の処理を追加する
sendButton.addEventListener("click", function () {
  // ユーザーが入力したコードを取得する
  var userCode = editor.getValue();
  // userCodeを使って何か処理を行う（例：サーバーに送信する、ローカルで実行するなど）
  console.log("User code:", userCode);
});
```

続き
value 取得できたから、php に送信してみる。
そもそもなぜ処理をサーバーに送信しなきゃいけないんだっけ?js と db だけだとダメなの?gpt に聞いてみる

f データを送信する
b データを検証して受け取る
bDB に追加する(後からユーザーがスニペット一覧を見れるようにするため、スニペットの有効期限を設定して期限が過ぎたら expire と表示させるため)
bURL を生成して返す
fURL を受け取る

続き
これらのデータのやり取りを見て、send,receive 関数を作るのかとかどうやってデータのやり取りを書くのかとかを調べる
m0

client
input を送信する
server
受け取る、検証、DB に追加、url を生成、それを送信
client
url を表示する

今
ちゃんとクライアントのデータをサーバーで取得できた。
次はそのデータを検証して DB に入れる。
ってことは検証のコードと DB のスキーマを考える。
今のゴール
node と DB を繋げて、データを入れる

一旦 push する。通信ができたコードを。そして db に入る。
今
mysql 接続でエラーが起こっている。その原因は多分 root で実行しているからだと思う。
今
mysql のユーザーを(snippet)変えて、データベースも snippet_db にしたけどまだエラーが残っている。

code: 'ER_NOT_SUPPORTED_AUTH_MODE',
errno: 1251,
sqlMessage: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client',
sqlState: '08004',
fatal: true

ユーザー設定で with を追加してみる

ALTER USER 'snippet'@'localhost' IDENTIFIED WITH mysql_native_password BY 'wmkm0511';
↑
with をつけて接続する事ができた。

次のゴール
クライアントデータを db に入れて、コマンドで db 内に入っているか確認する。
db にデータ入ってた!
+------+-------------------------+
| id | content |
+------+-------------------------+
| NULL | //Hello, Monaco Editor! |
| NULL | //Hello, Monaco Editor! |
+------+-------------------------+
2 rows in set (0.00 sec)

db に入っているデータをサーバーで取得できた。
続き ↓
次はそれをクライアントに送ってブラウザに表示する(ブラウザにただ表示するのではなく、他の方法で表示すると思う。詳しくは recursion の上に書いてあるルールを見て!)
格納したデータを取ってきて、parse_url ライブラリで表示する。

client:

- "your new snippet has been posted at {url}"を表示する
- show all snippets button を実装する

今
まず show all snippets を表示したほうが簡単そう。
ルートではなく、今までの下に全部表示する
続き
contents の html 要素、ボタンを取得、関数内に append して html 要素を追加。
↓
button を押してみる。

ミドルウェア関連のエラーが出てきた。そして自分はミドルウェアに関して何も知らない。だから、まずミドルウェアについて学ぶ必要がある。そして server.js,db.js にそれぞれどんな役割をするコードを書けば良いのか定義してからコードを書き直す。今までミドルウェアの知識なしでうまく行っていたのはなぜかわからないけど、とりあえず学んでもう一度、送信ボタンをまずうまく実装できるようにする。
↓
まず前までうまく行っていたんだから、まず送信ボタンをちゃんと実装できるようにする。
↓
ちゃんと connection をエクスポートしているのに、query が使えないといエラーが起こっている。
↓
gpt に投げたから、それを読んで実行する。できたら次の show all も実装する。
↓
変数のエクスポートのエラーは解消できた。次は show all snippets をやっていく。
今
クリックされたら server が db からデータを取ってくる。それをクライアントに送信する。どのように書けば良いんだろう。という質問を gdp に投げたからそれを読んで実装する。ルートは同じでもいいと思うよ。
client: fetch してくる
server: クエリを書いて、db からデータを取ってくる。
↓
続き
クリックされたらどうやって実行されるのか、ちゃんとコードを追って調べる。
リクエストが post と get の場合でエンドポイントを分ければ、データをちゃんと取ってくる事ができる。

show all は、/all の URL に移動して表示させる。
今は、all.html に移動させたから fetch の root と違うからエラーが起きている。
続き fetch の URL を/all に変更する。

リファクタリングの時に/all とかを作る。いちいち root を変える作業をしていたら、時間がかかるだろうし。
↓
今日やること:

- send -> "your snippet is successfully saved!(link here)"
  key をつけて送信する。
  そもそもなぜ key が必要なのか自分で理解する
  うーん。自分で考えた方がもっと簡単に実装できるかも。
  parse_url というライブラリはないが、ランダムな文字列を生成してそれを localhost の root の後に追加するというやり方ならできる。
  そのランダムな文字列とデータを db で一緒に管理する必要がある。(link がシェアされた時に、その key の value を表示する事ができるから。)
  ////////////////////////////////////////////////
  //フェーズ 01//
  client: {ランダムな数字: userInput}で送信//done!
  server: {ランダムな数字: userInput}を DB に送信する
  db: テーブルに{key:値}が成立するように保存する
  //フェーズ 02//
  server: {key:値}どっちも取ってくる
  client: succeesufuly のメッセージを出して"localost"+key
  　　　　　/key には、hashmap[key]を表示する。
  ↑hashmap = [];
  db.departments.contents[0]//配列ではないから取れない。
  だから hashmap を定義して、Object.keys(result)[0]とかで取ってこれる。
  ↑ 確かどっかに書いた気がする github の CSnote を見てみる。
  ////////////////////////////////////////////////
  続き
  実際に送信してみる。
  そこからエラーが出るから、server を調節して DB も作っていく。
  {userInput:randomURL}として送信しているから、db のテーブル contents のみでいけるのではないか?取り出す時に json 形式に戻せば良いだけだから。
  ↑ もう一度全手順を追って、それで問題がないか確かめる。
  続き
  random がそうしても表示されない。なんでなのか原因を探る。

いけた!
次はとりあえず contents のみ表示できるようにする。
↓
show all button を押したらエラーが発生した。

//続き
これを見れば原因がわかると思う。

SyntaxError: Unexpected token / in JSON at position 0
データはこれ
{"content":"{\"userInput\":\"//Hello, Monaco Editor!\",\"random\":10}"}]

ChatGPT
このエラーは、JSON 形式として解析しようとしたときに予期しないトークン（Unexpected token）が見つかったことを示しています。具体的には、データが正しい JSON 形式ではない可能性があります。データの内容を見てみると、content がダブルクオートで囲まれた JSON 文字列になっているようです。正しい JSON 形式では、content の値は JSON オブジェクトである必要があります。

正しい JSON 形式にするためには、content の値を JSON オブジェクトに変更する必要があります。例えば、以下のように修正します。

json
Copy code
{"content":{"userInput":"//Hello, Monaco Editor!","random":10}}
このように修正すると、JSON として正しい形式になります。その後、このデータを解析する際には SyntaxError が発生しなくなります。

↓
多分 json 形式で db に送信しているからエラーが出るんだと思う。
だって db の content は違う型だから。
そう。
その前に json.stringfy と.parse をごっちゃにして書いてるけど違いわかってる?
↓
json.parse: 文字列->json へ
json.stringfy:json->文字列へ

goal: json,文字列系のエラーを克服できた。今度は client の show ボタンを hello~から表示できるようにしたい。done.

## 同時進行 01

一回通信するごとに、refresh する必要がある。
(random が同じ文字列になっている。show が 2 倍表示されてしまっている)

## 同時進行 02

送信できたらメッセージと共にリンクを表示する。
↓
続き
random をどうやって取ってきたらいいか。
index.js 57 line
一意なリンクを静的に表示できた。これを active にする必要がある。
↓
app.get を書いても機能していない。console が表示されていない。
続き:
何かが問題。refresh する必要があるとか??
今
app.random が実行されない原因を探っている。
app.get は client からのリクエストを req.params で取得して、それに合った route があったらその app.get 関数が実行されるようになっている。。
↓
html タグの href には全部 url を書かなくていい。/all とかから始めれば良い。
↓
今のゴール
app.get/:randomURL の url とマッチしないらしい。

app.get/:randomURL は本当に正しいのかわかってないからそこから。

- randomURL は元々備わっていて、無駄なエンドポイントを作らなくて良いし、変更が容易にできる。
  それから app.get の関数を見ていく。
  ?そもそも client 側で fetch して server で express 使うっていいの?(それが一般的じゃん。)
  ↓

  続き
  多分 server 側で randomURL を受け取ってからそれを client に送信するときに、client 側でそのデータが表示されるコードがないまま終わっているからという可能性がある。それを gpt に投げたから、コードを比較してみる。
  ↓
  一回 random の流れを全部ここに書いてみてから考えれば??
  ここが微妙ここが微妙ってやってると全体像が見えず一体何を直しているのか自分でも理解できなくなっているように思う。
  ↓
  submit ボタンを押した後の処理で client が server からの data の処理を待っていると、inserted successfully というよく分からないところから data が送られてきてしまっている。
  ↓
  構造が複雑になると、app.get,app.post のコード内のデータ通信をもっとわかりやすくする必要があると思う。

一回全部リファクタリングしてみやすくする。
そもそもリファクタリングについて学んでみる。どのリファクタリングが一番このコードに適しているのか。

## goal01 リファクタリングして一旦 push する。

#index.js#
randomFunc
require(monaco editor の)

- send button
- send する機能
- server から return された data 処理(一意のリンクを表示)
  snippet が click された際の処理
  ####################################
  ↓
  monaco editor の影響があるから userInput を取得する変数とかは require 内に書かないといけなくなっている。
  ↓
  idea01: monacoeditor の影響がある userInput はその関数内に書かなければいけないから、monacoeditor の function を親としたネストされた function を書く必要があるらしい。
  ↓
  そもそもリファクタリングする理由は、ネットワーク間通信が何回も行われていてコードを修正するときに何が何の通信かわからなくなっているから。
  ↓ #今これをやる
  これらを全部 require ネスト関数でまとめて、その上にコメントで細かく書けば良いんじゃない??
  --client
  ##client で必要な全処理
  require が影響している部分

  - send で data を server へ{sendDataToServer()}
  - server からのデータを受け取って表示&&/:random にも表示{handleResponse()}
    require が影響していない部分
  - 全データを/all に表示
    client から server へ(userInput,random 送信)sendDatatoServer
    server から DB へ(userInput,random の格納)handkeResponse
    DB から server へ(server でコードを書く)(格納したものを取ってくる)

    今
    response が定義されていないが、定義すると、読み込みでエラーになる。多分 expres の何か。以前はうまく定義されていたのに何が原因か前のコード(github から取ってくる)と今のコードをはっつけて gpt に聞いてみる。
    ↓
    handleresponse の引数は server からのデータが入る。response と data2 つあるけど(response,data)、以前のコードの response は一体何に使われていたのか調べる。
    response: server からのデータを格納する変数(http,header など含まれている)
    data: server からのデータの変数(response.json をしているから json データのみが入っている。)
    ↓
    だから response と data は同じ。

    --server
    app.get,post で、それぞれ/だけでなくしっかり他の router でそれぞれ受け取れば、リファクタリングしなくてもいいと思う。(goal02 につながる)

server からの data を random だけ送信すれば、
const randomURL = JSON.stringify(response);と簡単に書ける。
↓
app.get/:random から random だけ送信しようと思ったけど、そもそもこの関数が発火していない。
↓

1.randomURL をていいする必要がある?
const randomURL = req.params.randomURL; // ルーティングパラメータを取得する

2.db.connection.query('SELECT content FROM departments WHERE random = ?', [randomURL], (err, results) => {
で取ってきているのは random だけでなく、全体を取ってきているから results[0].random と書く必要がある??

なぜ random を取得したのに results ではなく、results[0].content とかくの??results の中は random が入ってるんじゃないの?
この質問の回答を読んで理解する。
↓

そもそも app.getrandom が発火していない。それを解決してから色々と解決する必要がる。まずは発火させるためにどうすればいいか考える。

sendDatatoserver で root に fetch しているけど、/:random に送信している場所がない。

だから、handleClient 内に書いても既にデータを取ってきているから、とかそういう問題ではないか。

fetch: この url に送信
app.get,post: その url に行ってデータを見つけてくる。
↓
randomURL の場合、
client が/:randomURL にデータを送信(その前に randomURL の変数を定義しておく必要がある。)

実現したいこと。

c: userinput,random->s:userinput,random->db:userinput,random

# 続き(snippets の link を{}から一意の値を表示できるようにする)

[重要]
多分、client がデータを送信したら、一回の通信で randomURL が一気に送信されてしまうから複雑になるんだと思う。client が最初に useriput,random を送信したら、サクセスメッセージと randomURL のボタンを表示して、次に client がそれをクリックしたら/:randomURL の挙動が発生するみたいなコードの書き方がもっと連続したコードではなく、一回ずつ区切ってコードを実行できると思うし、そっちの方が見やすいんだと思う。

handleresponse 内で response を handle する以外のことをやっているし、受け取って送信するとなると、関数内が複雑になる。

こう書いてみる。
##index.js##
send01: {userInput,random}
//.then(handleclient01)
handleclient01: random を受け取る(successfully~&&URL)
--
a タグ.click(){
random.html へ飛ばす
}
##random.html##
random = この url
object.value(random)

[currentProblems]
1.handleResponse:
関数内で randomURL が空{}の状態で取得されてしまっている。
[GOALOF4/30]
ボタンをクリックしたら、randomURL を取得して、ファイルに飛ぶようにする。そのファイルに userInput を表示させる。
index.js line85:

- handleResponse で randomURL を取得する
  server は正常に送信できているから、問題は client にある
  ↓
  random.json()と書いたら、それっぽいデータが返ってきた。
  ↓
  そもそも"fetch データの response の正しい取得方法"を知らないのが原因
  ↓
  .then()を使って data を取得することができた。
  ↓
  .then 内で関数を使って他の関数に飛ばす事はできない。
  ↓
  [今]
  .then 内で取得した変数(userInput,random)を次の.then へ渡すために、.then()内で　 return { userInput: userInput, random: random };のように書いて実装する必要がある。
- randomURL に飛ばしてブラウザを正常に表示させる。
- randomURL のブラウザの userInput をどうやって表示させるのか考える

  2.link.href.click:(解決)
  random.html に飛ばない。
  ->当たり前だけど url をクリックすると url に飛ぶから。
  ってことは、url にするか、ボタンにして random.html に飛ばすか選択する必要がある。
  ↓
  pastabin では snippet を作成したら新しいページに飛んで、ボタンで結果を見ることができる。
  ↓
  a タグではなくボタンにした。

3.

# goal02(done)

##shwoallsnippet##
client が server からのデータを待つ server が DB のデータを res.send で送る()← 多分/all という route にした方が app.get で root にしちゃうと何かとかぶるからうまくデータの通信が行われていないんだと思う。
↓
snippets と index の html ファイルをどの操作をどっちに書くのか決める。

index:何も書かない
snippets:全部書く
↑
これの方が完全に分離できていい。
[今 02]
snippets.html と snippets.js に全部書く事にした
