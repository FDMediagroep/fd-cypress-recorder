import React, { useCallback, useEffect, useState } from 'react';
import { getCode } from '../utils/Dictionary';
import { AllFdEvents, Header } from '../utils/FdEvents';
import { TextInput } from '@fdmg/design-system/components/input/TextInput';
import { TextArea } from '@fdmg/design-system/components/input/TextArea';
import { Checkbox } from '@fdmg/design-system/components/input/Checkbox';
import { Radio } from '@fdmg/design-system/components/input/Radio';
import EventsList from './EventsList';
import Headers from './Headers';
import styles from './CypressGenerator.module.scss';

export interface Props {
    basicAuth: boolean;
    headers?: Header[];
    testSuite?: string;
    testDescription?: string;
    events: AllFdEvents[];
    onBasicAuth: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveEvent: (index: number) => void;
    onSuiteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * This component can show the recorded events as code or as a list of individual events
 * or show the custom HTTP headers.
 */
// export default class CypressGenerator extends PureComponent<Props, State> {
export default function CypressGenerator(props: Props) {
    const generateCodeFromEvents = useCallback(
        (events: AllFdEvents[]) => {
            const suite = props.testSuite
                ? props.testSuite.replace(new RegExp("'", 'g'), "\\'")
                : 'Test Suite ...';
            const description = props.testDescription
                ? props.testDescription.replace(new RegExp("'", 'g'), "\\'")
                : 'should ...';
            return getCode(suite, description, events, {
                basicAuth: props.basicAuth,
                headers: props.headers,
            });
        },
        [props.testSuite, props.testDescription, props.basicAuth, props.headers]
    );

    const [cypressCode, setCypressCode] = useState(
        generateCodeFromEvents(props.events)
    );
    const [view, setView] = useState<'code' | 'events' | 'headers'>('code');
    const [testSuite, setTestSuite] = useState(props.testSuite);
    const [testDescription, setTestDescription] = useState(
        props.testDescription
    );

    useEffect(() => {
        setTestSuite(props.testSuite);
    }, [props.testSuite]);
    useEffect(() => {
        setTestDescription(props.testDescription);
    }, [props.testDescription]);

    useEffect(() => {
        setCypressCode(generateCodeFromEvents(props.events));
    }, [
        props.testSuite,
        props.testDescription,
        props.events,
        props.events.length,
        props.headers,
        props?.headers?.length,
        props.basicAuth,
    ]);

    const handleTestSuiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTestSuite(e.currentTarget.value);
        props.onSuiteChange(e);
    };

    const handleTestDescriptionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTestDescription(e.currentTarget.value);
        props.onDescriptionChange(e);
    };

    const handleChange = () => {
        console.debug('change');
    };

    const showCode = () => {
        setView('code');
    };

    const showEvents = () => {
        setView('events');
    };

    const showHeaders = () => {
        setView('headers');
    };

    const removeEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        props.onRemoveEvent(
            parseInt(e.currentTarget.getAttribute('data-index') || '0', 10)
        );
    };

    return (
        <div className={styles.cypressGenerator}>
            <TextInput
                id="testSuite"
                className={styles.testSuite}
                type="text"
                label="Test suite name"
                onChange={handleTestSuiteChange}
                defaultValue={props.testSuite}
                value={testSuite}
                errorMessage="Please enter a name for your test suite"
            />
            <TextInput
                id="testDescription"
                className={styles.testDescription}
                type="text"
                label="Description"
                onChange={handleTestDescriptionChange}
                defaultValue={props.testDescription}
                value={testDescription}
                errorMessage="Please enter a description for your test"
            />

            <div className={styles.extraOptions}>
                <Radio
                    id="code"
                    name="views"
                    onClick={showCode}
                    label="Code"
                    title="Show code"
                    value="code"
                    defaultChecked={true}
                />
                <Radio
                    id="events"
                    name="views"
                    onClick={showEvents}
                    label="Events"
                    title="Show events"
                    value="events"
                />
                <Radio
                    id="headers"
                    name="views"
                    onClick={showHeaders}
                    label="Headers"
                    title="Show headers"
                    value="headers"
                />
                <Checkbox
                    id="basicAuth"
                    label="Basic Auth"
                    checked={props.basicAuth}
                    value="basic-auth"
                    onChange={props.onBasicAuth}
                />
            </div>

            {view === 'code' ? (
                <TextArea
                    id="codeArea"
                    className={styles.textArea}
                    onChange={handleChange}
                    value={cypressCode.join('')}
                    placeholder="Start using the website to record some events"
                    readOnly={true}
                    spellCheck={false}
                />
            ) : null}
            {view === 'events' ? (
                <EventsList events={props.events} onRemoveEvent={removeEvent} />
            ) : null}
            {view === 'headers' ? (
                <div className={styles.headerContainer}>
                    <Headers headers={props.headers} />
                </div>
            ) : null}
        </div>
    );
}
