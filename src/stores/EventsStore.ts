import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import { AllFdEvents } from '../utils/FdEvents';

@AutoSubscribeStore
class EventsStore extends StoreBase {
    private events: AllFdEvents[] = [];
    private undoneEvents: AllFdEvents[] = [];
    private futures: any = [];

    stepBack() {
        const currentEvents = [...this.events];
        if (currentEvents.length) {
            currentEvents.pop();
            this.events = currentEvents;
            this.trigger('stepBack');
        }
    }

    addFuture(events: AllFdEvents[]) {
        this.futures = [...this.futures, events];
    }

    popFuture() {
        let future;
        const futures = [...this.futures];
        if (futures.length) {
            future = futures.pop();
        }
        this.futures = futures;
        return future;
    }

    clearUndone() {
        this.undoneEvents = [];
    }

    addEvent(event: AllFdEvents) {
        this.clearUndone();
        this.events = this.events.concat(event);
        this.trigger('addEvent');
    }

    /**
     * Add event if it does not already exist.
     */
    addUniqueEvent(event: AllFdEvents) {
        const foundEvent = this.events.filter((ev) => ev.type === event.type);
        if (foundEvent.length === 0) {
            this.clearUndone();
            this.events = [...this.events, event];
        }
        this.trigger('addUniqueEvent');
    }

    /**
     * Add event if not already exists. Otherwise override existing.
     */
    setEvent(event: AllFdEvents) {
        const foundEvent = this.events.filter((ev) => ev.type === event.type);
        this.clearUndone();
        if (foundEvent.length === 0) {
            this.events = this.events.concat(event);
        } else {
            const copy = [...this.events];
            copy.forEach((ev, idx) => {
                if (ev.type === event.type) {
                    copy[idx] = event;
                }
            });
            this.events = copy;
        }
        this.trigger('setEvent');
    }

    setEvents(
        events: AllFdEvents[],
        triggerKey?: string | number | string[] | number[]
    ) {
        if (this.events && events && this.events.length !== events.length) {
            this.clearUndone();
        }
        this.events = events || [];
        this.trigger(triggerKey ? triggerKey : 'setEvents');
    }

    clear() {
        this.clearUndone();
        this.events = [];
        this.trigger('clear');
    }

    @autoSubscribe
    getEvents() {
        return this.events;
    }

    @autoSubscribe
    getUndoneEvents() {
        return this.undoneEvents;
    }

    @autoSubscribe
    getFutures() {
        return this.futures;
    }
}

export = new EventsStore();
