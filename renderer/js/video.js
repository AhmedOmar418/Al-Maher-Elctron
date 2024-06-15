const { ipcRenderer } = require('electron');
document.getElementById('signOutIcon').addEventListener('click', () => {
    ipcRenderer.send('close-app')
});

document.addEventListener('DOMContentLoaded', () => {
    const lessonVideo = JSON.parse(localStorage.getItem('lessonVideo'));
    const container = document.getElementById('container');

    let videoElement;
    if (lessonVideo['rows'][0]["viemo"] !== 'no_data') {
        videoElement = document.createElement('video');
        videoElement.className = "imViedo";
        videoElement.id = "imViedo2";
        videoElement.controls = true;
        videoElement.setAttribute('disablePictureInPicture', '');
        videoElement.setAttribute('crossorigin', '');
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('controls', '');

        if(Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(lessonVideo['rows'][0]["viemo"]);
            hls.attachMedia(videoElement);

            const defaultOptions = {};

            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                const availableQualities = hls.levels.map((l) => l.height)

                defaultOptions.quality = {
                    default: availableQualities[0],
                    options: availableQualities,
                    forced: true,
                    onChange: (e) => updateQuality(e),
                }

                const player = new Plyr(videoElement, defaultOptions);
                videoElement.play();
            });

            window.hls = hls;
        } else {
            const player = new Plyr(videoElement);
            videoElement.play();
        }

        container.appendChild(videoElement);
    }else if (lessonVideo['rows'][0]["dyntub"] !== 'no_data'){
        videoElement = document.createElement('video');
        videoElement.className = "imViedo";
        videoElement.id = "imViedo2";
        videoElement.controls = true;
        videoElement.setAttribute('disablePictureInPicture', '');
        videoElement.setAttribute('crossorigin', '');
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('controls', '');

        if(Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(lessonVideo['rows'][0]["dyntub"]);
            hls.attachMedia(videoElement);

            const defaultOptions = {};

            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                const availableQualities = hls.levels.map((l) => l.height)

                defaultOptions.quality = {
                    default: availableQualities[0],
                    options: availableQualities,
                    forced: true,
                    onChange: (e) => updateQuality(e),
                }

                const player = new Plyr(videoElement, defaultOptions);
                videoElement.play();
            });

            window.hls = hls;
        } else {
            const player = new Plyr(videoElement);
            videoElement.play();
        }

        container.appendChild(videoElement);
    }else {
        videoElement = document.createElement('div');
        videoElement.className = "text-center";

        const h3 = document.createElement('h3');
        h3.textContent = "لم يتم تحميل الفيديو بعد يرجي التواصل مع خدمة العملاء 0797848483";

        videoElement.appendChild(h3);
        container.appendChild(videoElement);

    }

    function updateQuality(newQuality) {
        window.hls.levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
                console.log("Found quality match with " + newQuality);
                window.hls.currentLevel = levelIndex;
            }
        });
    }
});