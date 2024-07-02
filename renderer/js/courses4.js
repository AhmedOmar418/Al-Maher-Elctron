const {ipcRenderer} = require('electron')
const Swal = require("sweetalert2");
require('dotenv').config();
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
        btn.textContent = "تشغيل الفيديو";


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
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block'; // Show the spinner
    fetch('https://al-maher.net/api/my_script.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "token": "cF9+j17aP+ff",
            "route": "courses4"
        })
    })
        .then(response => response.json())
        .then(data => {
            const url = data.url;
            const queryParams = `?tid=${id}`;
            fetch(url + queryParams)
                .then(response => response.json())
                .then(data => {
                    spinner.style.display = 'none'; // Hide the spinner

                    if (data.rows && data.rows.msg === '0') {
                        Swal.fire({
                            title: 'حدث خطأ ما',
                            text: 'يبدوا أنه لا تتوفر بيانات لهذه الدورة أو حدث خطأ ما يرجي التواصل مع الدعم الفني ',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        ipcRenderer.send('print-message3', 'viiididddddddd');
                        ipcRenderer.send('print-message3', data);

                        // Store the data in local storage so it can be accessed in the next page
                        localStorage.setItem('lessonVideo', JSON.stringify(data));
                        // Then redirect to the new page
                        window.location.href = 'video.html';
                    }



                })
                .catch(error => {
                    spinner.style.display = 'none'; // Hide the spinner

                    console.error('Error:', error);
                    Swal.fire('حدث خطأ ما  ', ' يرجي المحاولة مجددا أو تواصل مع الدعم الفني ', 'error');

                });
        })
        .catch(error => {
            spinner.style.display = 'none'; // Hide the spinner
            console.error('Error:', error);
            Swal.fire('حدث خطأ ما  ', ' يرجي المحاولة مجددا أو تواصل مع الدعم الفني ', 'error');

        });
}