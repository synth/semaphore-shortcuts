# Semaphore Shortcuts
This chrome extension primarily is used for re-running partial builds in SemaphoreCI. This will make your life easier if you have a test suite that has frequent flaky failures that are unavoidable or not worth trying to fix. 

SemaphoreCI has an api to re-run just the test blocks that have failed. Why they don't make this ability available in their website, I don't know. So, to workaround this annoying limitation, I built this chrome extension that, once loaded with a Semaphore API key, will pull the pipeline id from the url of that pipeline you are on, and will issue the api request for you. Essentially this makes it take a "single click" to re-run a partial build. I do this frequently, so this saves me a lot of frequent key stokes and time. 

## Installation
1. Clone this repo.
2. Head over to Chrome Extensions (usually `chrome://extensions` in the address bar) and turn "Developer Mode" on the top left.
3. Click "Load unpack" and select the destination as the "src" folder of this cloned repository.
4. Go to the extension options page. This is accessible by clicking on the extension icon and going to Options. 
5. On this page, there will be a button to navigate you to the Semaphore page where you can get your API key. 
6. Copy and paste the Semaphore API key into the extension options. 
7. Navigate to a workflow that has a failure (ie a url that has a pipeline_id). 
8. Click the extension icon and if the API key is valid, it will re-run the pipeline for you within seconds
