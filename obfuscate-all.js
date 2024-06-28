const fs = require('fs');
const glob = require('glob');
const { ipcRenderer } = require("electron");
const asar = require('asar');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Specify the directory containing the JavaScript files
const directoryPath = './renderer/js/';

// Use glob.sync to get all the .js files in the directory
const files = glob.sync(directoryPath + '*.js');

files.forEach(file => {
    // Read the JavaScript file
    const fileContent = fs.readFileSync(file, 'utf8');

    // Obfuscate the JavaScript file
    const obfuscationResult = JavaScriptObfuscator.obfuscate(fileContent);

    // Write the obfuscated code to the file
    fs.writeFileSync(file, obfuscationResult.getObfuscatedCode());

    console.log(`The file ${file} has been obfuscated.`);
});
