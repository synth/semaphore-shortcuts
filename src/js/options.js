document.addEventListener('DOMContentLoaded', function () {
  init();
});

function init() {
  chrome.storage.sync.get('apiKey', function (data) {
    $("#apiKey").val(data.apiKey);
  });

  $("#apiKey").on('input', function(){
    chrome.storage.sync.set({apiKey: $("#apiKey").val()});
  })
}
