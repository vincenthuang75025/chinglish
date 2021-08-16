$(function(){
  $('#paste').on("click", function(){pasteSelection();});
});
function pasteSelection() {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {method: "getSelection"}, function(response) {
      console.log(response);
      var text = document.getElementById('text'); 
      text.innerHTML = response.data;
    });
  });
}