// Saves options to chrome.storage.
function saveOptions() {
    var enable = document.getElementById('enable').checked;
    chrome.storage.local.set(
        {
            enable: enable,
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
        },
        function(items) {
            document.getElementById('enable').checked = items.enable;
        }
    );
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
