import { PureComponent } from "react";
import React from "react";
import styled from "styled-components";
import ContextMenu from "./ContextMenu";

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
            <StyledContextOverlay onClick={this.props.onClick}>
                <StyledContextContainer
                    top={document.documentElement.scrollTop + this.props.target.getBoundingClientRect().top}
                    width={this.props.target.getBoundingClientRect().width}
                    height={this.props.target.getBoundingClientRect().height}
                    left={document.documentElement.scrollLeft + this.props.target.getBoundingClientRect().left}
                />
                <ContextMenu target={this.props.target} selector={this.props.selector}/>
            </StyledContextOverlay>
        );
    }
}

const StyledContextContainer: any = styled.div`
    position: absolute;
    box-shadow: 0 0 0 1000px rgba(0,0,0,.5);
    /* for real browsers */
    box-shadow: 0 0 0 100vmax rgba(0,0,0,.5);
    top: ${(props: any) => props.top}px;
    width: ${(props: any) => props.width}px;
    height: ${(props: any) => props.height}px;
    left: ${(props: any) => props.left}px;
`;

const StyledContextOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
`;
