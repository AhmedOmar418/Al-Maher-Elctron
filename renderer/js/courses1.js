const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');

document.getElementById('signOutIcon').addEventListener('click', () => {
    ipcRenderer.send('close-app')
})
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId'); // Retrieve user id from local storage

    fetch('https://al-maher.net/api/get_myCourse.php?tid=' + userId + '&time=1693943375', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
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
                };
                img.alt = "Course image";


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
        })
        .catch(error => {
            Swal.fire({
                title: 'تنبيه',
                text: 'ليس لديك دورات متاحة',
                icon: 'error',
                confirmButtonText: 'رجوع',
                preConfirm: () => {
                    // Redirect to home page
                    window.location.href = '../../renderer/home/index.html'; // Replace 'path_to_home_page' with the actual path to your home page
                }
            });
        });
});

function callApiAndRedirect(id) {
    // Call your API here using the id
    // After the API call is done, redirect to the new page
    fetch('https://al-maher.net/api/get_level1_data_ids.php?tid=' + id)
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
}