import React from 'react';
import TestRenderer from 'react-test-renderer';
import Headers from '../../src/components/Headers';

describe('Headers', () => {
    it('should render correctly', () => {
        let headers = TestRenderer.create(<Headers headers={[]} />);
        expect(headers.toJSON()).toMatchSnapshot();
    });
});
