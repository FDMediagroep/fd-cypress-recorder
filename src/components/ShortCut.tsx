import React from 'react';
import styles from './ShortCut.module.scss';
import { ButtonGhost } from '@fdmg/design-system/components/button/ButtonGhost';

/**
 * Returns a styled keyboard shortcut button.
 */
export default function ShortCut(props: any) {
    return (
        <ButtonGhost
            className={`${styles['shortcut-button']}${
                props.className ? ` ${props.className}` : ''
            }`}
        >
            {props.children}
        </ButtonGhost>
    );
}
