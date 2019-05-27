import { FdEventType, FdVisitEvent } from "../../src/utils/FdEvents";
import EventsStore = require("../../src/stores/EventsStore");

describe('Events Store', () => {
    const events = [
        {type: FdEventType.VIEWPORT_SIZE, width: 320, height: 240},
        {type: FdEventType.VISIT, href: 'http://willemliu.nl'}
    ];

    afterEach(() => {
        EventsStore.clear();
    });

    it('should set events', () => {
        const storedEvents = EventsStore.getEvents();
        expect(storedEvents.length).toBe(0);

        EventsStore.setEvents(events);

        expect(EventsStore.getEvents().length).toBe(2);
        expect(EventsStore.getEvents()[0].type).toBe(FdEventType.VIEWPORT_SIZE);
        expect(EventsStore.getEvents()[1].type).toBe(FdEventType.VISIT);
    });

    it('should add event when setting a non-existing event', () => {
        const storedEvents = EventsStore.getEvents();
        expect(storedEvents.length).toBe(0);

        EventsStore.setEvent(events[0]);

        expect(EventsStore.getEvents().length).toBe(1);
        expect(EventsStore.getEvents()[0].type).toBe(FdEventType.VIEWPORT_SIZE);
    });

    it('should replace event when setting an existing event', () => {
        const storedEvents = EventsStore.getEvents();
        expect(storedEvents.length).toBe(0);

        EventsStore.setEvents(events);
        EventsStore.setEvent({type: FdEventType.VISIT, href: 'http://willim.nl'});

        expect(EventsStore.getEvents().length).toBe(2);
        expect((EventsStore.getEvents()[1] as FdVisitEvent).href).toBe('http://willim.nl');
    });

    it('should add event when not existing', () => {
        const storedEvents = EventsStore.getEvents();
        expect(storedEvents.length).toBe(0);

        EventsStore.setEvents(events);
        EventsStore.addUniqueEvent({type: FdEventType.VISIT, href: 'http://willim.nl'});

        expect(EventsStore.getEvents().length).toBe(2);
        expect((EventsStore.getEvents()[1] as FdVisitEvent).href).toBe('http://willemliu.nl');
    });

    it('should add event', () => {
        const storedEvents = EventsStore.getEvents();
        expect(storedEvents.length).toBe(0);

        EventsStore.setEvents(events);
        EventsStore.addEvent({type: FdEventType.VISIT, href: 'http://willim.nl'});

        expect(EventsStore.getEvents().length).toBe(3);
        expect((EventsStore.getEvents()[1] as FdVisitEvent).href).toBe('http://willemliu.nl');
        expect((EventsStore.getEvents()[2] as FdVisitEvent).href).toBe('http://willim.nl');
    });

    it('should be able to step back and step forward', () => {
        const storedEvents = EventsStore.getEvents();
        expect(storedEvents.length).toBe(0);

        EventsStore.setEvents(events);
        const futureEvents = EventsStore.getEvents();
        EventsStore.addFuture(futureEvents);
        EventsStore.stepBack();

        expect(EventsStore.getEvents().length).toBe(1);
        expect(EventsStore.getFutures().length).toBe(1);
        expect(EventsStore.getFutures()[0].length).toBe(2);
        expect((EventsStore.getFutures()[0][1] as FdVisitEvent).href).toBe('http://willemliu.nl');

        EventsStore.setEvents(EventsStore.popFuture());
        expect(EventsStore.getEvents().length).toBe(2);
        expect(EventsStore.getFutures().length).toBe(0);
        expect((EventsStore.getEvents()[1] as FdVisitEvent).href).toBe('http://willemliu.nl');        
    });

});
