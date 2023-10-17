
const socket = io();

// $('#currentText').on('change', () => {
//     if($('#currentText').html() != 0){
//         $('#callBtn').prop('disabled', false)
//     }

// })

socket.on("nextAntrian", async function (msg) {
    console.log('next antrian emit')
    try {
        const noAntrianText = msg.noAntrian;
        $(`.loket-${msg.loketId} .no-antrian-text`).html(noAntrianText);
        $(`.loket-${msg.loketId} .loket-curr-value`).val(getAntrianNumb(res.noAntrian));
    } catch (err) {
        console.log(err);
    }
});

$('.next-btn').on('click', async function() {
    const loketId = $(this).data('id')
    $(this).prop('disabled', true);
    $(this).html(`<div class="loader loader-light"></div>`);
    $(`.loket-${loketId} .alert.antrian-alert`).addClass('hide');
    const currValue = $(`.loket-${loketId} .loket-curr-value`).val();
    getNextAntrian(loketId, currValue);
});

const getNextAntrian = async (loketId, currValue) => {
    try{
        const layananId = $(`.loket-${loketId}`).data('layanan_id')
        const kodeAntrian = $(`.loket-${loketId}`).data('kodeantrian')
        $.get(`/publik/next_antrian/${layananId}/${loketId}`).done( async (res) => {
            if(res.status == 1){
                const noAntrianText = `${kodeAntrian}-${res.noAntrian}`;
                $(`.loket-${loketId} .loket-curr-value`).val(res.noAntrian);
                $(`.loket-${loketId} .no-antrian-text`).html(noAntrianText);
                $(`.loket-${loketId} .call-btn`).prop('disabled', false)
                socket.emit('nextAntrian', {
                    noAntrian: noAntrianText,
                    loketId
                });
            }else{
                setTimeout(() => {
                    $(`.loket-${loketId} .alert.antrian-alert`).removeClass('hide');
                    $(`.loket-${loketId} .alert.antrian-alert .alert-message`).html(res.msg);
                },500);
            }
        }).then(() => {
            setTimeout(() => {
                $(`.loket-${loketId} .next-btn`).html('Selanjutnya');
                $(`.loket-${loketId} .next-btn`).prop('disabled', false);
            },500)
        })
    }catch(err){
        console.log(err);
    }
}

$('.call-btn').on('click', function() {
    const loketId = $(this).data('id')
    const currValue = $(`.loket-${loketId} .loket-curr-value`).val();
    $(`.loket-${loketId} .alert.antrian-alert`).addClass('hide');
    if(currValue != 0){
        $(this).prop('disabled', true);
        const kodeAntrian = $(`.loket-${loketId}`).data('kodeantrian')
        const noAntrianText = `${kodeAntrian}-${currValue}`;
        socket.emit('callFromAdmin', {
            noAntrian: noAntrianText,
            loketId
        });
        setTimeout(() => {
            $(this).prop('disabled', false);
        },4000);
    }
});

const getAntrianNumb = (noAntrian) => {
    let result = 0;
    if(typeof noAntrian === 'string'){
        const arrString = noAntrian.split('-');
        const numb = parseInt(arrString[1]);
        !isNaN(numb) && (result = numb);
        console.log(result)
    }else{
        result = noAntrian
    }
    return result
}