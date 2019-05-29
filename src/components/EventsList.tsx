import { AllFdEvents } from "../utils/FdEvents";
import React from "react";
import { ButtonEditorial } from "@fdmg/fd-buttons";
import FdEvent from "./FdEvent";
import { DragDropContext, ResponderProvided, DropResult, Droppable, Draggable } from 'react-beautiful-dnd';
import EventsStore = require("../stores/EventsStore");
import styled from "styled-components";

declare var chrome: any;

export interface Props {
    events: AllFdEvents[];
    onRemoveEvent: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function EventsList(props: Props) {
    function handleDragEnd(result: DropResult, provided: ResponderProvided) {
        if (!result.destination) { return; }

        let events = [...props.events];
        const reorder = (list: AllFdEvents[], startIndex: number, endIndex: number) => {
            const arrayList = Array.from(list);
            const [removed] = arrayList.splice(startIndex, 1);
            arrayList.splice(endIndex, 0, removed);
            return arrayList;
        };
        events = reorder(events, result.source.index, result.destination.index);
        EventsStore.addFuture([...EventsStore.getEvents()]);
        EventsStore.setEvents(events);
        chrome.storage.local.set({'fd-cypress-chrome-extension-events': events});
    }

    return (
        <>
            {props.events.length ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="events">
                        {(provided, snapshot) => (
                            <StyledUl {...provided.droppableProps} ref={provided.innerRef} {...provided.droppableProps}>
                                {props.events.map((event: AllFdEvents, idx: number) => (
                                    <Draggable key={idx} draggableId={`${(event as any).id}`} index={idx}>
                                        {(dragProvided, dragSnapshot) => (
                                            <li ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}>
                                                <FdEvent event={event}/><ButtonEditorial className="toggle-view" data-index={idx} onClick={props.onRemoveEvent} title="Delete event">x</ButtonEditorial>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </StyledUl>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <StyledNoEvents>Start record and interact with a website to record some events</StyledNoEvents>
            )}
        </>
    );
}

const StyledUl = styled.ul`
    flex: 1 1 auto;
    border: 1px solid rgba(0, 0, 0, 0.1);
`;

const StyledNoEvents = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 auto;
    border: 1px solid rgba(0, 0, 0, 0.1);
`;
