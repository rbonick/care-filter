/**
 * The replacer object handles all replacement of text on the current page.
 */
var replacer = {

    filters: {},
    regexes: [],

    /**
     * Initialization function
     */
    init: function () {
        /* Handles disabling of the script */
        var disabled = (localStorage.getItem("care-filter-disabled") === null ? false : this.parseBoolean(localStorage.getItem("care-filter-disabled")));

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                localStorage.setItem("care-filter-disabled", request.disabled);
            }
        );

        if (!disabled) {
            this.loadFilters();
            this.buildRegexes();
            this.walk(document.body);
        }
    },

    /**
     *  Walks through all the DOM nodes
     */
    walk: function (node) {
        var child, next;

        switch (node.nodeType) {
            case 1:  // Element
            case 9:  // Document
            case 11: // Document fragment
                child = node.firstChild;
                while (child) {
                    next = child.nextSibling;
                    this.walk(child);
                    child = next;
                }
                break;
            case 3: // Text node
                this.filterText(node);
                break;
        }
    },

    /**
     * Replaces text in the node with the replacer's regex replacements
     * @param textNode the node to replace
     */
    filterText: function (textNode) {
        this.regexes.forEach(function (regex) {
            textNode.nodeValue = textNode.nodeValue.replace(regex.regex, regex.replacement);
        });
    },

    /**
     * Loads the filter from its JSON file
     */
    loadFilters: function () {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                replacer.setFilters(JSON.parse(xhr.responseText));
            }
        };
        xhr.open("GET", chrome.extension.getURL('../data/filters.json'), false);
        xhr.send();
    },

    /**
     * Sets the replacer's filters
     * @param filters The filters to use for this replacer
     */
    setFilters: function (filters) {
        this.filters = filters;
    },

    /**
     * Builds a regex array of regexes and their replacement
     */
    buildRegexes: function () {
        for (var filter in this.filters) {
            if (this.filters.hasOwnProperty(filter)) {
                var replacement = this.filters[filter];
                var regex = new RegExp("\\b" + this.escapeRegExp(filter) + "\\b", "gi");
                this.regexes.push({regex: regex, replacement: replacement});
            }
        }
    },

    /**
     * Escapes any special regex characters in the string
     * @param str The string to escape regex characters for
     * @returns {string} The string with regex characters escaped
     */
    escapeRegExp: function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },

    /*
     * Parses a string equivalent of a boolean into a boolean object.
     */
    parseBoolean: function (type) {
        return typeof type == 'string' ? JSON.parse(type) : type;
    }
};

replacer.init();