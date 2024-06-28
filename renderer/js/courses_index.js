const { ipcRenderer } = require('electron')
const Swal = require('sweetalert2');

require('dotenv').config();
document.getElementById('signOutIcon').addEventListener('click', () => {
    ipcRenderer.send('close-app')
})

document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId'); // Retrieve user id from local storage

    fetch('https://al-maher.net/api/my_script.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "token": "cF9+j17aP+ff",
            "route": "courses_index"
        })
    })
        .then(response => response.json())
        .then(data => {
            const url = data.url;
            const queryParams = `?tid=${userId}&time=1693943375`;
            fetch(url + queryParams)
                .then(response => response.json())
                .then(data => {
                    // Assuming data is an array of courses
                    const container = document.getElementById('container'); // Replace 'container' with the id of your container div
                    data.rows.forEach(course => {
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
                })
                .catch(error => {
                    Swal.fire('Error', `An error occurred: ${error.message}`, 'error');
                });
        })
        .catch(error => Swal.fire('Error', `Error fetching URL: ${error.message}`, 'error'));
});

function callApiAndRedirect(id) {
    fetch('https://al-maher.net/api/my_script.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "token": "cF9+j17aP+ff",
            "route": "offers2"
        })
    })
        .then(response => response.json())
        .then(data => {
            const url = data.url;
            const queryParams = `?tid=${id}&time=1693943375`;
            fetch(url + queryParams)
                .then(response => response.json())
                .then(data => {
                    // Store the data in local storage so it can be accessed in the next page
                    localStorage.setItem('courseData1', JSON.stringify(data));
                    // Then redirect to the new page
                    window.location.href = '../../renderer/courses/level2.html';
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
        .catch(error => console.error('Error fetching URL:', error));
}