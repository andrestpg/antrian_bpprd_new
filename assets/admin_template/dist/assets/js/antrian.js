const socket = io();
const getData = 0;
let currentVal = 0;
const userLoketId = $('#userLoket').data('id');
const userLayananId = $('#userLoket').data('layanan_id');
const userLoketNumb = $('#userLoket').data('numb');
const userLoketKodeAntrian = $('#userLoket').data('kodeantrian');

window.addEventListener('DOMContentLoaded', () => {

    const lastAntrian = $('#currentText').html().split('-');
    currentVal = parseInt(lastAntrian[1]);
    console.log($('#currentText').html())
    if($('#currentText').html() == 0){
        $('#callBtn').prop('disabled', true)
    }
})

socket.on("nextAntrian", async function (msg) {
    console.log('next antrian emit')
    try {
        if(userLoketId === msg.loketId){
            const noAntrianText = msg.noAntrian;
            $('#currentText').html(noAntrianText);
            currentVal = getAntrianNumb(res.noAntrian);
        }
    } catch (err) {
        console.log(err);
    }
});

$('#currentText').on('change', () => {
    if($('#currentText').html() != 0){
        $('#callBtn').prop('disabled', false)
    }

})

$('#nextBtn').on('click', async function() {
    $(this).prop('disabled', true);
    $(this).html(`<div class="loader loader-light"></div>`);
    $('.alert.antrian-alert').addClass('hide');
    getNextAntrian($(this));
});

const getNextAntrian = async (btn) => {
    try{
        $.get(`/publik/next_antrian/${userLayananId}/${userLoketId}`).done( async (res) => {
            if(res.status == 1){
                currentVal = res.noAntrian;
                const noAntrianText = userLoketKodeAntrian +'-'+ res.noAntrian;
                $('#currentText').html(noAntrianText);
                $('#callBtn').prop('disabled', false)
                socket.emit('nextAntrian', {
                    noAntrian: noAntrianText,
                    loketId: userLoketId
                });
            }else{
                setTimeout(() => {
                    $('.alert.antrian-alert').removeClass('hide');
                    $('.alert.antrian-alert .alert-message').html(res.msg);
                },500);
            }
        }).then(() => {
            setTimeout(() => {
                btn.html(`Selanjutnya`);
                btn.prop('disabled', false);
            },500)
        })
    }catch(err){
        console.log(err);
    }
}

$('#callBtn').on('click', function() {
    if(currentVal != 0){
        $('.alert.antrian-alert').addClass('hide');
        $(this).prop('disabled', true);
        const noAntrianText = userLoketKodeAntrian +'-'+ currentVal;
        socket.emit('callFromAdmin', {
            noAntrian: noAntrianText,
            loketId: userLoketId
        });
        setTimeout(() => {
            $(this).prop('disabled', false);
        },4000);
    }
});

const getNoAntrian = (noLoket, noAntrian) => {
    noAntrian = noAntrian+'';
    return `${getAntrianPrefix(noLoket)}-${noAntrian}`
}

const getAntrianPrefix = (i) => {
    console.log(i)
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    return alphabet[i-1]
}

const getAntrianNumb = (noAntrian) => {
    let result = '';
    if(noAntrian.length >= 4){
        const arrString = noAntrian.split('-');
        const numb = arrString[1];
        numb[0] != '0' ? (result = numb.slice(1,1)) : (result = numb);
        console.log(result)
    }else{
        result = noAntrian
    }
    return parseInt(result)
}