document.addEventListener('DOMContentLoaded', function () {
  init();
});

function init() {
  chrome.storage.sync.get('apiKey', function (data) {
    getTabUrl().then(url => {
      let parsedUrl = new URL(url);
      let queryParams = new URLSearchParams(parsedUrl.search);
      let pipelineId = queryParams.get('pipeline_id');
      $("#msg").text(pipelineId);
    })
  });
}

async function getTabUrl() {
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);
  if(tabs && tabs[0]) {
    return tabs[0].url;
  } else {
    return null;
  }
}
