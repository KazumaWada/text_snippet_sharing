//const { response } = require("express");

console.log("scaned snippets.js!")
// "/snippets"
// fetchしてresponseをjson
  async function fetchData() {
    try {
        const response = await fetch('http://localhost:5501/all');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

  // データjson(res)を表示する関数
  function displayData(dataArr, snippetsElement) {
    if (!dataArr || dataArr.length === 0) {
      console.error('No data to display');
      return;
    }
    //fetchしてjson(response)したデータをloopして表示
    dataArr.forEach(obj => {
      const contentObj = JSON.parse(obj.content);
      const userInput = contentObj.userInput;
      //snippets.htmlに行った後もそこでindex.jsを読み込んでいるからok
      snippetsElement.textContent += userInput + '\n';
    });
  }
  

//window.location.href = 'snippets.html'を感知したら実行する関数
window.addEventListener('DOMContentLoaded', async () => {
  try {
    if(window.location.pathname === '/snippets.html'){
      // get all snippets data
      const dataArr = await fetchData(); 
      //<p id="snippets"></p>
      const snippetsElement = document.getElementById('snippets');
      //display data
      displayData(dataArr, snippetsElement); 
      snippetsElement.style.display = 'block';
    }
  } catch (error) {
      console.error('Error:', error);
  }
});

  
//problems//
//snippets.htmlのブラウザ内にボタンは必要ない
//ボタンをクリックする前に表示されてしまっている
