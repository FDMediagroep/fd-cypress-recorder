import {
    getCode,
    FdEventType,
    FdClickEvent,
    FdEvent,
    FdTextContentEvent,
    FdExistsEvent,
    FdHoverEvent,
    FdLocationEvent,
    FdLocationContainsEvent,
    FdVisitEvent,
    FdTypeEvent,
    FdViewportSizeEvent,
    FdAttributeValueEvent,
    FdAttributeExistsEvent,
    FdCountEqualsEvent,
    FdCountGreaterThanEvent,
    FdCountLessThanEvent
} from '../../src/utils/CypressDictionary';

describe('Cypress Dictionary', () => {
    it('should return the Clear Cookies event Cypress code', () => {
        const event: FdEvent = {type: FdEventType.CLEAR_COOKIES};
        expect(getCode(event)).toBe(`cy.clearCookies();`);
    });

    it('should return the Click event Cypress code', () => {
        const event: FdClickEvent = {type: FdEventType.CLICK, target: 'document.body'};
        expect(getCode(event)).toBe(`cy.get('${event.target}').click();`);
    });

    it('should return the Contains Text event Cypress code', () => {
        const event: FdTextContentEvent = {type: FdEventType.CONTAINS_TEXT, target: 'document.body', value: `Testing'some"Text`};
        expect(getCode(event)).toBe(`cy.get('${event.target}').contains('${event.value.replace(new RegExp("'", 'g'), "\\\'")}');`);
    });

    it('should return the Count equals event Cypress code', () => {
        const event: FdCountEqualsEvent = {type: FdEventType.COUNT_EQUALS, target: 'document.body', value: 10};
        expect(getCode(event)).toBe(`cy.get('${event.target}').should('have.length', ${event.value});`);
    });

    it('should return the Count greater than event Cypress code', () => {
        const event: FdCountGreaterThanEvent = {type: FdEventType.COUNT_GREATER_THAN, target: 'document.body', value: 30};
        expect(getCode(event)).toBe(`cy.get('${event.target}').should('have.length.gt', ${event.value});`);
    });

    it('should return the Count less than event Cypress code', () => {
        const event: FdCountLessThanEvent = {type: FdEventType.COUNT_LESS_THAN, target: 'document.body', value: 60};
        expect(getCode(event)).toBe(`cy.get('${event.target}').should('have.length.lt', ${event.value});`);
    });

    it('should return the Exists event Cypress code', () => {
        const event: FdExistsEvent = {type: FdEventType.EXISTS, target: 'document.body'};
        expect(getCode(event)).toBe(`cy.get('${event.target}').should('exist');`);
    });

    it('should return the Hover event Cypress code', () => {
        const event: FdHoverEvent = {type: FdEventType.HOVER, target: 'document.body'};
        expect(getCode(event)).toBe(`cy.get('${event.target}').trigger('mouseover');`);
    });

    it('should return the Location event Cypress code', () => {
        const event: FdLocationEvent = {type: FdEventType.LOCATION, href: 'http://willemliu.nl'};
        expect(getCode(event)).toBe(`cy.location('href', {timeout: 10000}).should('eq', '${event.href}');`);
    });

    it('should return the Location Contains event Cypress code', () => {
        const event: FdLocationContainsEvent = {type: FdEventType.LOCATION_CONTAINS, value: 'willemliu'};
        expect(getCode(event)).toBe(`cy.location('href', {timeout: 10000}).should('contain', '${event.value}');`);
    });

    it('should return the Visit event Cypress code', () => {
        const event: FdVisitEvent = {type: FdEventType.VISIT, href: 'http://willemliu.nl'};
        expect(getCode(event)).toBe(`cy.visit('${event.href}');`);
    });

    it('should return the Visit event Cypress code with basic authentication', () => {
        const event: FdVisitEvent = {type: FdEventType.VISIT, href: 'http://willemliu.nl'};
        expect(getCode(event, {basicAuth: true})).toBe(`cy.visit('${event.href}', {auth: {username: Cypress.env('BASIC_USER') || '', password: Cypress.env('BASIC_PASS') || ''}});`);
    });

    it('should return the Type event Cypress code', () => {
        const event: FdTypeEvent = {type: FdEventType.TYPE, target: 'document.body', value: 'Willem Liu'};
        expect(getCode(event)).toBe(`cy.get('${event.target}').type('${event.value}');`);
    });

    it('should return the Viewport Size event Cypress code', () => {
        const event: FdViewportSizeEvent = {type: FdEventType.VIEWPORT_SIZE, width: 320, height: 240};
        expect(getCode(event)).toBe(`cy.viewport(${event.width}, ${event.height});`);
    });

    it('should return the Check Attribute Equals event Cypress code', () => {
        const event: FdAttributeValueEvent = {type: FdEventType.ATTRIBUTE_VALUE_EQUALS, target: 'document.body', name: 'checked', value: 'checked'};
        expect(getCode(event)).toBe(`cy.get('${event.target}').then((el) => expect(el.attr('${event.name}')).to.eq('${event.value.replace(new RegExp("'", 'g'), "\\\'")}'));`);
    });

    it('should return the Check Attribute Contains event Cypress code', () => {
        const event: FdAttributeValueEvent = {type: FdEventType.ATTRIBUTE_VALUE_CONTAINS, target: 'document.body', name: 'class', value: 'red'};
        expect(getCode(event)).toBe(`cy.get('${event.target}').then((el) => expect(el.attr('${event.name}')).to.contain('${event.value.replace(new RegExp("'", 'g'), "\\\'")}'));`);
    });

    it('should return the Check Attribute Exists event Cypress code', () => {
        const event: FdAttributeExistsEvent = {type: FdEventType.ATTRIBUTE_VALUE_EXISTS, target: 'document.body', name: 'type'};
        expect(getCode(event)).toBe(`cy.get('${event.target}').should('have.attr', '${event.name}');`);
    });
});
