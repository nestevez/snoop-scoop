
// console.log(document.getElementsByTagName('a')[0]);
// // The background page is asking us to find the privacy policy on the page.

var port = chrome.runtime.connect({name:"searchPP"});
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == 'searchPP');
    port.onMessage.addListener(function(req){
        console.log("A message has been received! "+req.message);
        if(req.message == "clicked_browser_action"){
            var pplink = null;
            var pp;
            for( let link of document.getElementsByTagName('a')){
                if(link.innerHTML.indexOf('rivacy')!=-1){
                    pp = link;
                    pplink = link.href;
                    console.log(pplink);
                }     
            }
            if(pp){
                // pp.dispatchEvent(new MouseEvent("click"));
                var ppurl = pplink.toString();
                var message = {"message":"display_link", "url":ppurl};
                port.postMessage(message);
                console.log('Message sent: {"message":"display_link", "url":'+ppurl+'}');
            }else{
                alert("This webpage does not contain a direct link to the privacy policy!");
            }
        }
        if(req.message == "grab_pp_text"){
            var bodyContent = '<a href="'+req.url+'">'+req.url+'</a>';
            if(!(req.url.indexOf('.pdf') != -1)){
                for(let text of document.getElementsByTagName("body")){
                    bodyContent+=text.innerHTML;
                }
            }
            var message = {"message":"pp_content", "contents":bodyContent};
            port.postMessage(message);
            console.log("Message sent: "+'{"message":"pp_content", "contents":'+bodyContent+'}');
        }
    })
});
// chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
// });    

// // sendResponse(findPrivacy());

// // Search the webpage for a link with the word "privacy" or "Privacy" and clicks on it
// var findPrivacy = function() {
//     return pplink;
// }