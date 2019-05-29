export interface Header {
    property: string;
    value: string;
}

export enum FdEventType {
    ATTRIBUTE_VALUE_CONTAINS = 'attribute-value-contains',
    ATTRIBUTE_VALUE_EQUALS = 'attribute-value-equals',
    ATTRIBUTE_VALUE_EXISTS = 'attribute-value-exists',
    CLEAR_COOKIES = 'clear-cookies',
    CLICK = 'click',
    CONTAINS_TEXT = 'contains-text',
    COUNT_EQUALS = 'count-equals',
    COUNT_GREATER_THAN = 'count-greater-than',
    COUNT_LESS_THAN = 'count-less-than',
    HOVER = 'hover',
    LOCATION = 'location',
    LOCATION_CONTAINS = 'location-contains',
    EXISTS = 'exists',
    /**
     * Type text
     */
    TYPE = 'type',
    VIEWPORT_SIZE = 'viewport-size',
    VISIT = 'visit',
}

export interface FdEvent {
    type: FdEventType;
}

export interface FdAttributeValueEvent extends FdEvent {
    target: string; // CSS Selector
    name: string;
    value: string;
}

export interface FdAttributeExistsEvent extends FdEvent {
    target: string; // CSS Selector
    name: string;
}

export interface FdTypeEvent extends FdEvent {
    target: string; // CSS Selector
    value: string;
}

export interface FdClickEvent extends FdEvent {
    target: string; // CSS Selector
}

export interface FdHoverEvent extends FdEvent {
    target: string; // CSS Selector
}

export interface FdLocationEvent extends FdEvent {
    href: string;
}

export interface FdLocationContainsEvent extends FdEvent {
    value: string;
}

export interface FdVisitEvent extends FdEvent {
    href: string;
}

export interface FdTextContentEvent extends FdEvent {
    target: string; // CSS Selector
    value: string;
}

export interface FdViewportSizeEvent extends FdEvent {
    width: number;
    height: number;
}

export interface FdExistsEvent extends FdEvent {
    target: string; // CSS Selector
}

export interface FdCountEqualsEvent extends FdEvent {
    target: string; // CSS Selector
    value: number;
}

export interface FdCountGreaterThanEvent extends FdEvent {
    target: string; // CSS Selector
    value: number;
}

export interface FdCountLessThanEvent extends FdEvent {
    target: string; // CSS Selector
    value: number;
}

export type AllFdEvents = FdEvent
    | FdAttributeValueEvent
    | FdAttributeExistsEvent
    | FdClickEvent
    | FdCountEqualsEvent
    | FdCountGreaterThanEvent
    | FdCountLessThanEvent
    | FdExistsEvent
    | FdHoverEvent
    | FdLocationEvent
    | FdLocationContainsEvent
    | FdTextContentEvent
    | FdTypeEvent
    | FdViewportSizeEvent
    | FdVisitEvent
;

export interface Template {
    name: string;
    description?: string;
    events: AllFdEvents[];
}

export const UNIQUE_SELECTOR_OPTIONS = {
    selectorTypes: ['Tag', 'NthChild']
};

export interface Options {
    basicAuth?: boolean;
    headers?: Header[];
}
