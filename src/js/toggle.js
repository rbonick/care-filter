var disabled = false;

chrome.browserAction.onClicked.addListener(toggle);

function toggle() {
    debugger;
    if (disabled) {
        chrome.browserAction.setIcon({path: "../images/icon.png"});
        localStorage.setItem("care-filter-disabled", false);
        disabled = false;
    } else {
        chrome.browserAction.setIcon({path: "../images/icon-disabled.png"});
        localStorage.setItem("care-filter-disabled", true);
        disabled = true;
    }

    sendMessageToAllTabs({disabled: disabled});
}

function sendMessageToAllTabs(obj) {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, obj, function (response) {
            });
        });
    });
}