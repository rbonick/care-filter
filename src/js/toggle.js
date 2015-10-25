/**
 * Handles disabling and enabling of the filter
 */
var toggler = {
    disabled: false,

    /**
     * Initialization function
     */
    init: function () {
        chrome.browserAction.onClicked.addListener(this.toggle);
    },

    /**
     * Click listener for when the extension icon is clicked.
     */
    toggle: function () {
        if (this.disabled) {
            chrome.browserAction.setIcon({path: "../images/icon-32.png"});
            localStorage.setItem("care-filter-disabled", false);
            this.disabled = false;
        } else {
            chrome.browserAction.setIcon({path: "../images/icon-32-disabled.png"});
            localStorage.setItem("care-filter-disabled", true);
            this.disabled = true;
        }

        toggler.sendMessageToAllTabs({disabled: this.disabled});
    },

    /**
     * Sends a message to all the current tabs
     * @param message The message to send
     */
    sendMessageToAllTabs: function (message) {
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.sendMessage(tab.id, message, function (response) {
                });
            });
        });
    }
};

toggler.init();