// var policy;
// chrome.browserAction.onClicked.addListener(function(tab){
//     chrome.tabs.onUpdated.addListener(function(tab){
//         chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
//             var activeTab = tabs[0];
//             chrome.tabs.sendMessage(activeTab.id, {"message":"clicked_browser_action"}
//             // , function(link) {
//                 // if(link){
//                 //     policy = link.link;
//                 //     return policy;
//                 // }
//             // }
//             );
//         });
//     });
// });