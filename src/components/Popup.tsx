import React, { useEffect, useState } from 'react';
import CypressGenerator from './CypressGenerator';
import EventsStore = require('../stores/EventsStore');
import { Button } from '@fdmg/design-system/components/button/Button';
import { ButtonCta } from '@fdmg/design-system/components/button/ButtonCta';
import { ButtonGhost } from '@fdmg/design-system/components/button/ButtonGhost';
import { Template } from '../utils/FdEvents';
import TemplatesStore = require('../stores/TemplatesStore');
import TestSuiteStore = require('../stores/TestSuiteStore');
import ShortCut from './ShortCut';
import HeadersStore = require('../stores/HeadersStore');
import styles from './Popup.module.scss';
import { ReSubstitute } from '../utils/ReSubstitute';

export interface Props {
    onTestSuiteChange: (testSuiteName: string | null) => void;
    onTestDescriptionChange: (testDescription: string | null) => void;
    onRecordingChange: (recording: boolean) => void;
    onRemoveTemplate: (templateName: string | null) => void;
    onRemoveEvent: (index: number) => void;
    onRedo: () => void;
    onUndo: () => void;
    onClear: () => void;
    onSaveTemplate: () => void;
    onLoadTemplate: (templateName: string | null) => void;
    onLoadAppendTemplate: (templateName: string | null) => void;
    onBasicAuthChange: (basicAuth: boolean) => void;
    [x: string]: any;
}

/**
 * This is the Chrome plugin popup window.
 */
export default function Popup(props: Props) {
    const [events, setEvents] = useState(EventsStore.getEvents());
    const [recording, setRecording] = useState(TestSuiteStore.getRecording());
    const [futures, setFutures] = useState(EventsStore.getFutures());
    const [headers, setHeaders] = useState(HeadersStore.getHeaders());
    const [undoneEvents, setUndoneEvents] = useState(
        EventsStore.getUndoneEvents()
    );
    const [templates, setTemplates] = useState(TemplatesStore.getTemplates());
    const [testSuite, setTestSuite] = useState(TestSuiteStore.getTestSuite());
    const [testDescription, setTestDescription] = useState(
        TestSuiteStore.getTestDescription()
    );
    const [basicAuth, setBasicAuth] = useState(TestSuiteStore.getBasicAuth());

    useEffect(() => {
        const evts = EventsStore.getEvents();
        evts.forEach((event: any, idx: number) => {
            event.id = idx;
        });
        const eventId = EventsStore.subscribe(() => {
            const evts = EventsStore.getEvents();
            evts.forEach((event: any, idx: number) => {
                event.id = idx;
            });
            setEvents(evts);
            setFutures(EventsStore.getFutures());
            setUndoneEvents(EventsStore.getUndoneEvents());
        }, ReSubstitute.Key_All);

        const testSuiteId = TestSuiteStore.subscribe(() => {
            setTestSuite(TestSuiteStore.getTestSuite());
            setTestDescription(TestSuiteStore.getTestDescription());
            setRecording(TestSuiteStore.getRecording());
            setBasicAuth(TestSuiteStore.getBasicAuth());
        }, ReSubstitute.Key_All);

        const headerId = HeadersStore.subscribe(() => {
            setHeaders(HeadersStore.getHeaders());
        }, ReSubstitute.Key_All);

        const templateId = TemplatesStore.subscribe(() => {
            setTemplates(TemplatesStore.getTemplates());
        }, ReSubstitute.Key_All);

        return () => {
            EventsStore.unsubscribe(eventId);
            TestSuiteStore.unsubscribe(testSuiteId);
            HeadersStore.unsubscribe(headerId);
            TemplatesStore.unsubscribe(templateId);
        };
    }, []);

    const handleSuiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onTestSuiteChange(e.currentTarget.value);
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        props.onTestDescriptionChange(e.currentTarget.value);
    };

    const handleRemoveEvent = (index: number) => {
        props.onRemoveEvent(index);
    };

    const toggleRecord = () => {
        props.onRecordingChange(!recording);
    };

    const undo = () => {
        props.onUndo();
    };

    const redo = () => {
        props.onRedo();
    };

    const clear = () => {
        props.onClear();
    };

    const saveAsTemplate = () => {
        props.onSaveTemplate();
    };

    const loadTemplate = (e: React.MouseEvent<HTMLElement>) => {
        props.onLoadTemplate(e.currentTarget.getAttribute('data-value'));
    };

    const removeTemplate = (e: React.MouseEvent<HTMLElement>) => {
        props.onRemoveTemplate(e.currentTarget.getAttribute('data-value'));
    };

    const loadAppendTemplate = (e: React.MouseEvent<HTMLElement>) => {
        props.onLoadAppendTemplate(e.currentTarget.getAttribute('data-value'));
    };

    const handleBasicAuth = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onBasicAuthChange(e.currentTarget.checked);
    };

    return (
        <div
            className={`${styles.popup}${
                props.className ? ` ${props.className}` : ''
            }`}
        >
            <h1>
                <span>FD Cypress Recorder</span>
                <span className={styles['button-container']}>
                    {recording ? (
                        <ButtonCta
                            onClick={toggleRecord}
                            title="Stop recording"
                        >
                            Stop
                        </ButtonCta>
                    ) : (
                        <Button
                            onClick={toggleRecord}
                            title="Record interactions"
                        >
                            Record
                        </Button>
                    )}
                    {events.length || (futures.length && futures[0].length) ? (
                        <span>
                            <ButtonGhost
                                onClick={undo}
                                title="Remove last interaction"
                                {...{ disabled: !events.length }}
                            >
                                <i
                                    className={`${styles['arrow']} ${styles['left']}`}
                                />
                            </ButtonGhost>
                            <ButtonGhost
                                onClick={redo}
                                title="Redo"
                                {...{
                                    disabled: !(
                                        futures.length && futures[0].length
                                    ),
                                }}
                            >
                                <i
                                    className={`${styles['arrow']} ${styles['right']}`}
                                />
                            </ButtonGhost>
                        </span>
                    ) : null}
                    <ButtonGhost onClick={clear} title="Clear current session">
                        Clear
                    </ButtonGhost>
                </span>
            </h1>
            <div className={styles.popupLayout}>
                <div className={styles.templatesContainer}>
                    <h3>
                        Templates{' '}
                        <ButtonCta
                            onClick={saveAsTemplate}
                            title="Save as template"
                        >
                            +
                        </ButtonCta>
                    </h3>
                    <ul>
                        {templates.map((template: Template) =>
                            template.name ? (
                                <li key={template.name}>
                                    <span
                                        onClick={loadTemplate}
                                        data-value={template.name}
                                    >
                                        {template.name}
                                    </span>
                                    <span>
                                        <ButtonGhost
                                            data-value={template.name}
                                            onClick={loadAppendTemplate}
                                            title="Append template"
                                        >
                                            +
                                        </ButtonGhost>
                                        <ButtonGhost
                                            data-value={template.name}
                                            onClick={removeTemplate}
                                            title="Delete template"
                                        >
                                            X
                                        </ButtonGhost>
                                    </span>
                                </li>
                            ) : null
                        )}
                    </ul>
                </div>
                <div className={styles.codeContainer}>
                    <CypressGenerator
                        basicAuth={basicAuth}
                        headers={headers}
                        events={events}
                        onSuiteChange={handleSuiteChange}
                        testSuite={testSuite}
                        onDescriptionChange={handleDescriptionChange}
                        testDescription={testDescription}
                        onRemoveEvent={handleRemoveEvent}
                        onBasicAuth={handleBasicAuth}
                    />
                    <small>
                        <ShortCut>CTRL</ShortCut> +{' '}
                        <ShortCut>Right Mouse Click</ShortCut>: open context
                        menu for hovered element in page. Tip: make sure the
                        page has focus and recording has started.
                    </small>
                    <small>
                        <ShortCut>CTRL</ShortCut> +{' '}
                        <ShortCut>Scroll Lock</ShortCut> or{' '}
                        <ShortCut>ALT</ShortCut> + <ShortCut>r</ShortCut>:
                        Toggle recording Tip: make sure the page has focus.
                    </small>
                </div>
            </div>
        </div>
    );
}
