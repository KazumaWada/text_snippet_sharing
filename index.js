// Monaco EditorのCDNから読み込む
require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } });
//monaco editorの初期化
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
    console.log("user input: ", userInput);

    //fetchを使用してPOSTリクエストを送信
	  //送信する先のurlを示している。つまりサーバーのurl
    fetch('http://localhost:5501', { 
      method: 'POST',//postメソッドでデータを送信している
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userInput })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  })
});//monaco editor module

//////serverからfetchしてsnippetを表示する
//buttonIdの取得
let snippetsButton = document.getElementById('snippetsButton');
//追加するhtml要素の取得
let snippetsElement = document.getElementById('snippets');
snippetsButton.addEventListener('click', async()=>{
  try{
    //5501にリクエストを送信して結果を待つ
    const response = await fetch('http://localhost:5501/')
    const data = await response.json();
    snippetsElement.textContent = JSON.stringify(data);
  }catch(error){
    console.error('error fetching data:', error);
  }
})

