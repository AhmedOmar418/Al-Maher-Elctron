const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
require('dotenv').config();
document.getElementById('signOutIcon').addEventListener('click', () => {
    ipcRenderer.send('close-app')
})
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const spinner = document.getElementById('spinner');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        spinner.style.display = 'block'; // Show the spinner

        fetch('https://al-maher.net/api/my_script.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "token": "cF9+j17aP+ff",
                "route": "login"
            })
        })
            .then(response => response.json())
            .then(data => {
                const url = data.url;
                const queryParams = `?_format=json&code=1183118037061&pid=66&time=1601118153&flags=login`;
                fetch(url + queryParams, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + btoa(username + ':' + password)
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        spinner.style.display = 'none'; // Hide the spinner

                        if (data.status == 'login-sucess') {
                            // Store username and user id in local storage
                            localStorage.setItem('username', data.userName);
                            localStorage.setItem('userId', data.user_id);
                            localStorage.setItem('password', password);
                            window.location.href = '../../renderer/home/index.html';
                        } else {
                            Swal.fire('فشل تسجيل الدخول', 'تأكد من بياناتك مجددا', 'error');
                        }
                    })
                    .catch(error => {
                        spinner.style.display = 'none'; // Hide the spinner
                        Swal.fire('فشل تسجيل الدخول', 'تأكد من بياناتك مجددا', 'error');
                        Swal.fire('Error', `An error occurred: ${error.message}`, 'error');
                    });
            })
            .catch(error => {
                spinner.style.display = 'none'; // Hide the spinner
                Swal.fire('فشل تسجيل الدخول', 'تأكد من بياناتك مجددا', 'error');
            });
    });
});