import React from 'react';
import { AllFdEvents, FdEventType } from '../utils/FdEvents';
import styles from './ContextULCheckAttribute.module.scss';

export interface Props {
    target: HTMLElement;
    selector: string;
    onBack?: () => void;
    onMouseDown: (event: AllFdEvents) => void;
}

export default function ContextULCheckAttribute(props: Props) {
    function handleAttributeValueEquals(e: React.MouseEvent<HTMLElement>) {
        props.onMouseDown({
            type: FdEventType.ATTRIBUTE_VALUE_EQUALS,
            target: props.selector,
            name: e.currentTarget.getAttribute('data-name') as string,
            value: e.currentTarget.getAttribute('data-value') as string,
        });
    }

    function handleAttributeValueContains(e: React.MouseEvent<HTMLElement>) {
        const value = prompt('Attribute value contains');
        if (value) {
            props.onMouseDown({
                type: FdEventType.ATTRIBUTE_VALUE_CONTAINS,
                target: props.selector,
                name: e.currentTarget.getAttribute('data-name') as string,
                value,
            });
        }
    }

    function handleAttributeExists(e: React.MouseEvent<HTMLElement>) {
        props.onMouseDown({
            type: FdEventType.ATTRIBUTE_VALUE_EXISTS,
            target: props.selector,
            name: e.currentTarget.getAttribute('data-name') as string,
        });
    }

    function handleBack(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        if (props.onBack) {
            props.onBack();
        }
    }

    return (
        <ul className={styles.attribute}>
            {(props.target as HTMLElement).attributes.length === 0 ? (
                <li className={styles.clickable} onMouseDown={handleBack}>
                    <h2>&lt; No attributes found</h2>
                </li>
            ) : (
                <li className={styles.clickable} onMouseDown={handleBack}>
                    <h2>&lt; Attributes</h2>
                </li>
            )}
            {[].slice
                .call((props.target as HTMLElement).attributes)
                .map((attribute: any) => {
                    if (typeof attribute === 'object') {
                        return (
                            <React.Fragment key={attribute.name}>
                                <li className="separator">
                                    <b>{attribute.name}</b>
                                </li>
                                <li
                                    className={styles.clickable}
                                    data-name={attribute.name}
                                    data-value={attribute.value}
                                    onMouseDown={handleAttributeValueContains}
                                >
                                    Contains...
                                </li>
                                <li
                                    className={styles.clickable}
                                    data-name={attribute.name}
                                    data-value={attribute.value}
                                    onMouseDown={handleAttributeValueEquals}
                                >
                                    <div className={styles.equals}>
                                        Equals <small>{attribute.value}</small>
                                    </div>
                                </li>
                                <li
                                    className={styles.clickable}
                                    data-name={attribute.name}
                                    data-value={attribute.value}
                                    onMouseDown={handleAttributeExists}
                                >
                                    Exists
                                </li>
                            </React.Fragment>
                        );
                    }
                    return null;
                })}
        </ul>
    );
}
