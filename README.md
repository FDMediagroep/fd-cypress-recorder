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

## Templates

`Fd Cypress Recorder` has the option to save your current interactions as a template. The philosophy behind this is to provide the user the ability to start recording from a certain point.
For instance when you want to record various scenarios for which the user needs to be logged in then you can record all actions necessary to log in and save these interactions as template. The next time you can decide to go to the page which comes after login and load saved the template and continue from there.
Alternatively you can also decide to navigate to a whole different page and load the template. You can open the Context Menu and use the `Visit current url` option to record this navigation step.

## Disclaimer

As with all extensions, `Fd Cypress Recorder` has an impact on the user-experience while using your browser. And also because of its ability to listen for keyboard and mouse interactions it is recommended that you disable this plugin when you're not making use of it. 
