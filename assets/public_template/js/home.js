let speakList = [];
let speakExecutionList = {};
let loketStatus = {};
let selectedVoice = '';
const socket = io();

const player = videojs('videojs');

window.onload = () => {
    initRunText();
    player.src( {type: 'video/mp4', src: '/public_template/videos/video1.mp4'} );
    player.ready(() => player.play())
    player.on('ended', (a) => {
        let video = 'video1';
        currentVideo == 1 ? (video = 'video2', currentVideo = 2) : (currentVideo = 1, video='video1')
        player.src( {type: 'video/mp4', src: `/public_template/videos/${video}.mp4`} );
        player.ready(() => player.play())
    });
    setTimeout(() => {
        document.getElementById('webSpeechConfirm').checked = true
        $('label[for="webSpeechConfirm"]').focus()
    }, 2000);
}

$(document).on('keypress', (e) => {
    if($('label[for="webSpeechConfirm"]').is(':focus')){
        $('label[for="webSpeechConfirm"]').click()
    }
})

if ("speechSynthesis" in window) {
    globalThis.antrianSynth = window.speechSynthesis;
}

const getVoices = async () => {
    const voices = await antrianSynth.getVoices()
    return voices
}

socket.on("nextAntrian", async function (msg) {
    try {
        const noLoket = $(`.loket${msg.loketId}`).data("numb");
        $(`.loket${msg.loketId} .loket-numb`).html(msg.noAntrian);
        callClient(msg.noAntrian, noLoket);
    } catch (err) {
        console.log(err);
    }
});

socket.on("callFromAdmin", async (msg) => {
    try{
        const hash = generateHash();
        const noLoket = await $(`.loket${msg.loketId}`).data("numb");
        $(`.loket${msg.loketId} .loket-numb`).html(msg.noAntrian);
        callClient(msg.noAntrian, noLoket, hash);
    }catch(err){
        console.log(err)
    }
});

$(".speak-confirm").on("click", function () {
    $(".confirm-overlay").addClass("visually-hidden");
});

const callClient = async (_noAntrianText, _noLoket, hash) => {

    noAntrianReplace = _noAntrianText;
    noAntrianReplace = noAntrianReplace.replace("-", "!, ");

    const speakListObject = {
        hash,
        noLoket: _noLoket,
        noAntrian: _noAntrianText,
        speak : `Nomor, antrian, ${noAntrianReplace}. Di loket. ${_noLoket == 18 ? 'K-I-A' : _noLoket}`
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
    if(player.paused()){
        if(!isSpeaking && speakList.length > 0){
            if(antrianOnCall != speakList[0].noAntrian){
                calling(speakList)
            }else{
                if(typeof speakList[0].hash != 'undefined' && speakList[0].hash != currentHash){
                    calling(speakList)
                }else{
                    speakList.shift();
                    document.getElementById('modalToggle').checked = false
                }
            }
        }
    }
},500)

const calling = async (speakList) => {
    if(player.paused()){
        player.play();
        const speak = new SpeechSynthesisUtterance(speakList[0].speak);
        if(selectedVoice == ''){
            const voices = await getVoices();
            const voiceId = await voices.filter(val => val.lang === 'id-ID');
            speak.voice = voiceId[0]
        }
        const {noLoket, noAntrian} = speakList[0];
        speak.rate = 0.85;
        speak.lang = "id-ID";
        antrianOnCall = speakList[0].noAntrian;
        currentHash = speakList[0].hash;
        player.one('ended', () => {
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

  