// Monaco EditorのCDNから読み込む
require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } }); 

function generateRandomURL(length){
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for(let i=0; i<length; i++){
    randomString += characters.charAt(Math.floor(Math.random()*characters.length));
  }
  return randomString;
}
const randomURL = generateRandomURL(10);

//monaco editorの効果が聞いているfunctionという意味
require(['vs/editor/editor.main'], function () {
  let editor = monaco.editor.create(document.getElementById('editor'), {
    value: '//Hello, Monaco Editor!',
    language: 'javascript',
    theme: 'vs-dark'
  });

  // エディターのフォントサイズを変更
  editor.updateOptions({ fontSize: 18 });

  // "/"
  function sendDataToServer() {
    let userInput = editor.getModel().getValue();
    let random = randomURL;
    console.log("user input: ", userInput + "random: ",random);
    
    fetch('http://localhost:5501', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userInput: userInput, random: random })
    })
    .then(handleResponse)
    .catch(handleError);
  }

  // "/", {userInput,randomURL}
  //[重要！]randomURLだけ必要なんだから、serverはrandomだけ送信すれば良くない??
  function handleResponse(response){
    //definedされていない。
    if(!response.ok){
      throw new Error("network response was not ok");
    }
    console.log("data" + JSON.stringify(response));//dataはinserted succeessfullyと出ている。wow..
    
    const randomURL = JSON.stringify(response);
    //suceess message
     // 成功メッセージの表示
    let messageEle = document.getElementById('snippetStoredMessage')
    messageEle.style.display = 'block';

   // リンクの設定
    let linkEle = document.getElementById('linkForSnippet')
    linkEle.textContent = "http://127.0.0.1:5500/index.html/" + randomURL;
    linkEle.href = "./" + randomURL;
    linkEle.style.display = 'block';
    return response.json();
  }

  function handleError(error){
    console.error('Error',error);
  }

  let sendButton = document.getElementById("sendButton");
  sendButton.addEventListener('click',sendDataToServer);
});//monaco editor module

//moved to snippets.js//
// <button id="moveToAll">all snippets</button>
let moveToAllButton = document.getElementById('moveToAll');
moveToAllButton.addEventListener('click', async () => {
    try {
        // ボタンクリック時にsnippets.htmlに遷移
        window.location.href = 'snippets.html';

        // ここではデータの取得は行わない
    } catch (error) {
        console.error('Error:', error);
    }
});




