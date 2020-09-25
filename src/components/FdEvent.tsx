import React from 'react';
import styles from './FdEvent.module.scss';

interface Props {
    event: any;
}

export default function FdEvent(props: Props) {
    return (
        <span className={styles.fdEvent}>
            <span className={styles.eventType}>{props.event.type} </span>
            {props.event.value ? (
                <span className="event-value">{props.event.value} </span>
            ) : null}
            {props.event.href ? (
                <span className="event-href">{props.event.href} </span>
            ) : null}
            {props.event.width ? (
                <span className="event-width">w:{props.event.width} </span>
            ) : null}
            {props.event.height ? (
                <span className="event-height">h:{props.event.height} </span>
            ) : null}
            {props.event.target ? (
                <span className={styles.eventTarget}>
                    h:{props.event.target}{' '}
                </span>
            ) : null}
        </span>
    );
}
