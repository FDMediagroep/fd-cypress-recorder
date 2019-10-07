import React from 'react';
import { createGlobalStyle } from 'styled-components';

/**
 * Returns a styled shortcut button.
 */
export default function ShortCut(props: any) {
    return (
        <>
            <GlobalStyle />
            <span className="shortcut-button">{props.children}</span>
        </>
    );
}

const GlobalStyle = createGlobalStyle`
.shortcut-button {
    border-radius: 3px;
    box-shadow: 0 1px 0px rgba(0, 0, 0, 0.2), 0 0 0 2px #fff inset;
    background-color: #f7f7f7;
    border: 1px solid #ccc;
    padding: 0.1em 0.5em;
}
`;
