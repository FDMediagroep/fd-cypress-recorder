import unique from 'unique-selector';
import EventsStore = require('./stores/EventsStore');
import React from 'react';
import ReactDOM from 'react-dom';
import ContextMenuOverlay from './components/ContextMenuOverlay';
import {
    FdEventType,
    UNIQUE_SELECTOR_OPTIONS,
    UNIQUE_SELECTOR_OPTIONS_WITHOUT_ID,
    UNIQUE_ATTR_SELECTOR_OPTIONS,
    UNIQUE_ATTR_SELECTOR_OPTIONS_WITHOUT_ID,
} from './utils/FdEvents';
import { StoreBase } from 'resub';

declare let chrome: any;

const storageName = 'fd-cypress-chrome-extension-events';
const storageRecord = 'fd-cypress-chrome-extension-record';

let useAttributeSelectorFirst = false;
let hoveredElement: HTMLElement;

let recording = false;
let contextMenu = false;

let subscriptionToken = 0;

const style: any = document.createElement('style');
const css = `a:hover, button:hover {
    background-color: rgba(73, 164, 162, 0.5) !important;
}`;
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

/**
 * A small wrapper that first tries to call unique an additional ID selector.
 * Should that fail, because for instance IDs are ill-formated in the html it
 * tries again without the ID selector.
 */
function uniqueWithRetry(target: HTMLElement) {
    try {
        return unique(
            target,
            useAttributeSelectorFirst
                ? UNIQUE_ATTR_SELECTOR_OPTIONS
                : UNIQUE_SELECTOR_OPTIONS
        );
    } catch (e) {
        return unique(
            target,
            useAttributeSelectorFirst
                ? UNIQUE_ATTR_SELECTOR_OPTIONS_WITHOUT_ID
                : UNIQUE_SELECTOR_OPTIONS_WITHOUT_ID
        );
    }
}

/**
 * Remove the context menu and its overlay.
 */
function removeContextMenu() {
    const existingEl = document.querySelector('.fd-cypress-chrome-extension');
    if (existingEl) {
        existingEl.remove();
    }
    contextMenu = false;
}

/**
 * Persist the events and recording state to browser storage.
 */
function saveEvents() {
    const events = EventsStore.getEvents();
    // Save it using the Chrome extension storage API.
    chrome.storage.local.set({
        'fd-cypress-chrome-extension-events': events,
    });
    removeContextMenu();
}

/**
 * Load events from browser storage.
 */
function loadEvents() {
    chrome.storage.local.get(
        { 'fd-cypress-chrome-extension-events': null },
        (items: any) => {
            EventsStore.setEvents(items[storageName], 'loadEvents');
        }
    );
}

/**
 * Handle click
 */
function clickListener(e: Event) {
    const target = e.currentTarget as HTMLElement;
    if (target) {
        EventsStore.addEvent({
            type: FdEventType.CLICK,
            target: uniqueWithRetry(target),
        });
    }
}

/**
 * Sets the current hovered element.
 * @param e MouseEvent
 */
function mouseOverListener(e: MouseEvent) {
    if (!contextMenu) {
        hoveredElement = e.target as HTMLElement;
    }
}

/**
 * Handle keyboard events.
 *
 * ALT + b: open context menu for hovered element.
 *
 * ALT + r: open context menu for hovered element.
 *
 * ALT + ContextMenu: open context menu for hovered element.
 *
 * CTRL + Print Screen: open context menu for hovered element.
 *
 * CTRL + Pause/Break: toggle recording state.
 *
 * @param e KeyboardEvent
 */
function keyUpListener(e: KeyboardEvent) {
    if (
        (e.ctrlKey && e.keyCode === 44) ||
        (e.altKey && e.key === 'c') ||
        (e.altKey && e.key === 'ContextMenu') ||
        (e.altKey && e.key === 'b')
    ) {
        // Print screen
        removeContextMenu();
        contextMenu = true;
        const el = document.createElement('section');
        el.setAttribute('class', 'fd-cypress-chrome-extension');
        document.body.appendChild(el);
        ReactDOM.render(
            <ContextMenuOverlay
                target={hoveredElement}
                selector={uniqueWithRetry(hoveredElement)}
                onClick={removeContextMenu}
            />,
            el
        );
    } else if (e.keyCode === 27) {
        // Escape
        removeContextMenu();
    }
}

/**
 * CTRL + Context Menu: open context menu.
 * @param e
 */
function mouseRightClickListener(e: MouseEvent) {
    if (e.ctrlKey) {
        e.preventDefault();
        removeContextMenu();
        contextMenu = true;
        const el = document.createElement('section');
        el.setAttribute('class', 'fd-cypress-chrome-extension');
        document.body.appendChild(el);
        ReactDOM.render(
            <ContextMenuOverlay
                target={hoveredElement}
                selector={uniqueWithRetry(hoveredElement)}
                onClick={removeContextMenu}
            />,
            el
        );
    }
}

/**
 * Save the events and recording state when navigating away from the current page.
 */
function beforeUnload() {
    console.log('before unload');
    saveEvents();
}

/**
 * Stop recording. Remove event listeners.
 */
function stop() {
    recording = false;
    chrome.storage.local.set({
        'fd-cypress-chrome-extension-record': recording,
    });

    EventsStore.unsubscribe(subscriptionToken);

    document.getElementsByTagName('head')[0].removeChild(style);
    [].slice.call(document.querySelectorAll('*')).forEach((el: HTMLElement) => {
        switch (el.nodeName) {
            case 'A':
            case 'BUTTON':
                el.removeEventListener('click', clickListener);
                break;
        }
    });

    window.removeEventListener('mouseover', mouseOverListener);
    window.removeEventListener('keyup', keyUpListener);
    window.removeEventListener('contextmenu', mouseRightClickListener);
    window.removeEventListener('beforeunload', beforeUnload);
}

/**
 * Start recording events. Bind event handlers.
 */
function record() {
    recording = true;

    chrome.storage.local.set({
        'fd-cypress-chrome-extension-record': recording,
    });

    subscriptionToken = EventsStore.subscribe((keys?: string[]) => {
        if (keys && keys.length && keys[0] === 'loadEvents') {
            return;
        } // Prevent an infinite loop.
        saveEvents();
    }, StoreBase.Key_All);

    document.getElementsByTagName('head')[0].appendChild(style);

    const width = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
    );
    const height = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
    );

    EventsStore.addUniqueEvent({
        type: FdEventType.VIEWPORT_SIZE,
        width,
        height,
    });
    EventsStore.addUniqueEvent({
        type: FdEventType.VISIT,
        href: window.location.href,
    });

    [].slice.call(document.querySelectorAll('*')).forEach((el: HTMLElement) => {
        switch (el.nodeName) {
            case 'A':
            case 'BUTTON':
                el.addEventListener('click', clickListener);
                break;
        }
    });
    window.addEventListener('mouseover', mouseOverListener);
    window.addEventListener('keyup', keyUpListener);
    window.addEventListener('contextmenu', mouseRightClickListener);
    window.addEventListener('beforeunload', beforeUnload);
}

/**
 * Add listener to browser storage change events.
 * We modify corresponding Application data stores which in turn propagates to the views that rely on the data.
 * This ultimately results in the views always correctly reflecting the current application state.
 */
chrome.storage.onChanged.addListener((changes: any) => {
    chrome.runtime.sendMessage({ get: 'tabId' }, (response: any) => {
        if (response.activeTabId !== response.ownTabId) {
            return;
        }

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
                    case storageName:
                        loadEvents();
                        break;
                    case storageRecord:
                        storageChange.newValue ? record() : stop();
                        break;
                }
            }
        }
    });
});

/**
 * Entry point.
 */
chrome.storage.local.get(
    {
        enable: true,
        attributeSelectorFirst: false,
        'fd-cypress-chrome-extension-events': null,
        'fd-cypress-chrome-extension-record': false,
    },
    (items: any) => {
        recording = !!items[storageRecord];
        console.log('FD Cypress enabled', items.enable);
        if (items.enable) {
            useAttributeSelectorFirst = items.attributeSelectorFirst;
            window.addEventListener('keyup', (e: KeyboardEvent) => {
                if (
                    (e.ctrlKey && e.keyCode === 3) ||
                    (e.altKey && e.key === 'r')
                ) {
                    // Break/Pause
                    recording ? stop() : record();
                }
            });

            window.addEventListener('focus', () => {
                try {
                    if (chrome && chrome.runtime) {
                        chrome.runtime.sendMessage({ head: 'activeTabId' });
                    }
                } catch (e) {
                    console.log(e);
                }
            });

            if (items[storageName]) {
                EventsStore.setEvents(items[storageName]);
            }
            if (recording) {
                record();
            }
        }
    }
);
