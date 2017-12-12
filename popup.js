// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
    
function searchPP() {
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        var activeTab = tabs[0];
        var port = chrome.tabs.connect(activeTab.id,{name:'searchPP'});
        port.postMessage({"message":"clicked_browser_action","activeTabId":activeTab.id});
        port.onMessage.addListener(function(req){
            console.log("Message received: "+req.message);
            if(req.message == "display_link"){
                var frame = document.getElementById("privacypolicy");
                frame.innerHTML = "<a href='"+req.url+"'>"+req.url+"</a>";
                console.log(frame);
                var newTabId = {"id":0};
                chrome.tabs.create({'url':req.url, 'active':false}, function(tab){
                    console.log(tab.id);
                    newTabId.id = tab.id;
                    console.log(newTabId.id);
                });
                setTimeout(function(){
                    console.log(newTabId.id);
                    port = chrome.tabs.connect(newTabId.id,{name:'searchPP'});
                    port.postMessage({'message':'grab_pp_text','url':req.url});
                    console.log("Message sent: {'message':'grab_pp_text'}");
                    port.onMessage.addListener(function(req){
                        console.log("Message received: "+req.message);
                        if(req.message == 'pp_content'){
                            console.log("returning contents: "+ req.contents);
                            frame.innerHTML = req.contents;
                        }
                    });
                    chrome.tabs.remove(newTabId.id);
                },5000);
            }
        });
    });        
}

window.onload = searchPP;
// var newTab = new Promise(
//     function(resolve, reject){
//         if(!)
//         {
//             resolve(newTabId);
//         }
//         else {
//             reject("Error");
//         }
// });
// var runNewTab = function(){
//     newTab.then(function(tab){
//         console.log("Then statement!"+tab);
//     }).catch(function(error){
//         console.log("Catch!");
//     })};
// runNewTab();
// ;
// chrome.runtime.onMessage.addListener(function(req,sender,sendResponse){
// });
// var policy = chrome.extension.getBackgroundPage();
// document.addEventListener('click', function () {
//     window.close();
// });