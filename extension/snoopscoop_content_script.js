//Connects to Pop-Up script
var port = chrome.runtime.connect({name:"searchPP"});
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == 'searchPP');
    port.onMessage.addListener(function(req){
        console.log("A message has been received! "+req.message);
        //If a clicked browser action message is received, it searches the webpage for a link containing the word Privacy and returns the link
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
                var ppurl = pplink.toString();
                var message = {"message":"display_link", "url":ppurl};
                port.postMessage(message);
                console.log('Message sent: {"message":"display_link", "url":'+ppurl+'}');
            }else{
                //If the webpage doesn't contain a link with the word privacy in it...
                alert("This webpage does not contain a direct link to the privacy policy!");
            }
        }
        //When a grab pp text message is received, if the PP link is not a PDF, it collects all the text in the page and returns it tp the pop-up script
        if(req.message == "grab_pp_text"){
            var bodyContent = '<a href="'+req.url+'">'+req.url+'</a>';
            if(!(req.url.indexOf('.pdf') != -1)){
                for(let text of document.getElementsByTagName("body")){
                    bodyContent+=text.innerText;
                }
            }
            var message = {"message":"pp_content", "contents":bodyContent};
            // port.postMessage(message);
            // console.log("Message sent: "+'{"message":"pp_content", "contents":'+bodyContent+'}');
            //Send request to app for analysis
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:5555", true);
            xhr.send(message.contents);
            console.log("Message sent: " + message.message + "contents: "+message.contents)
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4){
                    var resp = JSON.parse(xhr.responseText);
                    message.contents = resp;
                    port.postMessage(message);
                    console.log("Message sent: "+'{"message":"pp_content", "contents":'+bodyContent+'}');
                }
                else {
                    console.log("State changed but not ready yet....");
                }
            }

            // port.postMessage({
            //     "method": 'POST',
            //     "action": 'xhttp',
            //     "url": 'localhost:5555/api/analyze',
            //     "text": message.contents,
            // }, function(responseText) {
        }
    })
});