import { AllFdEvents } from '../utils/FdEvents';
import React, { useCallback } from 'react';
import { ButtonGhost } from '@fdmg/design-system/components/button/ButtonGhost';
import FdEvent from './FdEvent';
import {
    DragDropContext,
    DropResult,
    Droppable,
    Draggable,
} from 'react-beautiful-dnd';
import EventsStore = require('../stores/EventsStore');
import styles from './EventsList.module.scss';

declare let chrome: any;
declare let browser: any;

let storage: any;

if (typeof browser !== 'undefined') {
    storage = browser?.storage || undefined;
} else if (typeof chrome !== 'undefined') {
    storage = chrome?.storage || undefined;
}

export interface Props {
    events: AllFdEvents[];
    onRemoveEvent: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Layout of the Events tab in the Chrome Plugin UI
 * @param props
 */
export default function EventsList(props: Props) {
    const handleDragEnd = useCallback(
        (result: DropResult) => {
            if (!result.destination) {
                return;
            }

            let events = [...props.events];
            const reorder = (
                list: AllFdEvents[],
                startIndex: number,
                endIndex: number
            ) => {
                const arrayList = Array.from(list);
                const [removed] = arrayList.splice(startIndex, 1);
                arrayList.splice(endIndex, 0, removed);
                return arrayList;
            };
            events = reorder(
                events,
                result.source.index,
                result.destination.index
            );
            EventsStore.addFuture([...EventsStore.getEvents()]);
            EventsStore.setEvents(events);
            storage.local.set({
                'fd-cypress-chrome-extension-events': events,
            });
        },
        [props.events]
    );

    console.log(props.events);

    return (
        <>
            {props.events.length ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="events">
                        {(provided) => (
                            <ul
                                className={styles.ul}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {props.events.map(
                                    (event: AllFdEvents, idx: number) => (
                                        <Draggable
                                            key={idx}
                                            draggableId={`${(event as any).id}`}
                                            index={idx}
                                        >
                                            {(dragProvided) => (
                                                <li
                                                    ref={dragProvided.innerRef}
                                                    {...dragProvided.draggableProps}
                                                    {...dragProvided.dragHandleProps}
                                                >
                                                    <FdEvent event={event} />
                                                    <ButtonGhost
                                                        className="toggle-view"
                                                        data-index={idx}
                                                        onClick={
                                                            props.onRemoveEvent
                                                        }
                                                        title="Delete event"
                                                    >
                                                        x
                                                    </ButtonGhost>
                                                </li>
                                            )}
                                        </Draggable>
                                    )
                                )}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <div className={styles.noEvents}>
                    Start record and interact with a website to record some
                    events
                </div>
            )}
        </>
    );
}
