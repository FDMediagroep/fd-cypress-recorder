import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { TextInput } from '@fdmg/fd-inputs';
import { getCode } from '../utils/Dictionary';
import { AllFdEvents, Header } from '../utils/FdEvents';
import { ButtonEditorial } from '@fdmg/fd-buttons';
import EventsList from './EventsList';
import Headers from './Headers';

export interface Props {
    basicAuth: boolean;
    headers?: Header[];
    testSuite: string;
    testDescription: string;
    events: AllFdEvents[];
    onBasicAuth: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveEvent: (index: number) => void;
    onSuiteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface State {
    cypressCode?: string[];
    view: 'code' | 'events' | 'headers';
}

/**
 * This component can show the recorded events as code or as a list of individual events
 * or show the custom HTTP headers.
 */
export default class CypressGenerator extends PureComponent<Props, State> {
    state: any = {
        view: 'code',
    };

    constructor(props: any) {
        super(props);
        this.state.cypressCode = this.generateCodeFromEvents(this.props.events);
    }

    componentDidUpdate(prevProps: any) {
        if (
            prevProps.testSuite !== this.props.testSuite ||
            prevProps.testDescription !== this.props.testDescription ||
            prevProps.events.length !== this.props.events.length ||
            prevProps.basicAuth !== this.props.basicAuth ||
            JSON.stringify(prevProps.events) !==
                JSON.stringify(this.props.events) ||
            JSON.stringify(prevProps.headers) !==
                JSON.stringify(this.props.headers)
        ) {
            this.setState({
                cypressCode: this.generateCodeFromEvents(this.props.events),
            });
        }
    }

    handleTestSuiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onSuiteChange(e);
    };

    handleTestDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onDescriptionChange(e);
    };

    handleChange = () => {
        console.debug('change');
    };

    showCode = () => {
        this.setState({ view: 'code' });
    };

    showEvents = () => {
        this.setState({ view: 'events' });
    };

    showHeaders = () => {
        this.setState({ view: 'headers' });
    };

    removeEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onRemoveEvent(
            parseInt(e.currentTarget.getAttribute('data-index') || '0', 10)
        );
    };

    generateCodeFromEvents = (events: AllFdEvents[]) => {
        const suite = this.props.testSuite
            ? this.props.testSuite.replace(new RegExp("'", 'g'), "\\'")
            : 'Test Suite ...';
        const description = this.props.testDescription
            ? this.props.testDescription.replace(new RegExp("'", 'g'), "\\'")
            : 'should ...';
        return getCode(suite, description, events, {
            basicAuth: this.props.basicAuth,
            headers: this.props.headers,
        });
    };

    render() {
        return (
            <StyledCodeContainer>
                <TextInput
                    id="testSuite"
                    className="testSuite"
                    type="text"
                    label="Test suite name"
                    onChange={this.handleTestSuiteChange}
                    value={this.props.testSuite ? this.props.testSuite : ''}
                    errorMessage="Please enter a name for your test suite"
                />
                <TextInput
                    id="testDescription"
                    className="testDescription"
                    type="text"
                    label="Description"
                    onChange={this.handleTestDescriptionChange}
                    value={
                        this.props.testDescription
                            ? this.props.testDescription
                            : ''
                    }
                    errorMessage="Please enter a description for your test"
                />
                {this.state.view === 'code' ? (
                    <textarea
                        onChange={this.handleChange}
                        value={this.state.cypressCode.join('')}
                        placeholder="Start using the website to record some events"
                        readOnly={false}
                        spellCheck={false}
                    />
                ) : null}
                {this.state.view === 'events' ? (
                    <EventsList
                        events={this.props.events}
                        onRemoveEvent={this.removeEvent}
                    />
                ) : null}
                {this.state.view === 'headers' ? (
                    <StyledHeadersContainer>
                        <Headers headers={this.props.headers} />
                    </StyledHeadersContainer>
                ) : null}
                <StyledExtraOptions>
                    <ButtonEditorial
                        className={
                            this.state.view === 'code' ? ' selected' : ''
                        }
                        onClick={this.showCode}
                        title="Show code"
                    >
                        Code
                    </ButtonEditorial>
                    <ButtonEditorial
                        className={
                            this.state.view === 'events' ? ' selected' : ''
                        }
                        onClick={this.showEvents}
                        title="Show events"
                    >
                        Events
                    </ButtonEditorial>
                    <ButtonEditorial
                        className={
                            this.state.view === 'headers' ? ' selected' : ''
                        }
                        onClick={this.showHeaders}
                        title="Show headers"
                    >
                        Headers
                    </ButtonEditorial>
                    <label className="basic-auth">
                        <input
                            type="checkbox"
                            onChange={this.props.onBasicAuth}
                            checked={this.props.basicAuth}
                        />{' '}
                        Basic Auth
                    </label>
                </StyledExtraOptions>
            </StyledCodeContainer>
        );
    }
}

const StyledCodeContainer = styled.div`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 450px;

    .testSuite,
    .testDescription {
        width: 100%;
        margin-bottom: 1rem;
    }

    textarea {
        white-space: nowrap;
        border-color: rgba(0, 0, 0, 0.1);
    }

    ul,
    textarea {
        flex: 1 1 auto;
        word-break: break-all;

        ::-webkit-scrollbar {
            width: 0.5rem;
            height: 0.5rem;
        }

        ::-webkit-scrollbar-track {
            -webkit-border-radius: 0.25rem;
            border-radius: 0.25rem;
            background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
            -webkit-border-radius: 0.25rem;
            border-radius: 0.25rem;
            background: rgba(0, 0, 0, 0.2);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.4);
        }

        ::-webkit-scrollbar-thumb:window-inactive {
            background: rgba(0, 0, 0, 0.05);
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
            padding: 0.5rem 1rem;
        }
    }
`;

const StyledExtraOptions = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0.5rem;
    margin-top: -1px;

    .fd-button {
        color: rgba(0, 0, 0, 0.1);
        background: white;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        &.selected {
            color: #191919;
            border-top: 1px solid white;
        }
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        border-left: 1px solid rgba(0, 0, 0, 0.1);
        margin-right: 0.5rem;
        box-shadow: none;
    }

    .basic-auth {
        flex: 0 0 auto;
    }
`;

const StyledHeadersContainer = styled.div`
    flex: 1 1 auto;
    border: 1px solid rgba(0, 0, 0, 0.1);
`;
