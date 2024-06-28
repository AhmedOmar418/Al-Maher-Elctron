const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
require('dotenv').config();
document.getElementById('signOutIcon').addEventListener('click', () => {
    ipcRenderer.send('close-app')
})
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const spinner = document.getElementById('spinner');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
        const fullName = document.getElementById('full_name').value;
        const password = document.getElementById('password').value;
        const passwordConfirmation = document.getElementById('password_confirmation').value;

        if (password !== passwordConfirmation) {
            Swal.fire('خطأ', 'الرقم السري غير مطابق', 'error');
            return;
        }

        spinner.style.display = 'block'; // Show the spinner

        fetch('https://al-maher.net/api/my_script.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "token": "cF9+j17aP+ff",
                "route": "register"
            })
        })
            .then(response => response.json())
            .then(data => {
                const url = data.url;
                const queryParams = `?_format=json&code=1183118037061&pid=66&flags=register&userName=${username}&userEmail=${email}&userFullName=${fullName}&userPhone=${mobile}&userPassword=${password}&time=1695671655`;
                fetch(url + queryParams, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        spinner.style.display = 'none'; // Hide the spinner

                        if (data.status == 'register-done') {
                            // Store username and user id in local storage
                            localStorage.setItem('username', data.userName);
                            localStorage.setItem('userId', data.user_id);
                            localStorage.setItem('password', password);
                            window.location.href = '../../renderer/home/index.html';
                        } else if (data.status == 'usernameUsed') {
                            Swal.fire('فشل التسجيل', 'اسم المستخدم هذا مستخدم من قبل', 'error');
                        } else if (data.status == 'emailUsed') {
                            Swal.fire('فشل التسجيل', 'هذا الايميل مستخدم من قبل .', 'error');
                        } else {
                            Swal.fire('فشل التسجيل', 'من فضلك تأكد من البياانات المدخلة', 'error');
                        }
                    })
                    .catch(error => {
                        spinner.style.display = 'none'; // Hide the spinner
                        Swal.fire('Error', `An error occurred: ${error.message}`, 'error');
                    });
            })
            .catch(error => console.error('Error fetching URL:', error));
    });
});