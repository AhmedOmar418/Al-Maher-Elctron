const { ipcRenderer } = require('electron')
const Swal = require("sweetalert2");
require('dotenv').config();
function clearDataAndGoBack() {
    localStorage.removeItem('courseData4'); // Clear the data
    window.history.back(); // Go back
}
document.getElementById('signOutIcon').addEventListener('click', () => {
    ipcRenderer.send('close-app')
})

document.addEventListener('DOMContentLoaded', () => {
    const courseData = JSON.parse(localStorage.getItem('courseData4')); // Retrieve course data from local storage

    ipcRenderer.send('print-message3',courseData)
    // Assuming courseData is an array of courses
    const container = document.getElementById('container');

    courseData.rows.forEach(course => {
        const card = document.createElement('div');
        card.className = "card m-3 border-0";
        card.style.width = "24rem";

        const link = document.createElement('a');
        link.draggable = false;
        link.href = ""; // Replace with the correct URL

        link.addEventListener('click', (event) => {
            event.preventDefault();
            callApiAndRedirect(course.tax_tid);
        });

        const img = document.createElement('img');
        img.className = "card-img-top";
        img.src = course.tax_image ? course.tax_image : '../../assets/dfi.png';
        img.onerror = function() {
            this.src = '../../assets/dfi.png'; // Set the source to the default image on error
        }; // Replace 'default_image_url' with the actual URL of your default image
        img.alt = "Course image";


        img.addEventListener('click', (event) => {
            event.preventDefault();
            callApiAndRedirect(course.tax_tid);
        });

        const cardBody = document.createElement('div');
        cardBody.className = "card-body";

        const innerDiv = document.createElement('div');
        innerDiv.className = "col-12 col-md-12 col-lg-12 mx-auto";

        const titleLink = document.createElement('a');
        titleLink.href = ""; // Replace with the correct URL
        titleLink.style.textDecoration = "none !important"; // Add !important to override other styles


        titleLink.addEventListener('click', (event) => {
            event.preventDefault();
            callApiAndRedirect(course.tax_tid);
        });

        const title = document.createElement('h6');
        title.className = "card-title text-center";
        title.style.textDecoration = "none";
        title.style.fontWeight = "bold";
        title.textContent = course.tax_name; // Use the actual course name

        const btn = document.createElement('a');
        btn.draggable = false;
        btn.href = ""; // Replace with the correct URL
        btn.style.textDecoration = "none";
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

const userId = localStorage.getItem('userId');
ipcRenderer.send('print-message3',userId)
if (userId) {
    function callApiAndRedirect(id) {
        // Get the user_id from local storage
        const userId = localStorage.getItem('userId');
        ipcRenderer.send('print-message3',userId)

        // Fetch the user's courses
        fetch('https://al-maher.net/api/my_script.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "token": "cF9+j17aP+ff",
                "route": "teachers",
                "user_id": userId
            })
        })
            .then(response => response.json())
            .then(data => {
                const url = data.url;
                const queryParams = `?tid=${userId}&time=1693943375`;
                fetch(url + queryParams)
                    .then(response => response.json())
                    .then(userCourses => {
                        ipcRenderer.send('print-message3', 'user coursesss')
                        ipcRenderer.send('print-message3', userCourses)
                        ipcRenderer.send('print-message3', id)
                        // Check if userCourses is empty or has the specific response
                        if(userCourses.rows.length > 0 && userCourses.rows.map(item => item.tid.toString()).includes(id.toString())){
                            fetch('https://al-maher.net/api/my_script.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    "token": "cF9+j17aP+ff",
                                    "route": "courses_index2"
                                })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    const url = data.url;
                                    const queryParams = `?tid=${id}&time=1693943375`;
                                    fetch(url + queryParams)
                                        .then(response => response.json())
                                        .then(data => {
                                            ipcRenderer.send('print-message3', 'dataaaaa', data)

                                            // Store the data in local storage so it can be accessed in the next page
                                            localStorage.setItem('courseData', JSON.stringify(data));
                                            // Then redirect to the new page
                                            window.location.href = '../../renderer/user_courses/level2.html';
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
                        }else {
                            // Redirect to a different page
                            localStorage.setItem('selectedTeacherId', id);
                            window.location.href = '../../renderer/card/card.html';
                        }
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
}else{
    window.location.href = '../../renderer/login/index.html';
}