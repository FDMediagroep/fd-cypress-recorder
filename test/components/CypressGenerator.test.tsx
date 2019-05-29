import React from 'react';
import TestRenderer from 'react-test-renderer';
import CypressGenerator from '../../src/components/CypressGenerator';
import { FdEventType } from '../../src/utils/FdEvents';

describe('Cypress Generator', () => {
    const onBasicAuth = jest.fn();
    const onSuiteChange = jest.fn();
    const onDescriptionChange = jest.fn();
    const onRemoveEvent = jest.fn();

    it('should render empty test correctly', () => {
        let contextMenu = TestRenderer.create(<CypressGenerator
            basicAuth={false}
            events={[]}
            onBasicAuth={onBasicAuth}
            onSuiteChange={onSuiteChange}
            onDescriptionChange={onDescriptionChange}
            onRemoveEvent={onRemoveEvent}
            testSuite=""
            testDescription=""/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it('should render test with suite name and description correctly', () => {
        let contextMenu = TestRenderer.create(<CypressGenerator
            basicAuth={false}
            events={[]}
            onBasicAuth={onBasicAuth}
            onSuiteChange={onSuiteChange}
            onDescriptionChange={onDescriptionChange}
            onRemoveEvent={onRemoveEvent}
            testSuite="Test suite name"
            testDescription="Test description"/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it('should render events correctly', () => {
        let contextMenu = TestRenderer.create(<CypressGenerator
            basicAuth={false}
            events={[
                {type: FdEventType.VIEWPORT_SIZE, width: 320, height: 240},
                {type: FdEventType.VISIT, href: 'http://willemliu.nl'}
            ]}
            onBasicAuth={onBasicAuth}
            onSuiteChange={onSuiteChange}
            onDescriptionChange={onDescriptionChange}
            onRemoveEvent={onRemoveEvent}
            testSuite=""
            testDescription=""/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

});
