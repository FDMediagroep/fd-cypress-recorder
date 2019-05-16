const storageRecord = 'fd-cypress-chrome-extension-record';

chrome.storage.local.get({
  'fd-cypress-chrome-extension-record': false
}, function(items) {
  if (items['fd-cypress-chrome-extension-record']) {
    setTimeout(() => {
      chrome.browserAction.setIcon({path: 'record.png'});
    }, 200)
  }
});

/**
 * Add listener to browser storage change events.
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (const key in changes) {
    if (changes[key]) {
        const storageChange = changes[key];
        // console.log('Storage key "%s" in namespace "%s" changed. ' +
        //           'Old value was "%s", new value is "%s".',
        //           key,
        //           namespace,
        //           storageChange.oldValue,
        //           storageChange.newValue);
        switch (key) {
          case storageRecord:
            chrome.browserAction.setIcon({path: !!storageChange.newValue ? 'record.png' : '48x48.png'});
            break;
        }
    }
  }
});
