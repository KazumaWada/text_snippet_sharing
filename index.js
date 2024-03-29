// Monaco EditorのCDNから読み込む
require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } });
//monaco editorを初期化している
require(['vs/editor/editor.main'], function () {
  let editor = monaco.editor.create(document.getElementById('editor'), {
    value: 'console.log("Hello, Monaco Editor!");',
    language: 'javascript',
    theme: 'vs-dark'
  });

  // エディターのフォントサイズを変更する例
  editor.updateOptions({ fontSize: 18 });

  //if sendButton clicked
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
		//ここが出力されている。サーバー側で何か問題がありそう。
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

});
