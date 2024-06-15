const { ipcRenderer } = require('electron')
const { shell } = require('electron')
document.getElementById('whatsappLink').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default action
    let phoneNumber = "00962797848483";
    let message = encodeURIComponent("السلام عليكم");
    let url = `https://wa.me/${phoneNumber}?text=${message}`;
    shell.openExternal(url);
})

document.getElementById('signOutIcon').addEventListener('click', () => {
    ipcRenderer.send('close-app')
})
document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('username');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (userName) {
        welcomeMessage.textContent += ', ' + userName;
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default link behavior

        // Clear local storage
        localStorage.clear();

        // Redirect to the home page
        window.location.href = '../../renderer/home/index.html'; // Replace 'home.html' with the path to your home page
    });
});