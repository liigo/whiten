chrome.browserAction.setTitle({
    title: 'Whiten: clean DOM elements you right clicks on',
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        title: 'Clean background',
        contexts: ['all'],
        id: 'whiten-bg',
    });

    chrome.contextMenus.create({
        title: 'Remove element',
        contexts: ['all'],
        id: 'whiten-rm',
    });

    chrome.contextMenus.create({
        type: 'separator',
        contexts: ['all'],
        id: 'sep1',
    });

    chrome.contextMenus.create({
        title: 'Highlight element',
        contexts: ['all'],
        id: 'whiten-hl',
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    // query active tab, and send message to avtive tab
    chrome.tabs.query({
        active: true,
        currentWindow: true,
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd_id: info.menuItemId,
        }, function(response) {
            console.log(response.result);
        });
    });
});
