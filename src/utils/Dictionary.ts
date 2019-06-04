import { AllFdEvents,
    Options,
    FdEventType,
    FdClickEvent,
    FdTextContentEvent,
    FdCountEqualsEvent,
    FdExistsEvent,
    FdHoverEvent,
    FdLocationEvent,
    FdLocationContainsEvent,
    FdTypeEvent,
    FdViewportSizeEvent,
    FdAttributeValueEvent,
    FdAttributeExistsEvent
} from "./FdEvents";

/**
 * Converts event to corresponding code and returns the code.
 * In case there is no translation the `event` will be returned as string.
 *
 * Supported events:
 *
 * FdEventType.ATTRIBUTE_VALUE_CONTAINS: check if given element has given attribute with value containing given value
 *
 * FdEventType.ATTRIBUTE_VALUE_EQUALS: check if given element has given attribute with value equaling given value
 *
 * FdEventType.ATTRIBUTE_VALUE_EXISTS: check if given element has given attribute
 *
 * FdEventType.CLEAR_COOKIES: clear browser session cookies
 *
 * FdEventType.CLICK: click an element
 *
 * FdEventType.CONTAINS_TEXT: check if an element contains given text
 *
 * FdEventType.COUNT_EQUALS: check if an element type exists given number of times within parent
 *
 * FdEventType.COUNT_GREATER_THAN: check if an element type exists more than given number of times within parent
 *
 * FdEventType.COUNT_LESS_THAN: check if an element type exists less than given number of times within parent
 *
 * FdEventType.EXISTS: check if element exists
 *
 * FdEventType.HOVER: set the mouseover state on element
 *
 * FdEventType.LOCATION: check if current location addressbar is the same as given value
 *
 * FdEventType.LOCATION_CONTAINS: check if current location value in addressbar contains given value.
 *                                This is useful to bypass unpredictable values in the URL. E.g. session hashes.
 *
 * FdEventType.VISIT: navigate to the given URL
 *
 * FdEventType.TYPE: type a certain text into the focused element
 *
 * FdEventType.VIEWPORT_SIZE: set the viewport size
 *
 * @param event
 * @param options
 */
export function getCodeFromEvent(event: AllFdEvents, options?: Options): string {
    switch (event.type) {
        case FdEventType.ATTRIBUTE_VALUE_CONTAINS:
            return `cy.get('${(event as FdAttributeValueEvent).target}').then((el) => expect(el.attr('${(event as FdAttributeValueEvent).name}')).to.contain('${(event as FdAttributeValueEvent).value.replace(new RegExp("'", 'g'), "\\\'")}'));`;
        case FdEventType.ATTRIBUTE_VALUE_EQUALS:
            return `cy.get('${(event as FdAttributeValueEvent).target}').then((el) => expect(el.attr('${(event as FdAttributeValueEvent).name}')).to.eq('${(event as FdAttributeValueEvent).value.replace(new RegExp("'", 'g'), "\\\'")}'));`;
        case FdEventType.ATTRIBUTE_VALUE_EXISTS:
            return `cy.get('${(event as FdAttributeExistsEvent).target}').should('have.attr', '${(event as FdAttributeExistsEvent).name}');`;
        case FdEventType.CLEAR_COOKIES:
            return `cy.clearCookies();`;
        case FdEventType.CLICK:
            return `cy.get('${(event as FdClickEvent).target}').click();`;
        case FdEventType.CONTAINS_TEXT:
            return `cy.get('${(event as FdTextContentEvent).target}').contains('${(event as FdTextContentEvent).value.replace(new RegExp("'", 'g'), "\\\'")}');`;
        case FdEventType.COUNT_EQUALS:
            return `cy.get('${(event as FdCountEqualsEvent).target}').should('have.length', ${(event as FdCountEqualsEvent).value});`;
        case FdEventType.COUNT_GREATER_THAN:
            return `cy.get('${(event as FdCountEqualsEvent).target}').should('have.length.gt', ${(event as FdCountEqualsEvent).value});`;
        case FdEventType.COUNT_LESS_THAN:
            return `cy.get('${(event as FdCountEqualsEvent).target}').should('have.length.lt', ${(event as FdCountEqualsEvent).value});`;
        case FdEventType.EXISTS:
            return `cy.get('${(event as FdExistsEvent).target}').should('exist');`;
        case FdEventType.HOVER:
            return `cy.get('${(event as FdHoverEvent).target}').trigger('mouseover');`;
        case FdEventType.LOCATION:
            return `cy.location('href', {timeout: 10000}).should('eq', '${(event as FdLocationEvent).href}');`;
        case FdEventType.LOCATION_CONTAINS:
            return `cy.location('href', {timeout: 10000}).should('contain', '${(event as FdLocationContainsEvent).value}');`;
        case FdEventType.VISIT:
            let opt = '';
            if (options) {
                if (options.basicAuth) {
                    opt = `auth: {username: Cypress.env('BASIC_USER') || '', password: Cypress.env('BASIC_PASS') || ''}`;
                }
                if (options.headers && options.headers.length) {
                    let headers = '';
                    options.headers.forEach((h) => {
                        if (h.property !== '') {
                            const prop = h.property.replace(/\\/g, '\\\\').replace(new RegExp('"', 'g'), '\\"');
                            const value = h.value.replace(/\\/g, '\\\\').replace(new RegExp('"', 'g'), '\\"');
                            if (headers) {
                                headers += `, "${prop}": "${value}"`;
                            } else {
                                headers += `"${prop}": "${value}"`;
                            }
                        }
                    });
                    headers = `headers: {${headers}}`;
                    if (opt) {
                        opt = `${opt}, ${headers}`;
                    } else {
                        opt = headers;
                    }
                }
                if (opt) {
                    opt = `, {${opt}}`;
                }
            }
            return `cy.visit('${(event as FdLocationEvent).href}'${opt});`;
        case FdEventType.TYPE:
            return `cy.get('${(event as FdTypeEvent).target}').type('${(event as FdTypeEvent).value}');`;
        case FdEventType.VIEWPORT_SIZE:
            return `cy.viewport(${(event as FdViewportSizeEvent).width}, ${(event as FdViewportSizeEvent).height});`;
        default:
            return `// ${JSON.stringify(event)}`;
    }
}

export function getCode(suite: string, description: string, events: AllFdEvents[], options?: Options) {
    const code: string[] = [
`/**
  * Code generated with Fd Cypress Recorder.
  * https://github.com/FDMediagroep/fd-cypress-recorder
  */

/// <reference types="Cypress" />
describe('${suite}', () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it('${description}', () => {
`];
    events.forEach((event) => {
        code.push(`    ${getCodeFromEvent(event, options)}\r\n`);
    });
    code.push('  });\r\n');
    code.push('});\r\n');

    return code;
}
