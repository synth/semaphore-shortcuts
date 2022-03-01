// Toaster: https://github.com/kvinbabbar/Pure-Javascript-Toaster-Plugin
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: contentScriptFunc,
      args: ['rebuild_pipeline'],
    });
  });
  
  function contentScriptFunc(name) {
    let ToasterBox;
    let queryParams = new URLSearchParams(window.location.search);
    let pipelineId = queryParams.get('pipeline_id');
    let commandStr = `sem rebuild pipeline ${pipelineId}`;

    function loadNotificationLibraryStyles() {
      var sheet = document.createElement('style');
      sheet.innerHTML = `/* The toaster - position it at the bottom and in the middle of the screen */
      .inverted {
          -webkit-filter: invert(1);
          filter: invert(1);
      }
      .toaster-container {
          max-width: 450px;
          min-width: 250px;
          /* Set a default minimum width */
          background-color: #000033;
          /* Black background color */
          color: #fff;
          /* White text color */
          border-radius: 2px;
          /* Rounded borders */
          padding: 16px;
          /* Padding */
          position: absolute;
          /* Sit on top of the screen */
          z-index: 1;
          /* Add a z-index if needed */
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0px 13px 10px -7px rgba(0, 0, 0, 0.1);
          width: 100%;
          font-family: inherit;
      }
      .toaster-container.top-right {
          right: 1%;
          top: 30px;
      }
      .toaster-container.top-left {
          left: 1%;
          top: 30px;
      }
      .toaster-container.top-center {
          left: 50%;
          transform: translateX(-50%);
          top: 30px;
      }
      .toaster-container.bottom-center {
          left: 50%;
          transform: translateX(-50%);
          bottom: 30px;
      }
      .toaster-container.bottom-left {
          left: 1%;
          bottom: 30px;
      }
      .toaster-container.bottom-right {
          right: 1%;
          bottom: 30px;
      }
      .toaster-container.top-right,
      .toaster-container.top-left,
      .toaster-container.top-center {
          -webkit-animation: fadeinTop 0.5s;
          animation: fadeinTop 0.5s;
      }
      .toaster-container.bottom-right,
      .toaster-container.bottom-left,
      .toaster-container.bottom-center {
          -webkit-animation: fadeinBottom 0.5s;
          animation: fadeinBottom 0.5s;
      }
      .toaster-close {
          font-size: 20px;
          background-color: transparent;
          border: none;
          color: #fff;
          outline: none;
      }
      /* Animations to fade the snackbar in and out from top */
      @-webkit-keyframes fadeinTop {
          from {
              top: 0;
              opacity: 0;
          }
          to {
              top: 30px;
              opacity: 1;
          }
      }
      @keyframes fadeinTop {
          from {
              top: 0;
              opacity: 0;
          }
          to {
              top: 30px;
              opacity: 1;
          }
      }
      
      @-webkit-keyframes fadeoutTop {
          from {
              top: 30px;
              opacity: 1;
          }
          to {
              top: 0;
              opacity: 0;
          }
      }
      @keyframes fadeoutTop {
          from {
              top: 30px;
              opacity: 1;
          }
          to {
              top: 0;
              opacity: 0;
          }
      }
      /* Animations to fade the snackbar in and out from bottom */
      @-webkit-keyframes fadeinBottom {
          from {
              bottom: 0;
              opacity: 0;
          }
          to {
              bottom: 30px;
              opacity: 1;
          }
      }
      @keyframes fadeinBottom {
          from {
              bottom: 0;
              opacity: 0;
          }
          to {
              bottom: 30px;
              opacity: 1;
          }
      }
      
      @-webkit-keyframes fadeoutBottom {
          from {
              bottom: 30px;
              opacity: 1;
          }
          to {
              bottom: 0;
              opacity: 0;
          }
      }
      @keyframes fadeoutBottom {
          from {
              bottom: 30px;
              opacity: 1;
          }
          to {
              bottom: 0;
              opacity: 0;
          }
      }`;
      document.body.appendChild(sheet);
    }
    function loadNotificationLibrary() {
        var ToasterBox = function() {
            
            // globel variable
            this.toasterContainer = null;
            this.toasterCloseBtn = null;
            const _ = this;
    
            let defaults = {
                msg: '',
                duration: 3000,
                html: false,
                className: null,
                closeButton: true,
                maxWidth: 450,
                autoOpen: true,
                position: 'bottom-center', //'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right', 
                backgroundColor: null,
                closeIcon: null
            }
    
            if(arguments[0] && typeof arguments[0] === "object") {
                this.options = extendDefaults(defaults, arguments[0]);
            }
            if(this.options.autoOpen) {
                _.openToaster();
            }
            setTimeout(function () { _.closeToaster() }, Number(this.options.duration));
        }
    
        ToasterBox.prototype.openToaster = function() {
            // build out toaster
            buildToaster.call(this)
            // Initialize Event Listeners
            initializeEvents.call(this);
            /*
            * After adding elements to the DOM, use getComputedStyle
            * to force the browser to recalc and recognize the elements
            * that we just added. This is so that CSS animation has a start point
            */
            window.getComputedStyle(this.toasterContainer).height;
        }
    
        ToasterBox.prototype.closeToaster = function() {
            const _ = this;
            if(_.toasterContainer.classList.contains('top-left') || 
            _.toasterContainer.classList.contains('top-center') || 
            _.toasterContainer.classList.contains('top-right')) {
                _.toasterContainer.style.webkitAnimation = "fadeoutTop .5s";
                _.toasterContainer.style.animation = "fadeoutTop .5s";
            }
            if(_.toasterContainer.classList.contains('bottom-left') || 
            _.toasterContainer.classList.contains('bottom-center') || 
            _.toasterContainer.classList.contains('bottom-right')) {
                _.toasterContainer.style.webkitAnimation = "fadeoutBottom .5s";
                _.toasterContainer.style.animation = "fadeoutBottom .5s";
            }
            // Code for Safari 3.1 to 6.0
            _.toasterContainer.addEventListener("webkitAnimationend", function() {
                _.toasterContainer.remove();
            });
    
            // Standard syntax
            _.toasterContainer.addEventListener("animationend", function() {
                _.toasterContainer.remove();
            });
        }
        
        // build toaster
        function buildToaster() {
            var docFrag, toasterMsg;
            
            this.toasterContainer = document.createElement('div');
            this.toasterContainer.classList.add('toaster-container');
            this.toasterContainer.classList.add(this.options.position);
            this.toasterContainer.style.maxWidth = this.options.maxWidth + 'px';
            if(this.options.backgroundColor !== null) {
                this.toasterContainer.style.backgroundColor = this.options.backgroundColor;
            }
            if(this.options.className !== null) {
                this.toasterContainer.classList.add(this.options.className);
            }
            // toaster message
            toasterMsg = document.createElement('span');
            toasterMsg.classList.add(`toaster-msg`);
            if(!this.options.html) {
                toasterMsg.innerText = this.options.msg;
            } else {
                toasterMsg.innerHTML = this.options.msg;
            }
            // append toaster message to container
            this.toasterContainer.append(toasterMsg);
            // close button
            if(this.options.closeButton) {
                this.toasterCloseBtn = document.createElement('button');
                this.toasterCloseBtn.setAttribute('type','button');
                this.toasterCloseBtn.classList.add(`toaster-close`);
                if(this.options.closeIcon) {
                    this.toasterCloseBtn.innerHTML = this.options.closeIcon;
                } else {
                    this.toasterCloseBtn.innerHTML = "<img src='./close.svg' alt='close icon' width='20' class='inverted'/>";
                }
                this.toasterContainer.append(this.toasterCloseBtn);
            }
            // create document fragment and append toaster to it
            docFrag = document.createDocumentFragment();
            docFrag.append(this.toasterContainer)
            // append Doc Fragment to body
            document.body.append(docFrag);
        }
    
        function initializeEvents() {
            if(this.toasterCloseBtn) {
                this.toasterCloseBtn.addEventListener('click', this.closeToaster.bind(this));
            }
        }
        // overwrite default property
        function extendDefaults(source, properties) {
            let property;
            for(property in properties) {
                if(properties.hasOwnProperty(property)) {
                    source[property] = properties[property];
                }
            }
            return source;
        }
      return ToasterBox;
    }

    function notify(title, msg, duration = 3000) {
      new ToasterBox({ msg : msg, closeButton : false, duration: duration });
    }

    loadNotificationLibraryStyles();
    ToasterBox = loadNotificationLibrary();
    if(pipelineId) {
        navigator.clipboard.writeText(commandStr).then(() => {
            console.log('clipboard set')
            notify("Semaphore Rebuild", `Command has been copied to clipboard: "${commandStr}"`);
        }, (error) => {
            notify("Semaphore Rebuild", 'Failed setting clipboard: '+error+'\nCommand: '+commandStr, 10000)
            console.log('Failed setting clipboard: '+error);
            console.log('Here\'s the command: '+commandStr);
        })
    } else {
        console.log("No pipeline id in query parameters, so nothing to do...")
    }
  }


  // This callback WILL NOT be called for "_execute_action"
  chrome.commands.onCommand.addListener((command) => {
    console.log(`Command: sem rebuild pipeline "${command}"`);
  });

