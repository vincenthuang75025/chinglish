let difficulty = 5;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ difficulty });
  console.log('Default difficulty set to 5');
});
