export enum FdEventType {
    ATTRIBUTE_VALUE_CONTAINS = 'attribute-value-contains',
    ATTRIBUTE_VALUE_EQUALS = 'attribute-value-equals',
    ATTRIBUTE_VALUE_EXISTS = 'attribute-value-exists',
    CLEAR_COOKIES = 'clear-cookies',
    CLICK = 'click',
    CONTAINS_TEXT = 'contains-text',
    HOVER = 'hover',
    LOCATION = 'location',
    LOCATION_CONTAINS = 'location-contains',
    EXISTS = 'exists',
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

export type AllFdEvents = FdEvent
    | FdAttributeValueEvent
    | FdAttributeExistsEvent
    | FdClickEvent
    | FdHoverEvent
    | FdLocationEvent
    | FdLocationContainsEvent
    | FdVisitEvent
    | FdTextContentEvent
    | FdViewportSizeEvent
    | FdExistsEvent
    | FdTypeEvent;

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
}

export function getCode(event: AllFdEvents, options?: Options) {
    switch (event.type) {
        case FdEventType.CLEAR_COOKIES:
            return `cy.clearCookies();`;
        case FdEventType.CLICK:
            return `cy.get('${(event as FdClickEvent).target}').should('exist').click();`;
        case FdEventType.CONTAINS_TEXT:
            return `cy.get('${(event as FdTextContentEvent).target}').contains('${(event as FdTextContentEvent).value.replace(new RegExp("'", 'g'), "\\\'")}');`;
        case FdEventType.EXISTS:
            return `cy.get('${(event as FdExistsEvent).target}').should('exist');`;
        case FdEventType.HOVER:
            return `cy.get('${(event as FdHoverEvent).target}').trigger('mouseover');`;
        case FdEventType.LOCATION:
            return `cy.location('href', {timeout: 10000}).should('eq', '${(event as FdLocationEvent).href}');`;
        case FdEventType.LOCATION_CONTAINS:
            return `cy.location('href', {timeout: 10000}).should('contain', '${(event as FdLocationContainsEvent).value}');`;
        case FdEventType.VISIT:
            if (options && options.basicAuth) {
                return `cy.visit('${(event as FdLocationEvent).href}', {auth: {username: Cypress.env('BASIC_USER') || '', password: Cypress.env('BASIC_PASS') || ''}});`;
            } else {
                return `cy.visit('${(event as FdLocationEvent).href}');`;
            }
        case FdEventType.TYPE:
            return `cy.get('${(event as FdTypeEvent).target}').type('${(event as FdTypeEvent).value}');`;
        case FdEventType.VIEWPORT_SIZE:
            return `cy.viewport(${(event as FdViewportSizeEvent).width}, ${(event as FdViewportSizeEvent).height});`;
        case FdEventType.ATTRIBUTE_VALUE_EQUALS:
            return `cy.get('${(event as FdAttributeValueEvent).target}').then((el: any) => el.attr('${(event as FdAttributeValueEvent).name}')).then((attr: string) => expect(attr).to.eq('${(event as FdAttributeValueEvent).value.replace(new RegExp("'", 'g'), "\\\'")}'))`;
        case FdEventType.ATTRIBUTE_VALUE_CONTAINS:
            return `cy.get('${(event as FdAttributeValueEvent).target}').then((el: any) => el.attr('${(event as FdAttributeValueEvent).name}')).then((attr: string) => expect(attr).to.contain('${(event as FdAttributeValueEvent).value.replace(new RegExp("'", 'g'), "\\\'")}'))`;
        case FdEventType.ATTRIBUTE_VALUE_EXISTS:
            return `cy.get('${(event as FdAttributeExistsEvent).target}').should('have.attr', '${(event as FdAttributeExistsEvent).name}');`;
        default:
            return `// ${JSON.stringify(event)}`;
    }
}
