import React from 'react';
import TestRenderer from 'react-test-renderer';
import FdEvent from '../../src/components/FdEvent';
import { FdEventType } from '../../src/utils/FdEvents';

describe('Fd Event', () => {
    it('should render event type correctly', () => {
        let contextMenu = TestRenderer.create(<FdEvent event={{type: FdEventType.CLICK, target: 'document.body'}}/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it('should render event type with value correctly', () => {
        let contextMenu = TestRenderer.create(<FdEvent event={{type: FdEventType.CONTAINS_TEXT, target: 'document.body', value: 'contains this text'}}/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

});
