import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import ContextULCheckAttribute from '../../src/components/ContextULCheckAttribute';
import ReactDOM from 'react-dom';
import { FdEventType } from '../../src/utils/CypressDictionary';

describe('Context Menu Attribute', () => {
    let target: HTMLElement;
    const existsMock = jest.fn();
    const backMock = jest.fn();
    const mouseDownEvt = new MouseEvent('mousedown', {bubbles: true});

    beforeEach(() => {
        target = document.createElement('div');
        target.classList.add('context-menu-attributes-test');
        document.body.appendChild(target);
        act(() => {
            ReactDOM.render(<ContextULCheckAttribute onBack={backMock} onMouseDown={existsMock} selector=".context-menu-attributes-test" target={target}/>, target);
        });
    });

    afterEach(() => {
        document.body.removeChild(target);
        target.remove();
        existsMock.mockClear();
        backMock.mockClear();
    });

    it('should render without attributes correctly', () => {
        let contextMenu = TestRenderer.create(<ContextULCheckAttribute onMouseDown={() => {}} selector="document.body" target={document.body}/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it('should render with attributes correctly', () => {
        let contextMenu = TestRenderer.create(<ContextULCheckAttribute onMouseDown={() => {}} selector=".context-menu-attributes-test" target={target}/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it('should handle Exists event correctly', () => {
        [].slice.call(target.querySelectorAll('li')).forEach((li: HTMLLIElement) => {
            if (li.textContent && li.textContent.toLowerCase() === 'exists') {
                li.dispatchEvent(mouseDownEvt);
            }
        });
        expect(existsMock).toHaveBeenCalledTimes(1);
        expect(existsMock).toBeCalledWith({
            type: FdEventType.ATTRIBUTE_VALUE_EXISTS,
            target: '.context-menu-attributes-test',
            name: 'class'
        });
    });

    it('should handle Equals event correctly', () => {
        [].slice.call(target.querySelectorAll('li')).forEach((li: HTMLLIElement) => {
            if (li.textContent && li.textContent.toLowerCase().indexOf('equals') > -1) {
                li.dispatchEvent(mouseDownEvt);
            }
        });
        expect(existsMock).toHaveBeenCalledTimes(1);
        expect(existsMock).toBeCalledWith({
            type: FdEventType.ATTRIBUTE_VALUE_EQUALS,
            target: '.context-menu-attributes-test',
            name: 'class',
            value: 'context-menu-attributes-test'
        });
    });

    it('should handle Back event correctly', () => {
        [].slice.call(target.querySelectorAll('li')).forEach((li: HTMLLIElement) => {
            if (li.textContent && li.classList.contains('back')) {
                li.dispatchEvent(mouseDownEvt);
            }
        });
        expect(backMock).toHaveBeenCalledTimes(1);
    });

});
