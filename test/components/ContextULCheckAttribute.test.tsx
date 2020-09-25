import React from 'react';
import { act } from 'react-dom/test-utils';
import TestRenderer from 'react-test-renderer';
import ContextULCheckAttribute from '../../src/components/ContextULCheckAttribute';
import ReactDOM from 'react-dom';
import { FdEventType } from '../../src/utils/FdEvents';

describe('Context Menu Attribute', () => {
    let target: HTMLElement;
    const mouseDownMock = jest.fn();
    const backMock = jest.fn();
    const mouseDownEvt = new MouseEvent('mousedown', { bubbles: true });

    beforeEach(() => {
        target = document.createElement('div');
        target.classList.add('context-menu-attributes-test');
        document.body.appendChild(target);
        act(() => {
            ReactDOM.render(
                <ContextULCheckAttribute
                    onBack={backMock}
                    onMouseDown={mouseDownMock}
                    selector=".context-menu-attributes-test"
                    target={target}
                />,
                target
            );
        });
    });

    afterEach(() => {
        document.body.removeChild(target);
        target.remove();
        mouseDownMock.mockClear();
        backMock.mockClear();
    });

    it('should render without attributes correctly', () => {
        let contextMenu = TestRenderer.create(
            <ContextULCheckAttribute
                onMouseDown={() => {}}
                selector="document.body"
                target={document.body}
            />
        );
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it('should render with attributes correctly', () => {
        let contextMenu = TestRenderer.create(
            <ContextULCheckAttribute
                onMouseDown={() => {}}
                selector=".context-menu-attributes-test"
                target={target}
            />
        );
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it('should handle Exists event correctly', () => {
        [].slice
            .call(target.querySelectorAll('li'))
            .forEach((li: HTMLLIElement) => {
                if (
                    li.textContent &&
                    li.textContent.toLowerCase() === 'exists'
                ) {
                    li.dispatchEvent(mouseDownEvt);
                }
            });
        expect(mouseDownMock).toHaveBeenCalledTimes(1);
        expect(mouseDownMock).toBeCalledWith({
            type: FdEventType.ATTRIBUTE_VALUE_EXISTS,
            target: '.context-menu-attributes-test',
            name: 'class',
        });
    });

    it('should handle Equals event correctly', () => {
        [].slice
            .call(target.querySelectorAll('li'))
            .forEach((li: HTMLLIElement) => {
                if (
                    li.textContent &&
                    li.textContent.toLowerCase().indexOf('equals') > -1
                ) {
                    li.dispatchEvent(mouseDownEvt);
                }
            });
        expect(mouseDownMock).toHaveBeenCalledTimes(1);
        expect(mouseDownMock).toBeCalledWith({
            type: FdEventType.ATTRIBUTE_VALUE_EQUALS,
            target: '.context-menu-attributes-test',
            name: 'class',
            value: 'context-menu-attributes-test',
        });
    });

    it('should handle Back event correctly', () => {
        [].slice
            .call(target.querySelectorAll('li h2'))
            .forEach((li: HTMLLIElement) => {
                li.dispatchEvent(mouseDownEvt);
            });
        expect(backMock).toHaveBeenCalledTimes(1);
    });

    it('should handle Equals custom value event correctly', () => {
        const promptMock = jest.fn();
        promptMock.mockReturnValue('contains something');
        window.prompt = promptMock;
        [].slice
            .call(target.querySelectorAll('li'))
            .forEach((li: HTMLLIElement) => {
                if (
                    li.textContent &&
                    li.textContent.toLowerCase() === 'contains...'
                ) {
                    li.dispatchEvent(mouseDownEvt);
                    return false; // Exit loop
                }
            });
        expect(mouseDownMock).toHaveBeenCalledTimes(1);
        expect(mouseDownMock).toBeCalledWith({
            type: FdEventType.ATTRIBUTE_VALUE_CONTAINS,
            target: '.context-menu-attributes-test',
            name: 'class',
            value: 'contains something',
        });
    });
});
