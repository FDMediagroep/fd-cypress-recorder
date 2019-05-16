import React, { PureComponent } from "react";
import styled from "styled-components";
import EventsStore = require("../stores/EventsStore");
import { FdEventType } from "../utils/CypressDictionary";

export interface Props {
    target: HTMLElement;
    selector: string;
}

export default class ContextMenu extends PureComponent<Props, any> {
    private top = 0;
    private left = 0;
    private w = 0;

    constructor(props: Props) {
        super(props);
        this.top = Math.max(document.documentElement.scrollTop + this.props.target.getBoundingClientRect().top + this.props.target.getBoundingClientRect().height, 0);
        this.left = Math.max(document.documentElement.scrollLeft + this.props.target.getBoundingClientRect().left + this.props.target.getBoundingClientRect().width, 0);
        this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (this.left + 200 > this.w) {
            this.left = Math.max(document.documentElement.scrollLeft + this.props.target.getBoundingClientRect().left - 200, 0);
        }
    }

    handleClick = () => {
        EventsStore.addEvent({ type: FdEventType.CLICK, target: this.props.selector });
        this.props.target.click();
    }

    handleCheckExists = () => {
        EventsStore.addEvent({ type: FdEventType.EXISTS, target: this.props.selector });
    }

    handleCheckText = () => {
        const textContent = prompt('Text content of selected element should contain') || '';
        if (textContent) {
            EventsStore.addEvent({ type: FdEventType.CONTAINS_TEXT, target: this.props.selector, value: textContent });
            alert(`Check text is "${textContent}" added`);
        }
    }

    handleHover = () => {
        EventsStore.addEvent({ type: FdEventType.HOVER, target: this.props.selector });
        this.props.target.focus();
    }

    handleVisit = () => {
        EventsStore.addEvent({ type: FdEventType.VISIT, href: window.location.href });
    }

    handleAwaitLocation = () => {
        EventsStore.addEvent({ type: FdEventType.LOCATION, href: window.location.href });
    }

    handleAwaitLocationContains = () => {
        const el = this.props.target as HTMLInputElement;
        const value = prompt('URL should contain') || '';
        if (value) {
            EventsStore.addEvent({ type: FdEventType.LOCATION_CONTAINS, value });
        }
    }

    handleEnterText = () => {
        const el = this.props.target as HTMLInputElement;
        const value = prompt('Type your text') || '';
        if (value) {
            EventsStore.addEvent({ type: FdEventType.TYPE, target: this.props.selector, value });
            el.value = value;
        }
    }

    render() {
        return (
            <>
                <StyledContextMenu top={this.top} left={this.left}>
                    <ul>
                        <li className="label">Interactions</li>
                        <li className="clickable" onMouseDown={this.handleClick}>Click</li>
                        <li className="clickable" onMouseDown={this.handleHover}>Hover</li>
                        <li className="label">Asserts</li>
                        <li className="clickable" onMouseDown={this.handleCheckExists}>Exists</li>
                        <li className="clickable" onMouseDown={this.handleCheckText}>Contains text</li>
                        <li className="clickable" onMouseDown={this.handleAwaitLocationContains}>URL contains</li>
                        <li className="label">Global</li>
                        <li className="clickable" onMouseDown={this.handleAwaitLocation}>Match current URL</li>
                        <li className="clickable" onMouseDown={this.handleVisit}>Visit current URL</li>
                        <li className="clickable" onMouseDown={this.handleEnterText}>Enter text</li>
                    </ul>
                    <small>{this.props.selector}</small>
                </StyledContextMenu>
            </>
        );
    }
}

const StyledContextMenu: any = styled.div`
    position: absolute;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px #999;
    top: ${(props: any) => props.top}px;
    left: ${(props: any) => props.left}px;
    width: 200px;
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        li {
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            padding: .5rem 1rem;
            &.label {
                justify-content: center;
                color: #49a4a2;
            }
            &.clickable {
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
    small {
        color: #677381;
        display: block;
        padding: 1rem;
    }
`;
