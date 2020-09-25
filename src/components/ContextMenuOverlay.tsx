import { PureComponent } from 'react';
import React from 'react';
import ContextMenu from './ContextMenu';
import styles from './ContextMenuOverlay.module.scss';

export interface Props {
    target: HTMLElement;
    selector: string;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

/**
 * This component renders the overlay for the context menu and also contains the context menu.
 */
export default class ContextMenuOverlay extends PureComponent<Props, any> {
    render() {
        return (
            <div className={styles.contextOverlay} onClick={this.props.onClick}>
                <div
                    className={styles.contextOverlayFixed}
                    onClick={this.props.onClick}
                />
                <div
                    className={styles.contextContainer}
                    style={{
                        top: `${
                            document.documentElement.scrollTop +
                            this.props.target.getBoundingClientRect().top
                        }px`,
                        width: `${
                            this.props.target.getBoundingClientRect().width
                        }px`,
                        height: `${
                            this.props.target.getBoundingClientRect().height
                        }px`,
                        left: `${
                            document.documentElement.scrollLeft +
                            this.props.target.getBoundingClientRect().left
                        }px`,
                    }}
                />
                <ContextMenu
                    target={this.props.target}
                    selector={this.props.selector}
                />
            </div>
        );
    }
}
