import unique from 'unique-selector';
import EventsStore = require('./stores/EventsStore');
import React from 'react';
import ReactDOM from 'react-dom';
import ContextMenuOverlay from './components/ContextMenuOverlay';
import { FdEventType, UNIQUE_SELECTOR_OPTIONS } from './utils/CypressDictionary';
import { StoreBase } from 'resub';

declare var chrome: any;

const storageName = 'fd-cypress-chrome-extension-events';
const storageRecord = 'fd-cypress-chrome-extension-record';

let hoveredElement: HTMLElement;

let recording: boolean = false;
let contextMenu = false;

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
 * Persist the events and recording state to browser storage.
 */
function save(cb?: () => void) {
    const events = EventsStore.getEvents();
    // Save it using the Chrome extension storage API.
    chrome.storage.local.set({
        'fd-cypress-chrome-extension-events': events,
        'fd-cypress-chrome-extension-record': recording
    });
    removeContextMenu();
}

/**
 * Load events from browser storage.
 */
function loadEvents() {
    chrome.storage.local.get({'fd-cypress-chrome-extension-events': null}, (items: any) => {
        EventsStore.setEvents(items[storageName]);
    });
}

/**
 * Handle click
 */
function clickListener(e: Event) {
    const target = e.currentTarget as HTMLElement;
    if (target) {
        EventsStore.addEvent({type: FdEventType.CLICK, target: unique(target, UNIQUE_SELECTOR_OPTIONS)});
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
 * Handle keyboard events.
 *
 * CTRL + Print Screen: open context menu for hovered element.
 * CTRL + Pause/Break: toggle recording state.
 *
 * @param e KeyboardEvent
 */
function keyUpListener(e: KeyboardEvent) {
    if (e.ctrlKey && e.keyCode === 44) {
        // Print screen
        removeContextMenu();
        contextMenu = true;
        const el = document.createElement('section');
        el.setAttribute('class', 'fd-cypress-chrome-extension');
        document.body.appendChild(el);
        ReactDOM.render(<ContextMenuOverlay target={hoveredElement} selector={unique(hoveredElement, UNIQUE_SELECTOR_OPTIONS)} onClick={removeContextMenu}/>, el);
    } else if (e.keyCode === 27) {
        // Escape
        removeContextMenu();
    }
}

/**
 * Save the events and recording state when navigating away from the current page.
 */
function beforeUnload() {
    save();
}

/**
 * Stop recording. Remove event listeners.
 */
function stop() {
    recording = false;
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
    window.removeEventListener('beforeunload', beforeUnload);
    save();
}

/**
 * Start recording events. Bind event handlers.
 */
function record() {
    recording = true;
    document.getElementsByTagName('head')[0].appendChild(style);

    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    EventsStore.addUniqueEvent({type: FdEventType.VIEWPORT_SIZE, width, height});
    EventsStore.addUniqueEvent({type: FdEventType.VISIT, href: window.location.href});

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
    window.addEventListener('beforeunload', beforeUnload);
}

/**
 * Add listener to browser storage change events.
 * We modify corresponding Application data stores which in turn propagates to the views that rely on the data.
 * This ultimately results in the views always correctly reflecting the current application state.
 */
chrome.storage.onChanged.addListener((changes: any, namespace: any) => {
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

/**
 * Entry point.
 */
chrome.storage.local.get({
    'enable': true,
    'fd-cypress-chrome-extension-events': null,
    'fd-cypress-chrome-extension-record': false
}, (items: any) => {
    recording = !!items[storageRecord];
    console.log('FD Cypress enabled', items.enable);
    if (items.enable) {
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.ctrlKey && e.keyCode === 3) {
                // Break/Pause
                recording ? stop() : record();
            }
        });

        EventsStore.subscribe(() => {
            save();
        }, StoreBase.Key_All);

        if (items[storageName]) {
            EventsStore.setEvents(items[storageName]);
        }
        if (recording) {
            record();
        }
    }
});
