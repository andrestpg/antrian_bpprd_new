// let timeout = {};
let speakList = [];
let speakExecutionList = {};
let loketStatus = {};
let currentVideo = 1;
let selectedVoice = '';
let currentVideoIndex = 10;
const excluded = [79, 80, 86]
const delay = 40 * 1000;
const socket = io();

const player = videojs('videojs');
const tune = videojs('notification');

if ("speechSynthesis" in window) {
    globalThis.antrianSynth = window.speechSynthesis;
}

window.onload = async () => {
    initRunText();
    tune.src({ type: 'video/mp4', src: '/public_template/audio/notification.mp4' });
    
    const videoList = await getVideo()
    player.src(videoList[currentVideoIndex]);
    player.ready(() => player.play())
    player.on('ended', (a) => {
        const videoLength = videoList.length;
        currentVideoIndex = currentVideoIndex + 1; 
        let videoSrc = videoList[currentVideoIndex]
        if(!videoSrc){
            currentVideoIndex = 0; 
            videoSrc = videoList[currentVideoIndex]
        }
        player.src(videoSrc);
        player.ready(() => player.play())
    });

    setTimeout(() => {
        document.getElementById('webSpeechConfirm').checked = true
        $('label[for="webSpeechConfirm"]').focus()
    }, 2000);
}

$('label[for="webSpeechConfirm"]').on("click", function () {
    $(".confirm-overlay").addClass("visually-hidden");
    const loket = $(".card-loket-status");
    $.each(loket, async function (i, data) {
        let loketId = $(this).data("id");
        await getNextAntrian(loketId);
    });
});

$(document).on('keypress', (e) => {
    if ($('label[for="webSpeechConfirm"]:focus')) {
        $('label[for="webSpeechConfirm"]').click()
    }
})

socket.on("nextAntrian", async function (msg) {
    try {
        const noLoket = $(`.loket${msg.loketId}`).data("numb");
        $(`.loket${msg.loketId} .loket-numb`).html(msg.noAntrian);
        callClient(msg.noAntrian, noLoket);

        // if(!excluded.includes(msg.loketId)){
        //     timeout[`timeout${msg.loketId}`] = setTimeout(() => {
        //         getNextAntrian(msg.loketId);
        //     }, delay);
        // }
    } catch (err) {
        console.log(err);
    }
});

socket.on("callFromAdmin", async (msg) => {
    try {
        await clearTimeout(timeout[`timeout${msg.loketId}`]);
        const hash = generateHash();
        const noLoket = await $(`.loket${msg.loketId}`).data("numb");
        $(`.loket${msg.loketId} .loket-numb`).html(msg.noAntrian);
        callClient(msg.noAntrian, noLoket, hash);

        // if(!excluded.includes(msg.loketId)){
        //     timeout[`timeout${msg.loketId}`] = setTimeout(() => {
        //         getNextAntrian(msg.loketId);
        //     }, delay);
        // }
    } catch (err) {
        console.log(err)
    }
});

socket.on("newAntrian", async (msg) => {
    await clearTimeout(timeout[`timeout${msg.loketId}`]);
    const standByLoket = getStandByLoket(msg.layananId)

    if (standByLoket.length > 0) {
        const loketId = standByLoket[0]
        loketStatus[`loket${loketId}`] = 1;
        getNextAntrian(loketId);
    }
});

const callClient = async (_noAntrianText, _noLoket, hash) => {
    const noAntrianReplace = _noAntrianText.replace("-", "!, ");

    const speakListObject = {
        hash,
        noLoket: _noLoket,
        noAntrian: _noAntrianText,
        speak: `Nomor, antrian, ${noAntrianReplace}. Di loket. ${_noLoket == 18 ? 'K-I-A' : _noLoket}`
    }
    speakList.push(speakListObject);
};

const setActiveLoket = (noLoket, noAntrianText) => {
    $('.noloket-modal').html(noLoket == 18 ? 'KIA' : noLoket);
    $('.noantrian-modal').html(noAntrianText);
    document.getElementById('modalToggle').checked = true
}

let antrianOnCall = '';
let currentHash = '';

setInterval(() => {
    let isSpeaking = antrianSynth.speaking ? true : false;
    if (tune.paused()) {
        if (!isSpeaking && speakList.length > 0) {
            if (antrianOnCall != speakList[0].noAntrian) {
                calling(speakList)
            } else {
                if (typeof speakList[0].hash != 'undefined' && speakList[0].hash != currentHash) {
                    calling(speakList)
                } else {
                    speakList.shift();
                    document.getElementById('modalToggle').checked = false
                }
            }
        }
    }
}, 500)

const calling = async (speakList) => {
    if (tune.paused()) {
        tune.play();
        const speak = new SpeechSynthesisUtterance(speakList[0].speak);
        if (selectedVoice == '') {
            const voices = await getVoices();
            const voiceId = await voices.filter(val => val.lang === 'id-ID');
            const wmnVoice = voiceId.filter( it => it.voiceURI === 'Microsoft Gadis Online (Natural) - Indonesian (Indonesia)')
            if(wmnVoice.length > 0){
                speak.voice = wmnVoice[0]
                selectedVoice = 'P'
            }else{
                speak.voice = voiceId[0]
                selectedVoice = 'L'
            }
        }
        const { noLoket, noAntrian } = speakList[0];
        if(selectedVoice === 'P'){
            speak.rate = 1;
        }else{
            speak.rate = 0.85;
        }
        speak.lang = "id-ID";
        antrianOnCall = speakList[0].noAntrian;
        currentHash = speakList[0].hash;
        tune.one('ended', () => {
            setActiveLoket(noLoket, noAntrian)
            speechSynthesis.speak(speak);
        })
    }
}

const initRunText = () => {
    const runningTextWrapper = document.querySelector(".running-text-wrapper");
    const runningTextWrapperWidth = runningTextWrapper.offsetWidth + 10;
    const runningTextListWidth = document.querySelector(".running-text-list").offsetWidth + 20;
    const totalWidth = runningTextListWidth + runningTextWrapperWidth;

    const runningText = anime({
        targets: ".running-text-list",
        translateX: [runningTextWrapperWidth, -runningTextListWidth], // from 100 to 250
        duration: totalWidth * 20,
        easing: "linear",
        loop: true,
    });

    runningTextWrapper.addEventListener("mouseenter", () => {
        runningText.pause();
    });

    runningTextWrapper.addEventListener("mouseleave", () => {
        runningText.play();
    });
};

const getVoices = async () => {
    const voices = await antrianSynth.getVoices()
    return voices
}

const getNextAntrian = async (loketId) => {
    await clearTimeout(timeout[`timeout${loketId}`]);
    $.get(`/publik/next_antrian/${loketId}`).done(async (res) => {
        if(!loketStatus[`loket${loketId}`]){
            loketStatus[`loket${loketId}`] = 0;
        }

        if (res.status == 1) {
            if(res.noAntrian){
                loketStatus[`loket${loketId}`] = 1;
            }else{
                loketStatus[`loket${loketId}`] = 0;
            }

            const noLoket = $(`.loket${loketId}`).data("numb");
            $(`.loket${loketId} .loket-numb`).html(res.noAntrian);
            const noAntrianText = `${res.loketData.layanan.kodeAntrian}-${res.noAntrian}`
            callClient(noAntrianText, noLoket);
            socket.emit('nextAntrian', {
                noAntrian: noAntrianText,
                loketId: loketId
            });

            if(!excluded.includes(loketId)){
                timeout[`timeout${loketId}`] = setTimeout(() => {
                    getNextAntrian(loketId);
                }, delay);
            }
        }else{
            loketStatus[`loket${loketId}`] = 0;
        }
    }).catch(err => {
        console.log({ err })
        loketStatus[`loket${loketId}`] = 0;
    })
}

const getStandByLoket = (layananId) => {
    let filtered = [], standBy = [];
    const loket = $(".card-loket-status");
    $.each(loket, async function (i, data) {
        const loketLayananId = $(this).data("layananid");
        if(parseInt(loketLayananId) === parseInt(layananId)){
            filtered.push(parseInt($(this).data("id")))
        }
    });
    filtered.forEach(it => {
        if(loketStatus[`loket${it}`] === 0){
            standBy.push(it)
        }
    })
    return standBy
}

const getVideo = async () => {
    try {
        const ytURL = 'https://youtube.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=UCrh5SkN1ruTHJQPlFcyQYtQ&maxResults=20&key=AIzaSyBfPzjYt1_OcUOs_E-67r9wE-v4f0FNvYE';
        const {items} = await $.get(ytURL)
        const result = items.map( it => {
            return { 
                type: 'video/youtube', 
                src: `https://youtu.be/${it.contentDetails.upload.videoId}` 
            }
        })
    
        return result
    } catch (error) {
        return[{type: 'video/youtube', src: 'https://youtu.be/OoF15zxM4Po'}]
    }
}

