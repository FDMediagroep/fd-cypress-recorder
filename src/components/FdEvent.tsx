import React from "react";
import styled from "styled-components";

interface Props {
    event: any;
}

export default function FdEvent(props: Props) {
    return (
        <StyledEvent>
            <span className="event-type">{props.event.type} </span>
            {props.event.value ? <span className="event-value">{props.event.value} </span> : null}
            {props.event.href ? <span className="event-href">{props.event.href} </span> : null}
            {props.event.width ? <span className="event-width">w:{props.event.width} </span> : null}
            {props.event.height ? <span className="event-height">h:{props.event.height} </span> : null}
            {props.event.target ? <span className="event-target">h:{props.event.target} </span> : null}
        </StyledEvent>
    );
}

const StyledEvent = styled.span`
    display: flex;
    flex-wrap: wrap;

    span {
        margin-right: .5rem;
    }

    .event-type {
        font-weight: bold;
    }

    .event-target {
        flex: 1 1 100%;
        font-style: italic;
        color: #677381;
    }
`;
