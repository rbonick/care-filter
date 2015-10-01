function handleText(textNode, regexes) {
    regexes.forEach(function (regex) {
        textNode.nodeValue = textNode.nodeValue.replace(regex.regex, regex.replacement);
    });
}

function walk(node, regexes) {
    var child, next;

    switch (node.nodeType) {
        case 1:  // Element
        case 9:  // Document
        case 11: // Document fragment
            child = node.firstChild;
            while (child) {
                next = child.nextSibling;
                walk(child, regexes);
                child = next;
            }
            break;
        case 3: // Text node
            handleText(node, regexes);
            break;
    }
}

function buildRegexes() {
    var filters = {
        "regex": "poodles",
        "chrome": "firetrucks"
    };

    var regexes = [];

    for (var filter in filters) {
        if (filters.hasOwnProperty(filter)) {
            var replacement = filters[filter];
            var regex = new RegExp("\\b" + filter + "\\b", "gi");
            regexes.push({regex: regex, replacement: replacement});
        }
    }

    return regexes;
}

// Handles disabling of the script
var disabled = (localStorage.getItem("care-filter-disabled") === null ? false : parse(localStorage.getItem("care-filter-disabled")));

// LocalStorage stores as strings, so need to convert to boolean
function parse(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        localStorage.setItem("care-filter-disabled", request.disabled);
    }
);

if (!disabled) {
    var regexes = buildRegexes();
    walk(document.body, regexes);
}