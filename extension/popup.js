// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
    
function searchPP() {
    //Queries and sets active tab
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        var activeTab = tabs[0];
        //Create connection with content script to request a PP search
        var port = chrome.tabs.connect(activeTab.id,{name:'searchPP'});
        port.postMessage({"message":"clicked_browser_action","activeTabId":activeTab.id});
        port.onMessage.addListener(function(req){
            console.log("Message received: "+req.message);
            //If a display link message is returned, pop-up shows the PP link, opens the PP link in a new tab
            if(req.message == "display_link"){
                var frame = document.getElementById("policylink");
                frame.innerHTML = "<a href='"+req.url+"'>"+req.url+"</a>";
                console.log(frame);
                var newTabId = {"id":0};
                chrome.tabs.create({'url':req.url, 'active':false}, function(tab){
                    console.log(tab.id);
                    newTabId.id = tab.id;
                    console.log(newTabId.id);
                });
                //When the new tab is open, requests a parsing of the PP link and displays text in pop-up
                setTimeout(function(){
                    console.log(newTabId.id);
                    port = chrome.tabs.connect(newTabId.id,{name:'searchPP'});
                    port.postMessage({'message':'grab_pp_text','url':req.url});
                    console.log("Message sent: {'message':'grab_pp_text'}");
                    port.onMessage.addListener(function(req){
                        console.log("Message received: "+req.message);
                        if(req.message == 'pp_content'){
                            //Send request to app for analysis
                            var xhr = new XMLHttpRequest();
                            xhr.open("POST", "http://localhost:5555/api/analyze", true);
                            xhr.send(req.contents);
                            console.log("Message sent to server at 5555; contents: "+req.contents)
                            xhr.onreadystatechange = function() {
                                if (xhr.readyState == 4){
                                    var resp = JSON.parse(xhr.responseText);
                                    var prediction = resp.prediction[0];
                                    console.log(prediction);
                                    if(prediction == 1){
                                        prediction = "YES! :D";
                                    } else {
                                        prediction = "NO :(";
                                    }
                                    frame = document.getElementById("privacypolicy");
                                    frame.innerHTML = '<p>This website will notify you of changes to the Privacy Policy: '+prediction+'</p>';
                                    console.log("returning contents: "+ resp);
                                }
                                else {
                                    console.log("State changed but not ready yet....");
                                }
                            }
                        }
                    });
                    //After grabbing + redisplaying text, the PP link tab is closed
                    chrome.tabs.remove(newTabId.id);
                },5000);
            }
        });
    });        
}
window.onload = searchPP;