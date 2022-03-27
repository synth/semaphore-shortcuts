// https://github.com/apvarun/toastify-js/blob/master/README.md
if(typeof currentToast === 'undefined') {
  let currentToast = null;
}

function init() {
  setup();
  chrome.storage.sync.get('apiKey', function (data) {
    if(data && data.apiKey) {
      runPipelineRebuild(data.apiKey)
    } else {
      // $("#msg").html("<div>No Api key defined. Get your api token from <a href='https://me.semaphoreci.com/account' target='_blank'>your Semaphore account</a>. Then right click on the extension icon and go to options and enter your key.</div>");
      clearNotifications();
      notify({
        text: "No Api key defined. Click this notification to go to your Semaphore account and get your API token. Then right click on the extension icon and go to options and enter your key.",
        destination: 'https://me.semaphoreci.com/account',
        newWindow: true
      })
    }
  });
}

function notify(options) {
  let defaults = {
    duration: 3000, 
    close: true,
    stopOnFocus: true
  }
  let actual = Object.assign({}, defaults, options);
  currentToast = Toastify(actual).showToast(); 
}

function clearNotifications() {
  currentToast.hideToast();
}

function setup() {
//   $("#msg").remove();
//   var div = $("<div></div>", {id: 'msg'});
//   div.text('Calling Semaphore API to rebuild pipeline...');
//  $("body").prepend(div);
//  div.css({position: 'absolute', 'z-index': 10000, right: 0, "background-color": '#ccc'});
  notify({text: 'Calling Semaphore API to rebuild pipeline. Please wait...'})
}

async function runPipelineRebuild(apiToken) {
  getTabUrl().then(url => {
    let parsedUrl = new URL(url);
    let host = parsedUrl.host;
    let queryParams = new URLSearchParams(parsedUrl.search);
    let pipelineId = queryParams.get('pipeline_id');
    let apiBaseUrl = `https://${host}/api/v1alpha`;
    let requestToken = createUUID();
    let apiUrl = `${apiBaseUrl}/pipelines/${pipelineId}/partial_rebuild?request_token=${requestToken}`;
    // let apiUrl = `${apiBaseUrl}/pipelines/${pipelineId}/partial_rebuild`;
    makePipelineRebuildRequest(apiUrl, apiToken);
    // $("#msg").text(apiUrl);
  })
}

async function makePipelineRebuildRequest(url, token) {
  console.log("Making pipeline rebuild request");
  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`
    }
  }).then(response => {
    // $("#msg").text("Successfully sent rebuild request");
    if (response.status >= 200 && response.status <= 299) {
      console.log(response);
      $("#msg").text("Request sent successfully");
    } else {
      console.log(response);
      response.text().then(body => {
        $("#msg").text(`Request failed with status ${response.status} ${response.statusText} ${body}`);
      });
    }    
  }).catch(error => {
    console.log(error);
    $("#msg").text(error);
  });
}

async function getTabUrl() {
  return window.location.href;
}

function createUUID() {
  console.log("Creating UUID")
  //  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //     return v.toString(16);
  //  });
  return new Date().getTime();
}

function waitForJquery(method) {
    if (window.jQuery) {
        method();
    } else {
        setTimeout(function() { waitForJquery(method) }, 50);
    }
}

waitForJquery(init);
