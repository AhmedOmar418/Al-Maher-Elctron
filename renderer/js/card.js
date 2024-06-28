const {ipcRenderer} = require('electron')
const Swal = require('sweetalert2');
require('dotenv').config();
document.getElementById('signOutIcon').addEventListener('click', () => {
    ipcRenderer.send('close-app')
});

document.addEventListener('DOMContentLoaded', () => {
    const card_form = document.getElementById('card_form');
    const spinner = document.getElementById('spinner');

    card_form.addEventListener('submit', (e) => {
        e.preventDefault();

        let code = document.getElementById('code').value;
        let userId = localStorage.getItem('userId') || '0';
        let pid = localStorage.getItem('selectedTeacherId') || '0';
        let bkg = '0';

        if (code === '') {
            Swal.fire('خطأ', 'الرمز البطاقة مطلوب', 'error');
            return;
        }

        spinner.style.display = 'block'; // Show the spinner

        let username = localStorage.getItem('username') || '';
        let password = localStorage.getItem('password') || '';

        // Encode the username and password in base64
        let basicAuth = 'Basic ' + btoa(username + ':' + password);

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
                const baseUrl = data.url;
                const queryParams = `?flags=checkCode&_format=json&code=${code}&bkg=${bkg}&pid=${pid}&user_id=${userId}`;
                let url = `${baseUrl}${queryParams}`;

                ipcRenderer.send('print-message3',url)

                fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': basicAuth
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        ipcRenderer.send('print-message3',data)

                        spinner.style.display = 'none'; // Hide the spinner

                        if (data.status == 'code-done') {
                            fetch('https://al-maher.net/api/my_script.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    "token": "cF9+j17aP+ff",
                                    "route": "courses2"
                                })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    const baseUrl = data.url;
                                    const queryParams = `?tid=${pid}`;
                                    fetch(baseUrl + queryParams)
                                        .then(response => response.json())
                                        .then(data => {
                                            // Store the data in local storage so it can be accessed in the next page
                                            localStorage.setItem('courseData', JSON.stringify(data));
                                            // Then redirect to the new page
                                            window.location.href = '../../renderer/user_courses/level2.html';
                                        })
                                        .catch(error => {
                                            console.error('Error:', error);
                                        });
                                })
                                .catch(error => console.error('Error fetching URL:', error));
                        } else if (data.status == 'code-not-valid') {
                            Swal.fire('!تنبيه', ' البطاقة مستخدمة غير صالحة', 'error');
                        } else if (data.status == 'used-code') {
                            Swal.fire('!تنبيه', ' البطاقة مستخدمة من قبل', 'error');
                        } else if (data.status == 'bkg-finish') {
                            Swal.fire('!تنبيه', ' تم بلوغ حد استخدام البطاقة', 'error');
                        } else {
                            Swal.fire('!تنبيه', ' البطاقه المدخلة غير صحيحة حاول مجددا', 'error');
                        }
                    })
                    .catch(error => {
                        spinner.style.display = 'none'; // Hide the spinner
                        Swal.fire('خطأ', `حدث خطا ما: ${error.message}  `, 'error');
                    });
            })
            .catch(error => console.error('Error fetching URL:', error));
    });
});