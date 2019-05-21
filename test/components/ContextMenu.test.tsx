import React from 'react';
import {act} from 'react-dom/test-utils';
import TestRenderer from 'react-test-renderer';
import ContextMenu from '../../src/components/ContextMenu';
import ReactDOM from 'react-dom';
import EventsStore = require('../../src/stores/EventsStore');
import { FdEventType, FdClickEvent, FdVisitEvent, FdHoverEvent, FdExistsEvent, FdLocationEvent } from '../../src/utils/CypressDictionary';

describe('Context Menu', () => {
    let target: HTMLElement;
    const clickMock = jest.fn();
    const mouseDownEvt = new MouseEvent('mousedown', {bubbles: true});

    beforeEach(() => {
        target = document.createElement('div');
        target.setAttribute('class', 'context-menu-test');
        target.addEventListener('click', clickMock);
        document.body.appendChild(target);
        act(() => {
            ReactDOM.render(<ContextMenu target={target} selector={'.context-menu-test'}/>, target);
        });
        
    });

    afterEach(() => {
        target.removeEventListener('click', clickMock);
        document.body.removeChild(target);
        target.remove();
        EventsStore.clear();
    });

    it('should render context menu correctly', () => {
        let contextMenu = TestRenderer.create(<ContextMenu target={target} selector={'.context-menu-test'}/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it('should handle manual Click event correctly', () => {
        [].slice.call(target.querySelectorAll('li')).forEach((li: HTMLLIElement) => {
            if (li.textContent && li.textContent.toLowerCase() === 'click') {
                li.dispatchEvent(mouseDownEvt);
            }
        });
        expect(clickMock).toHaveBeenCalledTimes(1);
        const events = EventsStore.getEvents();
        expect(events.length).toBe(1);
        const fdClickEvt = events[0] as FdClickEvent;
        expect(fdClickEvt.type).toBe(FdEventType.CLICK);
        expect(fdClickEvt.target).toBe('.context-menu-test');
    });

    it('should handle Check Exists event correctly', () => {
        [].slice.call(target.querySelectorAll('li')).forEach((li: HTMLLIElement) => {
            if (li.textContent && li.textContent.toLowerCase() === 'exists') {
                li.dispatchEvent(mouseDownEvt);
            }
        });
        expect(clickMock).toHaveBeenCalledTimes(1);
        const events = EventsStore.getEvents();
        expect(events.length).toBe(1);
        const fdClickEvt = events[0] as FdExistsEvent;
        expect(fdClickEvt.type).toBe(FdEventType.EXISTS);
        expect(fdClickEvt.target).toBe('.context-menu-test');
    });

    it('should handle Hover event correctly', () => {
        [].slice.call(target.querySelectorAll('li')).forEach((li: HTMLLIElement) => {
            if (li.textContent && li.textContent.toLowerCase() === 'hover') {
                li.dispatchEvent(mouseDownEvt);
            }
        });
        expect(clickMock).toHaveBeenCalledTimes(1);
        const events = EventsStore.getEvents();
        expect(events.length).toBe(1);
        const fdClickEvt = events[0] as FdHoverEvent;
        expect(fdClickEvt.type).toBe(FdEventType.HOVER);
        expect(fdClickEvt.target).toBe('.context-menu-test');
    });

    it('should handle Visit event correctly', () => {
        [].slice.call(target.querySelectorAll('li')).forEach((li: HTMLLIElement) => {
            if (li.textContent && li.textContent.toLowerCase() === 'visit current url') {
                li.dispatchEvent(mouseDownEvt);
            }
        });
        expect(clickMock).toHaveBeenCalledTimes(1);
        const events = EventsStore.getEvents();
        expect(events.length).toBe(1);
        const fdClickEvt = events[0] as FdVisitEvent;
        expect(fdClickEvt.type).toBe(FdEventType.VISIT);
        expect(fdClickEvt.href).toBe('http://localhost/');
    });

    it('should handle Match Current URL event correctly', () => {
        [].slice.call(target.querySelectorAll('li')).forEach((li: HTMLLIElement) => {
            if (li.textContent && li.textContent.toLowerCase() === 'match current url') {
                li.dispatchEvent(mouseDownEvt);
            }
        });
        expect(clickMock).toHaveBeenCalledTimes(1);
        const events = EventsStore.getEvents();
        expect(events.length).toBe(1);
        const fdClickEvt = events[0] as FdLocationEvent;
        expect(fdClickEvt.type).toBe(FdEventType.LOCATION);
        expect(fdClickEvt.href).toBe('http://localhost/');
    });

    it('should handle Attributes... event correctly', () => {
        [].slice.call(target.querySelectorAll('li')).forEach((li: HTMLLIElement) => {
            if (li.textContent && li.textContent.toLowerCase() === 'attributes...') {
                li.dispatchEvent(mouseDownEvt);
            }
        });
        expect(clickMock).toHaveBeenCalledTimes(1);
        expect(target.querySelectorAll('li.label.back').length).toBe(1);
    });

    it('should handle Attributes... and then Back event correctly', () => {
        [].slice.call(target.querySelectorAll('li')).forEach((li: HTMLLIElement) => {
            if (li.textContent && li.textContent.toLowerCase() === 'attributes...') {
                li.dispatchEvent(mouseDownEvt);
            }
        });
        expect(clickMock).toHaveBeenCalledTimes(1);
        expect(target.querySelectorAll('li.label.back').length).toBe(1);

        [].slice.call(target.querySelectorAll('li.label.back')).forEach((li: HTMLLIElement) => {
            li.dispatchEvent(mouseDownEvt);
        });

        expect(target.querySelectorAll('li.label.back').length).toBe(0);
    });

});
