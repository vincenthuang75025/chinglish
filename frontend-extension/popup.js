$(function(){
  $('#translate').on("click", function(){pasteSelection();});
});

$(function(){
  $('#difficulty').on("change", function(){updateDifficulty();});
})

chrome.storage.sync.get("difficulty", ({difficulty}) => {
  document.getElementById('difficulty').value = difficulty;
});

function pasteSelection() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {method: "getSelection", difficulty: document.getElementById('difficulty').value}, function(response) {
      var text = document.getElementById('text'); 
      text.innerHTML = response.data;
    });
  });
}

function updateDifficulty() {
  chrome.storage.sync.set({ difficulty: document.getElementById('difficulty').value});
}