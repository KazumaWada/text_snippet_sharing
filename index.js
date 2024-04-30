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

//global
const randomURL = generateRandomURL(10);
const linkEle = document.getElementById('linkForSnippet')//button

//monaco editorの効果が聞いているfunction
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
    //convert to json for userInput,random
    .then(response =>{
      if(!response.ok){
        throw new Error("Network response was not ok");
      }
      suceessMessage();
      return response.json();
    })
    //return neet userInput,random data
    .then(data =>{
      let userInput = data.userInput;
      let random = data.random;
      console.log("userInput:", userInput);
      console.log("random:", random);
      return {userInput: userInput, random: random};
    })
    //use userInput,random
    .then(handleClick)
    .catch(handleError);
  }
  
  let sendButton = document.getElementById("sendButton");
  sendButton.addEventListener('click',sendDataToServer);
});//monaco editor module

  function suceessMessage(){
    let messageEle = document.getElementById('snippetStoredMessage')
    messageEle.style.display = 'block';
  }

  function handleClick(data){
    //window.location.href = 'random.html';
    console.log("userInput from handleClick: " + data.userInput )
    console.log("random from handleClick: " + data.random )
    //button display userInput,random
    linkEle.style.display = 'block';
    linkEle.textContent = "show/share snippet";
  }

  function handleError(error){
    console.error('Error',error);
   }

  //if "show/share snipprt" button clicked
  linkEle.addEventListener('click', async()=>{
    try{
      window.location.href = "random.html";
    }
    catch(error){
      console.error('Error: ',error);
    }
  })
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




