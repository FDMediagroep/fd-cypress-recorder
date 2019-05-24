import React, { PureComponent } from "react";
import styled from "styled-components";
import EventsStore = require("../stores/EventsStore");
import { FdEventType, FdAttributeValueEvent, FdAttributeExistsEvent, AllFdEvents } from "../utils/CypressDictionary";
import ContextULCheckAttribute from "./ContextULCheckAttribute";
import ContextULCheckCount from "./ContextULCheckCount";

declare var window: Window;

export interface Props {
    target: HTMLElement;
    selector: string;
}

/**
 * This component renders the context menu.
 */
export default class ContextMenu extends PureComponent<Props, any> {
    state: any = {};
    private top = 0;
    private left = 0;
    private w = 0;

    constructor(props: Props) {
        super(props);
        this.top = Math.max(document.documentElement.scrollTop + this.props.target.getBoundingClientRect().top + this.props.target.getBoundingClientRect().height, 0);
        this.left = Math.max(document.documentElement.scrollLeft + this.props.target.getBoundingClientRect().left + this.props.target.getBoundingClientRect().width, 0);
        this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (this.left + 250 > this.w) {
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
        const value = prompt('URL should contain') || '';
        if (value) {
            EventsStore.addEvent({ type: FdEventType.LOCATION_CONTAINS, value });
        }
    }

    handleGoToLocation = () => {
        const value = prompt('URL to visit', 'https://') || '';
        if (value) {
            EventsStore.addEvent({ type: FdEventType.VISIT, href: value });
            window.location.assign(value);
        }
    }

    handleEnterText = () => {
        this.props.target.focus();
        const value = prompt('Type your text') || '';
        if (value) {
            EventsStore.addEvent({ type: FdEventType.TYPE, target: this.props.selector, value });
        }
    }

    handleSubContextMenuAssert = (event: AllFdEvents) => {
        EventsStore.addEvent(event);
    }

    /**
     * Open Check Attribute context menu
     */
    handleCheckAttribute = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        this.setState({
            customContextMenu: <ContextULCheckAttribute target={this.props.target} selector={this.props.selector} onMouseDown={this.handleSubContextMenuAssert} onBack={this.handleContextMenuBack}/>
        });
    }

    /**
     * Open Check Count context menu
     */
    handleCheckCount = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        this.setState({
            customContextMenu: <ContextULCheckCount target={this.props.target} selector={this.props.selector} onMouseDown={this.handleSubContextMenuAssert} onBack={this.handleContextMenuBack}/>
        });
    }

    handleContextMenuBack = () => {
        this.setState({customContextMenu: null});
    }

    render() {
        return (
            <StyledContextMenu top={this.top} left={this.left}>
                {this.state.customContextMenu ? this.state.customContextMenu :
                (
                    <ul>
                        <li className="label">Interactions</li>
                        <li className="clickable" onMouseDown={this.handleClick}>Click</li>
                        <li className="clickable" onMouseDown={this.handleEnterText}>Enter text...</li>
                        <li className="clickable" onMouseDown={this.handleHover}>Hover</li>
                        <li className="label">Asserts</li>
                        <li className="clickable" onMouseDown={this.handleCheckAttribute}>Attributes...</li>
                        <li className="clickable" onMouseDown={this.handleCheckText}>Contains text...</li>
                        <li className="clickable" onMouseDown={this.handleCheckCount}>Count...</li>
                        <li className="clickable" onMouseDown={this.handleCheckExists}>Exists</li>
                        <li className="label">Global</li>
                        <li className="clickable" onMouseDown={this.handleGoToLocation}>Go to URL...</li>
                        <li className="clickable" onMouseDown={this.handleAwaitLocation}>Match current URL</li>
                        <li className="clickable" onMouseDown={this.handleAwaitLocationContains}>URL contains...</li>
                        <li className="clickable" onMouseDown={this.handleVisit}>Visit current URL</li>
                    </ul>
                )}
                <small>{this.props.selector}</small>
            </StyledContextMenu>
        );
    }
}

const StyledContextMenu: any = styled.div`
    z-index: 2;
    position: absolute;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px #999;
    top: ${(props: any) => props.top}px;
    left: ${(props: any) => props.left}px;
    width: 250px;
    max-height: 500px;
    word-break: break-all;
    overflow: auto;
    overscroll-behavior: contain;
    ::-webkit-scrollbar {
        width: .5rem;
        height: .5rem;
    }

    ::-webkit-scrollbar-track {
        -webkit-border-radius: .25rem;
        border-radius: .25rem;
        background:rgba(0,0,0,0.1);
    }

    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: .25rem;
        border-radius: .25rem;
        background:rgba(0,0,0,0.2);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.4);
    }

    ::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(0,0,0,0.05);
    }

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
                &.separator {
                    background-color: rgba(0, 0, 0, .1);
                }
                &.back {
                    cursor: pointer;
                }
            }
            &.clickable {
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
    > small {
        color: #677381;
        display: block;
        padding: 1rem;
    }
`;
