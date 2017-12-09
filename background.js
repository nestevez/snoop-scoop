chrome.tabs.onDOMContentLoading.addListener(function(tab){
    chrome.tabs.sendRequest(tabs[0].id, {}, function(clicked){
        if(clicked) {
            chrome.tabs.update(window.tabs.openerTabId, {active: true});
        }
    });
})