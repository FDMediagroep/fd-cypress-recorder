import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import ReactDOM from 'react-dom';
import { FdEventType } from '../../src/utils/CypressDictionary';
import ContextULCheckCount from '../../src/components/ContextULCheckCount';

describe('Context Menu Count', () => {
    let target: HTMLElement;
    let dummyTarget: HTMLElement;
    const equalsMock = jest.fn();
    const backMock = jest.fn();
    const mouseDownEvt = new MouseEvent('mousedown', {bubbles: true});

    beforeEach(() => {
        target = document.createElement('div');
        target.classList.add('context-menu-count-test');
        dummyTarget = document.createElement('div');
        document.body.appendChild(target);
        document.body.appendChild(dummyTarget);
        act(() => {
            ReactDOM.render(<ContextULCheckCount onBack={backMock} onMouseDown={equalsMock} selector=".context-menu-count-test" target={target}/>, target);
        });
    });

    afterEach(() => {
        document.body.removeChild(target);
        document.body.removeChild(dummyTarget);
        target.remove();
        dummyTarget.remove();
        equalsMock.mockClear();
        backMock.mockClear();
    });

    it('should render correctly', () => {
        let contextMenu = TestRenderer.create(<ContextULCheckCount onMouseDown={() => {}} selector=".context-menu-count-test" target={target}/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it('should handle Equals event correctly', () => {
        [].slice.call(target.querySelectorAll('li')).forEach((li: HTMLLIElement) => {
            if (li.textContent && li.textContent.toLowerCase().indexOf('equals ') > -1) {
                li.dispatchEvent(mouseDownEvt);
            }
        });
        expect(equalsMock).toHaveBeenCalledTimes(1);
        expect(equalsMock).toBeCalledWith({
            type: FdEventType.COUNT_EQUALS,
            target: 'body > DIV',
            value: 2
        });
    });
});
