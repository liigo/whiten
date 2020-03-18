chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        title: 'Clean up background',
        contexts: ['all'],
        id: 'whiten-bg',
    });

    chrome.contextMenus.create({
        title: 'Remove element',
        contexts: ['all'],
        id: 'whiten-rm',
    });

    chrome.contextMenus.create({
        title: 'Remove elements by class',
        contexts: ['all'],
        id: 'whiten-rm-by-class',
    });

    chrome.contextMenus.create({
        title: 'Remove elements by box',
        contexts: ['all'],
        id: 'whiten-rm-by-box',
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
    
    chrome.contextMenus.create({
        title: 'Highlight elements by class',
        contexts: ['all'],
        id: 'whiten-hl-by-class',
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
