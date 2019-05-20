import React from 'react';
import {act} from 'react-dom/test-utils';
import TestRenderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import ContextMenuOverlay from '../../src/components/ContextMenuOverlay';

describe('Context Menu Overlay', () => {
    let target: HTMLElement;
    const clickEvt = new MouseEvent('click', {bubbles: true});
    const clickMock = jest.fn();

    beforeEach(() => {
        target = document.createElement('div');
        target.setAttribute('class', 'context-menu-overlay-test');
        document.body.appendChild(target);
        act(() => {
            ReactDOM.render(<ContextMenuOverlay onClick={clickMock} target={target} selector={'.context-menu-overlay-test'}/>, target);
        });
    });

    afterEach(() => {
        target.removeEventListener('click', clickMock);
        document.body.removeChild(target);
        target.remove();
    });

    it('should render Context Menu Overlay correctly', () => {
        let contextMenu = TestRenderer.create(<ContextMenuOverlay onClick={clickMock} target={target} selector={'.context-menu-overlay-test'}/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it('should handle Click event correctly', () => {
        const contextMenuOverlay = target.querySelector('div');
        if (contextMenuOverlay) {
            contextMenuOverlay.dispatchEvent(clickEvt);
        }
        expect(clickMock).toHaveBeenCalledTimes(1);
    });

});
