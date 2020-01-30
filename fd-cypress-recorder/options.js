// Saves options to chrome.storage.
function saveOptions() {
    var enable = document.getElementById('enable').checked;
    chrome.storage.local.set(
        {
            enable,
        },
        function() {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
        }
    );
    var attributeSelectorFirst = document.getElementById(
        'attributeSelectorFirst'
    ).checked;
    chrome.storage.local.set(
        {
            attributeSelectorFirst,
        },
        function() {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
        }
    );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
    chrome.storage.local.get(
        {
            enable: true,
            attributeSelectorFirst: false,
        },
        function(items) {
            document.getElementById('enable').checked = items.enable;
            document.getElementById('attributeSelectorFirst').checked =
                items.attributeSelectorFirst;
        }
    );
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
