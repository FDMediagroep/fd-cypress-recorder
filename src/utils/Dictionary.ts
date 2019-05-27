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

export function getCodeFromEvent(event: AllFdEvents, options: Options = {}) {
    switch (event.type) {
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
            return `cy.get('${(event as FdAttributeValueEvent).target}').then((el) => expect(el.attr('${(event as FdAttributeValueEvent).name}')).to.eq('${(event as FdAttributeValueEvent).value.replace(new RegExp("'", 'g'), "\\\'")}'));`;
        case FdEventType.ATTRIBUTE_VALUE_CONTAINS:
            return `cy.get('${(event as FdAttributeValueEvent).target}').then((el) => expect(el.attr('${(event as FdAttributeValueEvent).name}')).to.contain('${(event as FdAttributeValueEvent).value.replace(new RegExp("'", 'g'), "\\\'")}'));`;
        case FdEventType.ATTRIBUTE_VALUE_EXISTS:
            return `cy.get('${(event as FdAttributeExistsEvent).target}').should('have.attr', '${(event as FdAttributeExistsEvent).name}');`;
        default:
            return `// ${JSON.stringify(event)}`;
    }
}

export function getCode(suite: string, description: string, events: AllFdEvents[], options: Options = {}) {
    let code: any[] = [
        `/**\r\n`,
        ` * Code generated with Fd Cypress Recorder.\r\n`,
        ` * https://github.com/FDMediagroep/fd-cypress-recorder\r\n`,
        ` */\r\n\r\n`,
        `/// <reference types="Cypress" />\r\n`,
        `describe('${suite}', () => {\r\n`,
        `\tafterEach(() => {\r\n`,
        `\t\tcy.clearCookies();\r\n`,
        `\t});\r\n\r\n`,
        `\tit('${description}', () => {\r\n`
    ];
    events.forEach((event) => {
        code.push(`\t\t${getCodeFromEvent(event, {basicAuth: options.basicAuth})}\r\n`)
    })
    code.push('\t});\r\n');
    code.push('});\r\n');

    return code;
}
