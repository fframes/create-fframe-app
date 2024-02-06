#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { createProject } = require('./create-project');
const { generateApplet } = require('./generate-applet');

// manual argument parsing
const args = process.argv.slice(2); // Remove node and script path

let generateAppletFlag = false;
let appletName = '';

// loop through arguments
for (let i = 0; i < args.length; i++) {
    if (args[i] === '-g') {
        if (!args[i + 1]) {
            throw new Error('applet name is required');
        }
        generateAppletFlag = true;
        appletName = args[i + 1];
        // exit the loop if -g is found
        break;
    }
}

if (generateAppletFlag) {
    // call generateApplet if -g is provided
    console.log(`generating applet with name: ${appletName}`);
    generateApplet(appletName);
} else {
    // default to createProject if no -g flag is found
    console.log(`creating project with interactive cli`);
    createProject();
}
