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

    let others_menu = chrome.contextMenus.create({
        title: 'Others ...',
        contexts: ['all'],
        id: 'whiten-others',
    });

    chrome.contextMenus.create({
        title: 'Remove rust-internals header',
        contexts: ['all'],
        id: 'whiten-rm-rust-internals-hdr',
        parentId : others_menu,
    });

    chrome.contextMenus.create({
        title: 'Remove zhihu.com header',
        contexts: ['all'],
        id: 'whiten-rm-zhihu-hdr',
        parentId : others_menu,
    });

    // -------------------

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

    // -------------------

    chrome.contextMenus.create({
        type: 'separator',
        contexts: ['all'],
        id: 'sep2',
    });

    chrome.contextMenus.create({
        title: 'Reload with urlprefix',
        contexts: ['all'],
        id: 'whiten-urlprefix',
    });
});

chrome.contextMenus.onClicked.addListener(function(info, _tab) {
    // query active tab, and send message to avtive tab
    chrome.tabs.query({
        active: true,
        currentWindow: true,
    }, ([tab]) => {
        if (info.menuItemId === "whiten-urlprefix") {
            reloadWithUrlPrefix(tab);
        } else {
            // will process these commands in content_script.js
            chrome.tabs.sendMessage(tab.id, {
                cmd_id: info.menuItemId,
            }, function(response) {
                console.log(response.result);
            });
        }
    });
});

// liigo: 20241022: see "commands" in manifest.json
chrome.commands.onCommand.addListener((cmd) => {
    console.log("on command:", cmd);
    // query active tab, and send message to avtive tab
    chrome.tabs.query({
        active: true,
        currentWindow: true,
    }, ([tab]) => {
        if (cmd === "reload-with-urlprefix") {
            reloadWithUrlPrefix(tab);
        }
    });
});

// liigo: 20241016: reload with urlprefix (e.g. hiany)
// 根据使用场景，当前页面大概率没有加载成功(unreachable)，content_script.js尚未生效，
// 因而此命令只能在background.js内处理。
function reloadWithUrlPrefix(tab) {
    let url = tab.pendingUrl || tab.url;
    let urlprefix;
    chrome.storage.sync.get(["urlprefix"], (result) => {
        urlprefix = result.urlprefix;
        console.log("[whiten] load urlprefix:", urlprefix);
        if (urlprefix && urlprefix.trim() !== "")
            url = `${urlprefix}/${url}`;
        else
            url = "https://unknown-urlprefix-option/" + url;
        console.log("[whiten] new url:", url);
        chrome.tabs.update(tab.id, {url}); // reload new url
    });
}
