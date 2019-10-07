import React from 'react';
import unique from 'unique-selector';
import styled from 'styled-components';
import { AllFdEvents, FdEventType } from '../utils/FdEvents';

export interface Props {
    target: HTMLElement;
    selector: string;
    onBack?: () => void;
    onMouseDown: (event: AllFdEvents) => void;
}

export default function ContextULCheckCount(props: Props) {
    const parent = props.target.parentNode;
    const selector = parent
        ? `${unique(parent)} > ${props.target.nodeName}`
        : props.selector;
    const count = parent ? document.querySelectorAll(selector).length : 1;

    function handleBack(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        if (props.onBack) {
            props.onBack();
        }
    }

    function handleCountEqualsThis() {
        props.onMouseDown({
            type: FdEventType.COUNT_EQUALS,
            target: selector,
            value: count,
        });
    }

    function handleCountEquals() {
        const value = prompt('Count equals...');
        if (value) {
            props.onMouseDown({
                type: FdEventType.COUNT_EQUALS,
                target: selector,
                value: parseInt(value, 10),
            });
        }
    }

    function handleCountGreater() {
        const value = prompt('Count greater than...');
        if (value) {
            props.onMouseDown({
                type: FdEventType.COUNT_GREATER_THAN,
                target: selector,
                value: parseInt(value, 10),
            });
        }
    }

    function handleCountLess() {
        const value = prompt('Count greater less...');
        if (value) {
            props.onMouseDown({
                type: FdEventType.COUNT_LESS_THAN,
                target: selector,
                value: parseInt(value, 10),
            });
        }
    }

    return (
        <ul>
            <li className="label back" onMouseDown={handleBack}>
                &lt; Count
            </li>
            <React.Fragment>
                <StyledLI className="label separator">
                    <i>{selector}</i>
                    <span>({count})</span>
                </StyledLI>
                <li className="clickable" onMouseDown={handleCountEqualsThis}>
                    Equals {count}
                </li>
                <li className="clickable" onMouseDown={handleCountEquals}>
                    Equals...
                </li>
                <li className="clickable" onMouseDown={handleCountGreater}>
                    Greater than...
                </li>
                <li className="clickable" onMouseDown={handleCountLess}>
                    Less than...
                </li>
            </React.Fragment>
        </ul>
    );
}

const StyledLI = styled.li`
    display: flex;
    flex-direction: column;
`;
