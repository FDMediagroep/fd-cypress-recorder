const browserAction =
    typeof browser !== 'undefined'
        ? browser.browserAction
        : chrome.browserAction;
const browserDebugger =
    typeof browser !== 'undefined' ? browser.debugger : chrome.debugger;
const runtime =
    typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;
const tabs = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs;
const storage =
    typeof browser !== 'undefined' ? browser.storage : chrome.storage;
const windows =
    typeof browser !== 'undefined' ? browser.windows : chrome.windows;

const storageName = 'fd-cypress-chrome-extension-events';
const storageRecord = 'fd-cypress-chrome-extension-record';

const oldEvent = false;
let tabId;

tabs.getCurrent((tab) => {
    if (tab) {
        tabId = tab.id;
    }
    console.log('current tab', tabId);
});

storage.local.get(
    {
        'fd-cypress-chrome-extension-record': false,
    },
    function (items) {
        if (items['fd-cypress-chrome-extension-record']) {
            setTimeout(() => {
                browserAction.setIcon({ path: 'record.png' });
            }, 200);
        }
    }
);

/**
 * Add listener to browser storage change events.
 */
storage.onChanged.addListener((changes, namespace) => {
    for (const key in changes) {
        if (changes[key]) {
            const storageChange = changes[key];
            console.log(
                'Storage key "%s" in namespace "%s" changed. ' +
                    'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue
            );
            switch (key) {
                case storageRecord:
                    browserAction.setIcon({
                        path: !!storageChange.newValue
                            ? 'record.png'
                            : '48x48.png',
                    });
                    break;
                case storageName:
                    if (
                        storageChange.newValue &&
                        storageChange.newValue.length > 0
                    ) {
                        const lastEvent =
                            storageChange.newValue[
                                storageChange.newValue.length - 1
                            ];
                        if (!oldEvent && lastEvent.type === 'type') {
                            tabs.query(
                                { active: true, currentWindow: true },
                                (tabs) => {
                                    tabId = tabs[0]?.id;
                                    browserDebugger.attach({ tabId }, '1.0');
                                    browserDebugger.sendCommand(
                                        { tabId },
                                        'Input.insertText',
                                        { text: lastEvent.value },
                                        () => {
                                            browserDebugger.detach({ tabId });
                                        }
                                    );
                                }
                            );
                        }
                    }
                    break;
            }
        }
    }
});

browserDebugger.onEvent.addListener((source) => {
    console.log(source);
});
browserDebugger.onDetach.addListener((source, reason) => {
    console.log(source, reason);
});

tabs.onActivated.addListener((activeInfo) => {
    tabId = activeInfo.tabId;
});

runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.get === 'tabId') {
        sendResponse({ activeTabId: tabId, ownTabId: sender.tab.id });
        tabs.query({ active: true, currentWindow: true }, (tabs) => {
            tabId = tabs[0]?.id;
        });
    }

    if (request.head === 'activeTabId') {
        tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // console.log('old tab', tabId, 'new tab', tabs[0].id);
            tabId = tabs[0]?.id;
        });
    }
});

windows.onFocusChanged.addListener((windowId) => {
    windows.getCurrent({ populate: true }, (window) => {
        if (window.focused && window.tabs) {
            window.tabs.forEach((tab) => {
                if (tab.active) {
                    // console.log('window focus', 'old tab', tabId, 'new tab', tab.id);
                    tabId = tab.id;
                }
            });
        }
    });
});
