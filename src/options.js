// liigo: 20241016

document.addEventListener('DOMContentLoaded', load_options);
document.getElementById('save_button').addEventListener('click', save_options);

function load_options() {
    chrome.storage.sync.get(["urlprefix"], (result) => {
        input().value = result.urlprefix;
        console.log("[whiten] load urlprefix:", result.urlprefix);
    });
}

function save_options() {
    urlprefix = input().value;
    chrome.storage.sync.set({ urlprefix }, () => {
        console.log("[whiten] save urlprefix:", urlprefix);
    });
}

function input() {
    return document.getElementById('urlprefix_input');
}
