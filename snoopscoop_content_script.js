
// console.log(document.getElementsByTagName('a')[0]);
// // The background page is asking us to find the privacy policy on the page.
chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    var pplink = null;
    var pp;
    for( let link of document.getElementsByTagName('a')){
        if(link.innerHTML.indexOf('rivacy')!=-1){
            pp = link;
            pplink = link.href;
            console.log(pplink);
        }     
    }
    pp.dispatchEvent(new MouseEvent("click"));
});

// // sendResponse(findPrivacy());

// // Search the webpage for a link with the word "privacy" or "Privacy" and clicks on it
// var findPrivacy = function() {
//     return pplink;
// }