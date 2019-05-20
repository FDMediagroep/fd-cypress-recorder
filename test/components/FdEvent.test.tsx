import React from 'react';
import TestRenderer from 'react-test-renderer';
import FdEvent from '../../src/components/FdEvent';
import { FdEventType } from '../../src/utils/CypressDictionary';

describe('Fd Event', () => {
    it('should render event type correctly', () => {
        let contextMenu = TestRenderer.create(<FdEvent event={FdEventType.CLICK}/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it('should render event type with value correctly', () => {
        let contextMenu = TestRenderer.create(<FdEvent event={FdEventType.CONTAINS_TEXT} value='Test text'/>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

});
