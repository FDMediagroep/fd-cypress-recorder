const storage =
    typeof browser !== 'undefined' ? browser.storage : chrome.storage;

// Saves options to storage.
function saveOptions() {
    const enable = document.getElementById('enable').checked;
    storage.local.set(
        {
            enable,
        },
        function() {
            // Update status to let user know options were saved.
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
        }
    );
    const attributeSelectorFirst = document.getElementById(
        'attributeSelectorFirst'
    ).checked;
    storage.local.set(
        {
            attributeSelectorFirst,
        },
        function() {
            // Update status to let user know options were saved.
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
        }
    );
}

// Restores select box and checkbox state using the preferences
// stored in storage.
function restoreOptions() {
    storage.local.get(
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
