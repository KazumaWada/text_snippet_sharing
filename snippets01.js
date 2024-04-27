//修正前
console.log("scaned snippets.js!")
// "/snippets"
// fetchしてresponseをjson
async function fetchData(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('error fetching data:', error);
      return null;
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
  
  // /allへ移動するボタン
  let moveToAllButton = document.getElementById('moveToAll');
  //snippetsを表示する要素
  let snippetsElement = document.getElementById('snippets');
  moveToAllButton.addEventListener('click', async () => {
    //ブラウザを移動
    window.location.href = 'snippets.html';
    const url = 'http://localhost:5501/all';
    //fetchしてresponseをjsonする関数
    const dataArr = await fetchData(url);
    //(json(res),それを表示する要素)
    //{userInput,random}両方取ってきている事を前提として書かれている
    displayData(dataArr, snippetsElement);
  });
  
  
  