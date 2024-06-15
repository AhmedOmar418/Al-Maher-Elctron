const {ipcRenderer} = require('electron')

function clearDataAndGoBack() {
    localStorage.removeItem('courseData2'); // Clear the data
    window.history.back(); // Go back
}
document.getElementById('signOutIcon').addEventListener('click', () => {
    ipcRenderer.send('close-app')
});

document.addEventListener('DOMContentLoaded', () => {
    const courseData = JSON.parse(localStorage.getItem('courseData2')); // Retrieve course data from local storage
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
    // Call your API here using the id
    // After the API call is done, redirect to the new page
    fetch('https://al-maher.net/api/get_level1_data_ids.php?tid=' + id)
        .then(response => response.json())
        .then(data => {
            // Store the data in local storage so it can be accessed in the next page
            localStorage.setItem('courseData3', JSON.stringify(data));
            // Then redirect to the new page
            window.location.href = 'level4.html';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}