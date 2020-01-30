[![Build Status](https://travis-ci.org/FDMediagroep/fd-cypress-recorder.svg?branch=master)](https://travis-ci.org/FDMediagroep/fd-cypress-recorder)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)
[![Coverage Status](https://coveralls.io/repos/github/FDMediagroep/fd-cypress-recorder/badge.svg?branch=master)](https://coveralls.io/github/FDMediagroep/fd-cypress-recorder?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/FDMediagroep/fd-cypress-recorder.svg)](https://greenkeeper.io/)

# Fd Cypress Recorder

`Fd Cypress Recorder` is a minimal plugin which records user interactions with a website. The interactions are then converted to Cypress test code which you can copy and paste into a Cypress test.
The plugin only automatically record click on `anchors` and `buttons`. If you want to do some custom actions, e.g. click on `span`, you can open up the context menu to record custom actions.

## Installation

Via Chrome Web Store: https://chrome.google.com/webstore/detail/fd-cypress-recorder/amleackadkomdccpbfginhnecfhhognj

Or manually:

-   From [zip-file](https://github.com/FDMediagroep/fd-cypress-recorder/releases/latest)

or

-   Compile the plugin yourself
    1. Clone this repository.
    1. npm i
    1. npm run webpack
    1. In your Chrome or Edge Chromium browser you can then load an unpacked extension using the `fd-cypress-recorder` folder.

## Usage

1. Open the website you want to test
1. Click the Fd Cypress Recorder extension icon to open the popup
1. Press `Record` and the scenario recording starts
    1. Make sure the website has focus
    1. Press `ALT`+`c` or alternatively `CTRL`+`right mouse click` to open up a context menu with extra test options
    1. Interact with your website
1. Click the Fd Cypress Recorder extension icon to open the popup
1. Click `Stop` to stop recording.
1. Optional:
    1. Fill in the `Test suite name` and `Description`.
    1. You can now save these interactions as a template by pressing the `+` button
    1. Click `Show events` to see the recorded interactions in a list.
       ![Events](/fd-cypress-recorder/screenshot3.jpg?raw=true 'Events')
    1. You can remove or re-order the interactions as you see fit.
1. Copy the code from the text area and paste it into a Cypress test file.
1. Run the Cypress test.

### Extension options

1. Right-click the extension icon to open the browser context-menu.
1. Click `Extension options` to open the options screen for the extension.

#### Prioritize attribute as unique selector

According to the [best practices](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements) of Cypress.io one should have `data-*` attributes on elements. You can configure the Fd Cypress Recorder extension to prioritize attributes as unique DOM Selector to accomodate this best practice. This is turned off by default so you need to go to the `Extension options` to turn this option on.
![Templates](/screenshots/extension-options.jpg?raw=true 'Extension options')

### Templates

`Fd Cypress Recorder` has the option to save your current interactions as a template. The philosophy behind this is to provide the user the ability to start recording from a certain point.
For instance when you want to record various scenarios for which the user needs to be logged in then you can record all actions necessary to log in and save these interactions as template. The next time you can decide to go to the page which comes after login and load the saved template and continue from there.
Alternatively you can also decide to navigate to a whole different page and load the template. You can open the Context Menu and use the `Visit current url` option to record this navigation step.
![Templates](/screenshots/screenshot2.jpg?raw=true 'Templates')

#### Load templates

Click on the name of the template to load it. This action will overwrite your current interactions if you have any.

#### Append templates

Click on the `[+]` button next to the template name to load and append the template interactions to your current existing interactions. This is useful if you have created your templates as small building blocks which can succeed each other. I.e. `cookiewall accept` + `login` + `click article`.
This allows greater flexibility when it comes to rewriting templates. If for instance your cookiewall has changed and the test needs to be rewritten you now only have to change that particular template and you can then join all other relevant templates together quickly to replace the failing test.

#### Remove template

Click on the `[x]` button next to the template name to delete the template completely. This action can not be undone.

### Context Menu

Functionality provided by the context menu, records the corresponding interactions.
![Context Menu](/screenshots/screenshot.jpg?raw=true 'Context Menu')

#### Click

Dispatches the `click` event to the element. Use this function on elements other than `a` or `button` which has a custom click interaction.
Note: `a` and `button` already have click handlers so this menu-item would cause a double interaction entry. You can easily remove the double interaction through the plugin popup `Show events` view.

#### Enter text

This allows you to enter text into text fields. The field must have focus in order for this to work correctly.

#### Hover

Triggers the mouse `hover` interaction.

#### Wait

This allows you to wait a number of milliseconds before the next event triggers in the test.

#### Attributes...

Opens another context menu with extra options to assert the HTML attributes on the hovered element. All attributes existing on the hovered element are shown in the following context menu. And each attribute gives you the following options:

1. `Contains`: Check if attribute contains given text.
1. `Equals`: Check if attribute value equals current value.
1. `Exists`: Check if attribute exists

#### Contains text

Checks if the hovered element contains given text.

#### Count...

Counts the recurrence of the currently hovered element type within it's parent.
Note: it can often be difficult to select the correct container element.

1. `Equals(`_`n`_`)`: Check that element of type within parent equals this number.
1. `Equals...`: Check that element of type within parent equals given number.
1. `Greater...`: Check that element of type within parent is greater than given number.
1. `Less...`: Check that element of type within parent is less than given number.

#### Exists

Checks if hovered element exists.

#### Match current URL

Uses the current URL as value to create a check if the current URL is the same. This is useful when you have recorded multiple interactions and some interactions causes you to navigate to another URL. You can use this option to check if you have landed on the expected URL.

#### URL contains

Check if current URL contains given text. This is useful if you want to check if after a series of interactions the URL contains a certain text. You'll use this functionality instead of `Match current URL` in the event the URL contains dynamic portions which are unpredictable. With this functionality you can assert the static portion of the URL.

#### Visit current URL

Use this function if you want to navigate to a certain URL not caused by another interaction like a click on an anchor or via submitting a form.

## Fork for other Testing frameworks

This plugin is mainly a recorder. The literal code generation is handled in `Dictionary.ts`. If you think the recording functionality and interface is useful and want to re-use it for the purpose of generating code for other Testing frameworks then you only need to modify `Dictionary.ts` for it.

In short: Fork this repository and modify `Dictionary.ts` to return the corresponding code for the testing framework of your choice add a backlink in README.md crediting this repository and you're done.

## Disclaimer

As with all extensions, `Fd Cypress Recorder` has an impact on the user-experience while using your browser. And also because of its ability to listen for keyboard and mouse interactions it is recommended that you disable this plugin when you're not making use of it.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.willemliu.nl"><img src="https://avatars0.githubusercontent.com/u/5611802?v=4" width="100px;" alt=""/><br /><sub><b>Willem Liu</b></sub></a><br /><a href="https://github.com/FDMediagroep/fd-cypress-recorder/commits?author=willemliufdmg" title="Code">💻</a> <a href="https://github.com/FDMediagroep/fd-cypress-recorder/commits?author=willemliufdmg" title="Documentation">📖</a> <a href="#example-willemliufdmg" title="Examples">💡</a> <a href="#maintenance-willemliufdmg" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://www.willim.nl"><img src="https://avatars1.githubusercontent.com/u/974906?v=4" width="100px;" alt=""/><br /><sub><b>Willem Liu</b></sub></a><br /><a href="https://github.com/FDMediagroep/fd-cypress-recorder/commits?author=willemliu" title="Code">💻</a> <a href="https://github.com/FDMediagroep/fd-cypress-recorder/commits?author=willemliu" title="Documentation">📖</a> <a href="#example-willemliu" title="Examples">💡</a> <a href="#maintenance-willemliu" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/burner"><img src="https://avatars0.githubusercontent.com/u/13327?v=4" width="100px;" alt=""/><br /><sub><b>Robert Schadek</b></sub></a><br /><a href="https://github.com/FDMediagroep/fd-cypress-recorder/commits?author=burner" title="Code">💻</a> <a href="https://github.com/FDMediagroep/fd-cypress-recorder/pulls?q=is%3Apr+reviewed-by%3Aburner" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://greenkeeper.io/"><img src="https://avatars2.githubusercontent.com/u/13812225?v=4" width="100px;" alt=""/><br /><sub><b>Greenkeeper</b></sub></a><br /><a href="https://github.com/FDMediagroep/fd-cypress-recorder/commits?author=greenkeeperio" title="Code">💻</a></td>
    <td align="center"><a href="http://www.mad3linux.org"><img src="https://avatars3.githubusercontent.com/u/508624?v=4" width="100px;" alt=""/><br /><sub><b>Átila Camurça Alves</b></sub></a><br /><a href="https://github.com/FDMediagroep/fd-cypress-recorder/commits?author=atilacamurca" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
