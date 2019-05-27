import React from 'react';
import TestRenderer from 'react-test-renderer';
import { FdEventType } from '../../src/utils/FdEvents';
import ShortCut from '../../src/components/ShortCut';

describe('Shortcut', () => {
    it('should render shortcut correctly', () => {
        let contextMenu = TestRenderer.create(<ShortCut>CTRL</ShortCut>);
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });
});
