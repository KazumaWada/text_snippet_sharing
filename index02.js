//ランダムなurlを生成する用の関数
function generateRandomURL(length){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for(let i=0; i<length; i++){
      randomString += characters.charAt(Math.floor(Math.random()*characters.length));
    }
    return randomString;
  }
  
  //ランダムなurlを生成する変数
  const randomURL = generateRandomURL(10);
  
  // Monaco EditorのCDNから読み込む
  require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } }); 
  
  //monaco editorの効果が聞いているfunctionという意味
  require(['vs/editor/editor.main'], function () {
    let editor = monaco.editor.create(document.getElementById('editor'), {
      value: '//Hello, Monaco Editor!',
      language: 'javascript',
      theme: 'vs-dark'
    });
  
    // エディターのフォントサイズを変更
    editor.updateOptions({ fontSize: 18 });
  
    //if sendButton clicked, store data to DB//
    let sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', function () {
      //userInputの取得
      let userInput = editor.getModel().getValue();
      let random = randomURL;
      console.log("user input: ", userInput + "random",random);
      
      fetch('http://localhost:5501', { 
        method: 'POST',//postメソッドでデータを送信している
        headers: {
          'Content-Type': 'application/json'
        },
        //jsonで送信しているから、こうやって書く
        //{key:変数}
        //文字列にすることでそのままserver側で何もせずにDBに格納できる。
        body: JSON.stringify({ userInput: userInput, random: random })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        //return response.text();
        return response.json();
      })
      //after posted, received ${data} from server
      //json(db.connection.query('SELECT content FROM departments')
      .then(data => {
        console.log("data" + JSON.stringify(data));//dataはinserted succeessfullyと出ている。wow..
        //??
        const randomURL = JSON.stringify(data);
        //suceess message
         // 成功メッセージの表示
        let messageEle = document.getElementById('snippetStoredMessage')
        messageEle.style.display = 'block';
  
       // リンクの設定
        let linkEle = document.getElementById('linkForSnippet')
        linkEle.textContent = "http://127.0.0.1:5500/index.html/" + randomURL;
        linkEle.href = "./" + randomURL;
        linkEle.style.display = 'block';
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  });//monaco editor module
  ///////////////////////////////////////////////
  
  
  
  
  ///////////////////////////////////////////////
  //////serverからfetchしてsnippetを表示する
  //buttonIdの取得
  let snippetsButton = document.getElementById('snippetsButton');
  //追加するhtml要素の取得
  let snippetsElement = document.getElementById('snippets');
  snippetsButton.addEventListener('click', async()=>{
    try{
      //5501にリクエストを送信して結果を待つ
      const response = await fetch('http://localhost:5501/')
      const dataArr = await response.json();
      // snippetsElement.textContent = JSON.stringify(data);
      //snippetsElement.textContent = data;
      //objはjson.
    
      dataArr.forEach(obj => {
        const contentObj = JSON.parse(obj.content);
        const userInput = contentObj.userInput;
        snippetsElement.textContent += userInput + '\n';
      });
      
      //↑1ここのdataの所でまずcontentsの中身だけを表示する必要がある
      //2表示できたらdataをobject.keyとかで表示する。
      //3新しいdirを作ってそこにdataをインポートしてobject.valueを表示する
      //4ややこしいdirで変えたことで起こったエラーを対処する
    }catch(error){
      console.error('error fetching data:', error);
    }
  });