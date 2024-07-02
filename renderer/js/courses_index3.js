const {ipcRenderer} = require('electron')
const Swal = require("sweetalert2");
require('dotenv').config();
function clearDataAndGoBack() {
    localStorage.removeItem('courseData3'); // Clear the data
    window.history.back(); // Go back
}
document.getElementById('signOutIcon').addEventListener('click', () => {
    ipcRenderer.send('close-app')
});

document.addEventListener('DOMContentLoaded', () => {
    const courseData = JSON.parse(localStorage.getItem('courseData3')); // Retrieve course data from local storage
    const container = document.getElementById('container'); // Replace 'container' with the id of your container div

    courseData.rows.forEach(course => {
        const card = document.createElement('div');
        card.className = "card m-3 border-0";
        card.style.width = "24rem";

        const link = document.createElement('a');
        link.draggable = false;
        link.href = ""; // Use the course tax_tid as the URL

        link.addEventListener('click', (event) => {
            event.preventDefault();
            callApiAndRedirect(course.tax_tid);
        });


        const img = document.createElement('img');
        img.className = "card-img-top";
        img.src = "../../assets/class_select.jpg"; // Use the actual image source
        img.alt = "Course image";

        const cardBody = document.createElement('div');
        cardBody.className = "card-body";

        const innerDiv = document.createElement('div');
        innerDiv.className = "col-12 col-md-12 col-lg-12 mx-auto";

        const titleLink = document.createElement('a');
        titleLink.draggable = false;
        titleLink.href = ""; // Use the course tax_tid as the URL
        titleLink.style.textDecoration = "none";

        titleLink.addEventListener('click', (event) => {
            event.preventDefault();
            callApiAndRedirect(course.tax_tid);
        });

        const title = document.createElement('h5');
        title.className = "card-title text-center text-black";
        title.textContent = course.tax_name; // Use the actual course name

        const btn = document.createElement('a');
        btn.draggable = false;
        btn.href = ""; // Use the course tax_tid as the URL
        btn.className = "btn btn-primary";
        btn.style.width = "100%";
        btn.textContent = "أختر";


        btn.addEventListener('click', (event) => {
            event.preventDefault();
            callApiAndRedirect(course.tax_tid);
        });

        titleLink.appendChild(title);
        innerDiv.appendChild(titleLink);
        innerDiv.appendChild(btn);
        cardBody.appendChild(innerDiv);
        link.appendChild(img);
        link.appendChild(cardBody);
        card.appendChild(link);

        container.appendChild(card);
    });
});

function callApiAndRedirect(id) {
    const courseData = JSON.parse(localStorage.getItem('courseData3')); // Retrieve course data from local storage

    courseData.rows.forEach(row => {
        ipcRenderer.send('print-message3', row)

        if(row.is_first === 'null'){
            ipcRenderer.send('print-message3', 'nulllllll');

            fetch('https://al-maher.net/api/my_script.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "token": "cF9+j17aP+ff",
                    "route": "courses_index3"
                })
            })
                .then(response => response.json())
                .then(data => {
                    const url = data.url;
                    const queryParams = `?tid=${id}&time=1693943375`;
                    fetch(url + queryParams)
                        .then(response => response.json())
                        .then(data => {
                            ipcRenderer.send('print-message3','dataaaaa',data)

                            // Store the data in local storage so it can be accessed in the next page
                            localStorage.setItem('courseData4', JSON.stringify(data));
                            // Then redirect to the new page
                            window.location.href = '../../renderer/courses/teachers.html';
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                })
                .catch(error => console.error('Error fetching URL:', error));
        } else if(row.is_first.trim().toUpperCase() === 'NO'){
            ipcRenderer.send('print-message3', 'NOOOOO');

            fetch('https://al-maher.net/api/my_script.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "token": "cF9+j17aP+ff",
                    "route": "courses_index1"
                })
            })
                .then(response => response.json())
                .then(data => {
                    const url = data.url;
                    const queryParams = `?tid=${id}&time=1693943375`;
                    fetch(url + queryParams)
                        .then(response => response.json())
                        .then(data => {
                            ipcRenderer.send('print-message3','not teachers')
                            ipcRenderer.send('print-message3',data)
                            ipcRenderer.send('print-message3',id)

                            // Store the data in local storage so it can be accessed in the next page
                            localStorage.setItem('courseData3', JSON.stringify(data));
                            // Then redirect to the new page
                            window.location.href = '../../renderer/courses/level4.html';
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                })
                .catch(error => console.error('Error fetching URL:', error));
        } else if(row.is_first.trim().toUpperCase() === 'YES'){
            ipcRenderer.send('print-message3', 'YEEEESSS');

            fetch('https://al-maher.net/api/my_script.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "token": "cF9+j17aP+ff",
                    "route": "courses_index1"
                })
            })
                .then(response => response.json())
                .then(data => {
                    const url = data.url;
                    const queryParams = `?tid=${id}&time=1693943375`;
                    fetch(url + queryParams)
                        .then(response => response.json())
                        .then(data => {
                            ipcRenderer.send('print-message3','not teachers 2',data)

                            // Store the data in local storage so it can be accessed in the next page
                            localStorage.setItem('courseData2', JSON.stringify(data));
                            // Then redirect to the new page
                            window.location.href = '../../renderer/courses/level3.html';
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong! Please Call Al-Maher Support',
                            });
                        });
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong! Please Call Al-Maher Support',
                    });
                });
        }
    });
}