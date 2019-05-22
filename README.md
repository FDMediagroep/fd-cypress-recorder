[![Build Status](https://travis-ci.org/FDMediagroep/fd-cypress-recorder.svg?branch=master)](https://travis-ci.org/FDMediagroep/fd-cypress-recorder)
[![Coverage Status](https://coveralls.io/repos/github/FDMediagroep/fd-cypress-recorder/badge.svg?branch=master)](https://coveralls.io/github/FDMediagroep/fd-cypress-recorder?branch=master)

# Fd Cypress Recorder

`Fd Cypress Recorder` is a minimal plugin which records user interactions with a website. The interactions are then converted to Cypress test code which you can copy and paste into a Cypress test.
The plugin only automatically record click on `anchors` and `buttons`. If you want to do some custom actions, e.g. click on `span`, you can open up the context menu to record custom actions.

## Installation

Via Chrome Web Store: 

Or manually:
1. Clone this repository.
1. npm i
1. npm run webpack
1. In your Chrome or Edge Chromium browser you can then load an unpacked extension using the `fd-cypress-recorder` folder.

## Usage

1. Open the website you want to test
1. Click the Fd Cypress Recorder extension icon to open the popup
1. Press `Record` and the scenario recording starts
    1. Make sure the website has focus
    1. Press `CTRL`+`Print Screen` to open up a context menu with extra test options
    1. Interact with your website
1. Click the Fd Cypress Recorder extension icon to open the popup
1. Click `Stop` to stop recording.
1. Optional:
    1. Fill in the `Test suite name` and `Description`.
    1. You can now save these interactions as a template by pressing the `+` button
    1. Click `Show events` to see the recorded interactions in a list.
    ![Events](/fd-cypress-recorder/screenshot3.jpg?raw=true "Events")
    1. You can remove or re-order the interactions as you see fit.
1. Copy the code from the text area and paste it into a Cypress test file.
1. Run the Cypress test.


### Templates
`Fd Cypress Recorder` has the option to save your current interactions as a template. The philosophy behind this is to provide the user the ability to start recording from a certain point.
For instance when you want to record various scenarios for which the user needs to be logged in then you can record all actions necessary to log in and save these interactions as template. The next time you can decide to go to the page which comes after login and load saved the template and continue from there.
Alternatively you can also decide to navigate to a whole different page and load the template. You can open the Context Menu and use the `Visit current url` option to record this navigation step.
![Templates](/fd-cypress-recorder/screenshot2.jpg?raw=true "Templates")


### Context Menu
Functionality provided by the context menu records the corresponding interactions.
![Context Menu](/fd-cypress-recorder/screenshot.jpg?raw=true "Context Menu")

#### Click
Dispatches the `click` event to the element. Use this function on elements other than `a` or `button` which has a custom click interaction.
Note: `a` and `button` already have click handlers so this menu-item would cause a double interaction entry. You can easily remove the double interaction through the plugin popup `Show events` view.

#### Enter text
This allows you to enter text into text fields. The field must have focus in order for this to work correctly.

#### Hover
Triggers the mouse `hover` interaction.

#### Attributes...
Opens another context menu with extra options to assert the HTML attributes on the hovered element. All attributes existing on the hovered element are shown in the following context menu. And each attribute gives you the following options:
1. `Contains`: Check if attribute contains given text.
1. `Equals`: Check if attribute value equals current value.
1. `Exists`: Check if attribute exists

#### Contains text
Checks if the hovered element contains given text.

#### Exists
Checks if hovered element exists.

#### Match current URL
Uses the current URL as value to create a check if the current URL is the same. This is useful when you have recorded multiple interactions and some interactions causes you to navigate to another URL. You can use this option to check if you have landed on the expected URL.

#### URL contains
Check if current URL contains given text. This is useful if you want to check if after a series of interactions the URL contains a certain text. You'll use this functionality instead of `Match current URL` in the event the URL contains dynamic portions which are unpredictable. With this functionality you can assert the static portion of the URL.

#### Visit current URL
Use this function if you want to navigate to a certain URL not caused by another interaction like a click on an anchor or via submitting a form.

## Disclaimer

As with all extensions, `Fd Cypress Recorder` has an impact on the user-experience while using your browser. And also because of its ability to listen for keyboard and mouse interactions it is recommended that you disable this plugin when you're not making use of it. 
