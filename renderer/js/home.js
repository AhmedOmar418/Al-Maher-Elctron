const { ipcRenderer } = require('electron')

document.getElementById('signOutIcon').addEventListener('click', () => {
    ipcRenderer.send('close-app')
})

const { shell } = require('electron')
document.getElementById('whatsappLink').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default action
    let phoneNumber = "00962797848483";
    let message = encodeURIComponent("السلام عليكم أريد طلب بطاقة");
    let url = `https://wa.me/${phoneNumber}?text=${message}`;
    shell.openExternal(url);
})

document.getElementById('facebookLink').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default action
    let url = `https://www.facebook.com/538791984160744`; // Replace with your Facebook page URL
    shell.openExternal(url);
})

document.getElementById('externalLink').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default action
    let url = event.target.href; // Get the URL from the href attribute
    shell.openExternal(url);
})

document.addEventListener('DOMContentLoaded', function() {
    fetchSliderData();
});

function fetchSliderData() {
    const userId = localStorage.getItem('userId');
    ipcRenderer.send('print-message3',userId);
    fetch('http://al-maher.net/api/get_slider.php')
        .then(response => response.json())
        .then(data => {
            clearExistingCarouselItems();
            createAndAppendCarouselItems(data.rows);
        })
        .catch(error => console.error('Error fetching slider data:', error));
}

function clearExistingCarouselItems() {
    const carouselInner = document.querySelector('.carousel-inner');
    while (carouselInner.firstChild) {
        carouselInner.removeChild(carouselInner.firstChild);
    }
}

function createAndAppendCarouselItems(items) {
    const carouselInner = document.querySelector('.carousel-inner');
    items.forEach((item, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '');
        const img = document.createElement('img');
        img.src = item.field_slider_image;
        img.className = 'd-block w-100';
        img.alt = item.title;
        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('loginLink');
    loginLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default link behavior
        const url = e.target.getAttribute('href'); // Get the URL to navigate to
        window.location.href = url; // Navigate to the URL
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('signupLink');
    loginLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default link behavior
        const url = e.target.getAttribute('href'); // Get the URL to navigate to
        window.location.href = url; // Navigate to the URL
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    const loginSignupDiv = document.querySelector('#login-signup');
    const profileDiv = document.querySelector('#profile');

    if (userName && userId) {
        // If userName and userId exist in local storage, hide the login/signup div and show the profile div
        loginSignupDiv.style.display = 'none';
        profileDiv.style.display = 'flex';
    } else {
        // If userName and userId do not exist in local storage, show the login/signup div and hide the profile div
        loginSignupDiv.style.display = 'flex';
        profileDiv.style.display = 'none';
    }
});

