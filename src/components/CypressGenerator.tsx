import React, { PureComponent } from "react";
import styled from "styled-components";
import {TextInput} from '@fdmg/fd-inputs';
import { getCode } from "../utils/Dictionary";
import { AllFdEvents } from "../utils/FdEvents";
import { ButtonEditorial } from "@fdmg/fd-buttons";
import EventsList from "./EventsList";

export interface Props {
    basicAuth: boolean;
    testSuite: string;
    testDescription: string;
    events: AllFdEvents[];
    onRemoveEvent: (index: number) => void;
    onSuiteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * This component can show the recorded events as code or as a list of individual events.
 */
export default class CypressGenerator extends PureComponent<Props, any> {
    state: any = {
        view: 'code'
    };

    constructor(props: any) {
        super(props);
        this.state.cypressCode = this.generateCodeFromEvents(this.props.events);
    }

    componentDidUpdate(prevProps: any) {
        if (prevProps.testSuite !== this.props.testSuite
            || prevProps.testDescription !== this.props.testDescription
            || prevProps.events.length !== this.props.events.length
            || prevProps.basicAuth !== this.props.basicAuth
            || JSON.stringify(prevProps.events) !== JSON.stringify(this.props.events)) {
            this.setState({cypressCode: this.generateCodeFromEvents(this.props.events)});
        }
    }

    handleTestSuiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onSuiteChange(e);
    }

    handleTestDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onDescriptionChange(e);
    }

    handleChange = () => {
    }

    toggleView = () => {
        this.setState({view: this.state.view === 'code' ? 'events' : 'code'});
    }

    removeEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onRemoveEvent(parseInt(e.currentTarget.getAttribute('data-index') || '0', 10));
    }

    generateCodeFromEvents = (events: AllFdEvents[]) => {
        const suite = this.props.testSuite ? this.props.testSuite.replace(new RegExp("'", 'g'), "\\\'") : 'Test Suite ...';
        const description = this.props.testDescription ? this.props.testDescription.replace(new RegExp("'", 'g'), "\\\'") : 'should ...';
        return getCode(suite, description, events, {basicAuth: this.props.basicAuth});
    }

    render() {
        return (
            <StyledCodeContainer>
                <TextInput id="testSuite" className="testSuite" type="text" label="Test suite name" onChange={this.handleTestSuiteChange} value={this.props.testSuite ? this.props.testSuite : ''} errorMessage="Please enter a name for your test suite"/>
                <TextInput id="testDescription" className="testDescription" type="text" label="Description" onChange={this.handleTestDescriptionChange} value={this.props.testDescription ? this.props.testDescription : ''} errorMessage="Please enter a description for your test"/>
                {
                    this.state.view === 'code' ?
                    <textarea onChange={this.handleChange} value={this.state.cypressCode.join('')} placeholder="Start using the website to record some events" readOnly={false} spellCheck={false}/>
                    : <EventsList events={this.props.events} onRemoveEvent={this.removeEvent}/>
                }
                <ButtonEditorial className="toggle-view" onClick={this.toggleView} title="Toggle between code and event view">{this.state.view === 'code' ? 'Show events' : 'Show code'}</ButtonEditorial>
            </StyledCodeContainer>
        );
    }
}

const StyledCodeContainer = styled.div`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 450px;

    .testSuite, .testDescription {
        width: 100%;
        margin-bottom: 1rem;
    }

    textarea {
        white-space: nowrap;
    }

    ul, textarea {
        flex: 1 1 auto;
        margin-bottom: .5rem;
        word-break: break-all;

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
    }
    ul {
        padding: 0;
        margin: 0;
        list-style-type: none;
        overflow: auto;
        max-height: 290px;
        li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            padding: .5rem 1rem;
        }
    }
    .toggle-view {
        margin-bottom: .5rem;
    }

`;
