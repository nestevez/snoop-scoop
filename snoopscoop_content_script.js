// The background page is asking us to find the privacy policy on the page.
if (window == top) {
    chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
      sendResponse(findPrivacy());
    });
  }
  

// Search the webpage for a link with the word "privacy" or "Privacy" and clicks on it
var findPrivacy = function() {
    var found;
    var re = /([Pp]rivacy)/g;
    var node = document.body;
    for( let link of node.getElementsByTagName('a')){
        if(link.innerHTML.textContent.match(re)){
            link.click();
        }     
    }
    return true;
}