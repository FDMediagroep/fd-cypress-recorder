import React from "react";
import styled from "styled-components";

interface Props {
    event: any;
}

export default function FdEvent(props: Props) {
    return (
        <StyledEvent>
            <span className="event-type">{props.event.type}</span>
            {props.event.value ? <span className="event-value">{props.event.value}</span> : null}
        </StyledEvent>
    );
}

const StyledEvent = styled.span`
    .event-type {
        font-weight: bold;
    }
`;
