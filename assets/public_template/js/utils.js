moment.locale('id');

$('.date').html(moment().format('LL'))

const updateTime = () => {
    const now = moment().format('H:mm:ss');
    const time = now.split(':')

    $('.countdown-hour>span').css('--value', time[0])
    $('.countdown-min>span').css('--value', time[1])
    $('.countdown-sec>span').css('--value', time[2])
}

setInterval(updateTime, 1000);

const getNoAntrianText = (_noLoket, _noAntrian) => {
    _noAntrian = _noAntrian+'';
    return `${getNoAntrianPrefix(_noLoket)}-${_noAntrian}`
}

const getNoAntrianPrefix = (i) => {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    return alphabet[i-1]
}

const getNoAntrianNumb = (_noAntrian) => {
    let result = _noAntrian
    if(typeof _noAntrian == 'string'){
        const arrString = _noAntrian.split('-');
        result = arrString[1];
    }
    return parseInt(result)
}

function dec2hex (dec) {
    return dec.toString(16).padStart(2, "0")
}

const generateHash = () => {
    const arr = new Uint8Array(40/ 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}