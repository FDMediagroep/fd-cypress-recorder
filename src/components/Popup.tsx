import React from 'react';
import CypressGenerator from './CypressGenerator';
import EventsStore = require('../stores/EventsStore');
import { createGlobalStyle } from 'styled-components';
import {ButtonCallToAction, ButtonEditorial} from '@fdmg/fd-buttons';
import { AllFdEvents, Template } from "../utils/FdEvents";
import { ComponentBase } from 'resub';
import TemplatesStore = require('../stores/TemplatesStore');
import TestSuiteStore = require('../stores/TestSuiteStore');
import ShortCut from './ShortCut';

interface PopupState {
    events: AllFdEvents[];
    futures: [AllFdEvents[]];
    undoneEvents: AllFdEvents[];
    templates: Template[];
    testSuite?: string;
    testDescription?: string;
    recording: boolean;
    basicAuth: boolean;
}

/**
 * This is the Chrome plugin popup window.
 */
export interface Props extends React.Props<any> {
    onTestSuiteChange: (testSuiteName: string|null) => void;
    onTestDescriptionChange: (testDescription: string|null) => void;
    onRecordingChange: (recording: boolean) => void;
    onRemoveTemplate: (templateName: string|null) => void;
    onRemoveEvent: (index: number) => void;
    onRedo: () => void;
    onUndo: () => void;
    onClear: () => void;
    onSaveTemplate: () => void;
    onLoadTemplate: (templateName: string|null) => void;
    onLoadAppendTemplate: (templateName: string|null) => void;
    onBasicAuthChange: (basicAuth: boolean) => void;
}

export default class Popup extends ComponentBase<Props, PopupState> {
    state: any = {
    };

    handleSuiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onTestSuiteChange(e.currentTarget.value);
    }

    handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onTestDescriptionChange(e.currentTarget.value);
    }

    handleRemoveEvent = (index: number) => {
        this.props.onRemoveEvent(index);
    }

    toggleRecord = () => {
        this.props.onRecordingChange(!this.state.recording);
    }

    undo = () => {
        this.props.onUndo();
    }

    redo = () => {
        this.props.onRedo();
    }

    clear = () => {
        this.props.onClear();
    }

    saveAsTemplate = () => {
        this.props.onSaveTemplate();
    }

    loadTemplate = (e: React.MouseEvent<HTMLElement>) => {
        this.props.onLoadTemplate(e.currentTarget.getAttribute('data-value'));
    }

    removeTemplate = (e: React.MouseEvent<HTMLElement>) => {
        this.props.onRemoveTemplate(e.currentTarget.getAttribute('data-value'));
    }

    loadAppendTemplate = (e: React.MouseEvent<HTMLElement>) => {
        this.props.onLoadAppendTemplate(e.currentTarget.getAttribute('data-value'));
    }

    handleBasicAuth = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onBasicAuthChange(e.currentTarget.checked);
    }

    render() {
        return (
            <>
                <GlobalStyle/>
                <h1>
                    <span>FD Cypress Recorder</span>
                    <span className="button-container">
                        {this.state.recording ? <ButtonCallToAction onClick={this.toggleRecord} title="Stop recording">Stop</ButtonCallToAction> : <ButtonEditorial onClick={this.toggleRecord} title="Record interactions">Record</ButtonEditorial>}
                        {this.state.events.length || (this.state.futures.length && this.state.futures[0].length) ? (
                            <span>
                                <ButtonEditorial onClick={this.undo} title="Remove last interaction" {...{disabled: !this.state.events.length}}><i className="arrow left"/></ButtonEditorial>
                                <ButtonEditorial onClick={this.redo} title="Redo" {...{disabled: !(this.state.futures.length && this.state.futures[0].length)}}><i className="arrow right"/></ButtonEditorial>
                            </span>)
                            : null
                        }
                        <ButtonEditorial onClick={this.clear} title="Clear current session">Clear</ButtonEditorial>
                    </span>
                </h1>
                <div className="fd-cypress-popup-layout">
                    <div className="fd-cypress-templates-container">
                        <h3>Templates <ButtonCallToAction onClick={this.saveAsTemplate} title="Save as template">+</ButtonCallToAction></h3>
                        <ul>
                            {this.state.templates.map((template: Template) => template.name ? <li key={template.name}><span onClick={this.loadTemplate} data-value={template.name}>{template.name}</span><span><ButtonEditorial  data-value={template.name} onClick={this.loadAppendTemplate} title="Append template">+</ButtonEditorial><ButtonEditorial  data-value={template.name} onClick={this.removeTemplate} title="Delete template">X</ButtonEditorial></span></li> : null)}
                        </ul>
                        <div>
                            <label><input type="checkbox" onChange={this.handleBasicAuth} checked={this.state.basicAuth}/> Basic Auth</label>
                        </div>
                    </div>
                    <div className="fd-cypress-code-container">
                        <CypressGenerator
                            basicAuth={this.state.basicAuth}
                            events={this.state.events}
                            onSuiteChange={this.handleSuiteChange}
                            testSuite={this.state.testSuite}
                            onDescriptionChange={this.handleDescriptionChange}
                            testDescription={this.state.testDescription}
                            onRemoveEvent={this.handleRemoveEvent}
                        />
                        <small><ShortCut>CTRL</ShortCut> + <ShortCut className="shortcut-button">Print Screen</ShortCut> or <ShortCut>ALT</ShortCut> + <ShortCut className="shortcut-button">c</ShortCut>: open context menu for hovered element in page. Tip: make sure the page has focus and recording has started.</small>
                        <small><ShortCut>CTRL</ShortCut> + <ShortCut className="shortcut-button">Scroll Lock</ShortCut> or <ShortCut>ALT</ShortCut> + <ShortCut className="shortcut-button">r</ShortCut>: Toggle recording state. Tip: make sure the page has focus.</small>
                    </div>
                </div>
            </>
        );
    }

    protected _buildState(props: any, initialBuild: boolean): PopupState {
        const events = EventsStore.getEvents();
        events.forEach((event: any, idx: number) => {
            event.id = idx;
        });
        return {
            events,
            futures: EventsStore.getFutures(),
            undoneEvents: EventsStore.getUndoneEvents(),
            templates: TemplatesStore.getTemplates(),
            testSuite: TestSuiteStore.getTestSuite(),
            testDescription: TestSuiteStore.getTestDescription(),
            recording: TestSuiteStore.getRecording(),
            basicAuth: TestSuiteStore.getBasicAuth()
        };
    }
}

const GlobalStyle = createGlobalStyle`
#popup {
    h1 {
        font-size: 1.2rem;
        display: flex;
        justify-content: space-between;
        > span:first-of-type {
            flex: 0 1 200px;
            margin-right: 2rem;
        }
        .button-container {
            display: flex;
            justify-content: space-between;
            flex: 1 1 auto;
            span {
                display: inline-flex;
            }

            [disabled] {
                opacity: 0.3;
            }

            .arrow {
                border: solid white;
                border-width: 0 3px 3px 0;
                display: inline-block;
                padding: 3px;

                &.left {
                    transform: rotate(135deg);
                }
                &.right {
                    transform: rotate(-45deg);
                }
            }
        }
    }

    .fd-cypress-popup-layout {
        display: flex;
        .fd-cypress-templates-container {
            flex: 0 1 auto;
            min-width: 200px;
            border-right: 1px solid rgba(0, 0, 0, 0.1);
            box-sizing: content-box;
            padding-right: 1rem;
            margin-right: 1rem;
            height: 500px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            h3 {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem;
            }
            ul {
                padding: 0;
                margin: 0;
                overflow: auto;
                flex: 1 1 auto;
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

                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    &:first-of-type {
                        border-top: 1px solid rgba(0, 0, 0, 0.1);
                    }
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                    padding: 0.5rem;
                    span {
                        cursor: pointer;
                    }
                    span + span {
                        display: flex;
                    }
                }
            }
            label {
                user-select: none;
            }
        }
        .fd-cypress-code-container {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            small {
                display: block;
                margin-bottom: .5rem;
            }
        }
    }
}
`;
