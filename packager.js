const packager = require('electron-packager');

packager({
    dir: './', // path to your Electron app
    out: './dist', // path to output folder
    asar: {
        unpack: '**/*.js', // patterns of files to unpack from the asar archive
    },
    platform: 'win32',
    arch: 'x64',
    electronVersion: '21.4.4',
    icon: 'logo.ico', // specify the icon file
    // other options...
}).then(() => {
    console.log('Packaging completed');
}).catch(err => {
    console.error(err);
});