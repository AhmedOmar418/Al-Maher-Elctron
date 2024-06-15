const fs = require('fs');
const glob = require('glob');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { ipcRenderer } = require("electron");

// Specify the directory containing the JavaScript files
const directoryPath = './renderer/js/';

// Use glob.sync to get all the .js files in the directory
const files = glob.sync(directoryPath + '*.js');

files.forEach(file => {
    fs.readFile(file, "UTF8", function(err, data) {
        if (err) {
            console.error(err);
            return;
        }
        const obfuscationResult = JavaScriptObfuscator.obfuscate(data, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            shuffleStringArray: true,
            splitStrings: true,
            stringArrayThreshold: 1
        });

        fs.writeFile(file, obfuscationResult.getObfuscatedCode(), function(err) {
            if(err) {
                return console.error(err);
            }
            console.log(`The file ${file} was obfuscated!`);
            ipcRenderer.send('print-message3',`The file ${file} was obfuscated!`)
        });
    });
});