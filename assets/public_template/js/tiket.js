const socket = io();

$(".tiket-button").on("click", function () {
    $('.tiket-button').prop('disabled', true);
    showLoading($(this));
    const layananId = $(this).data("id");
    const kodeLayanan = $(this).data("layanan");
    const defaultHTML = $(this).children("p").html();

    $.get(`/publik/daftar_antrian/${layananId}`)
        .done((res) => {
            const noAntrianText = res.kodeAntrian + '-' + res.noAntrian
            if (res.status == 1) {
                setTimeout(async () => {
                    hideLoading($(this));
                    initAntrian(res.loketId, res.noAntrian);
                    $(this).children("p").html(`<span class="text-2xl font-bold">${noAntrianText}</span>`);
                    printTiket(noAntrianText, kodeLayanan, res.noLoket)
                }, 1000);
                setTimeout(() => {
                    $(this).children("p").html(defaultHTML);
                }, 2000);
            } else {
                setTimeout(() => {
                    hideLoading($(this));
                    $(this).children("p").html(res.msg);
                }, 1000);
                setTimeout(() => {
                    $(this).children("p").html(defaultHTML);
                }, 2000);
            }
        })
        .fail(() => {
            setTimeout(() => {
                $(this).children("p").html("Gagal terhubung ke server!");
                hideLoading($(this));
            }, 1000);
            setTimeout(() => {
                $(this).children("p").html(defaultHTML);
            }, 2000);
        })
        .always(() => {
            setTimeout(() => {
                $('.tiket-button').prop("disabled", false);
            }, 2000);
        })
});

const initAntrian = (loketId, noAntrian) => {
    socket.emit("addAntrian", {
        noAntrian: noAntrian,
        loketId: loketId,
    });
};

const showLoading = (btn) => {
    btn.addClass("loading");
    btn.children("p").addClass("hidden");
};

const hideLoading = (btn) => {
    btn.removeClass("loading");
    btn.children("p").removeClass("hidden");
};

const printTiket = (noAntrian, kodeLayanan, noLoket) => {
    moment().locale('id');
    const now = moment().format('LL');
    const time = moment().format('LT');
    $('#noAntrianPrint').html(noAntrian)
    $('#layananPrint').html(kodeLayanan)
    $('#loketPrint').html(noLoket) 
    $('#datePrint').html(now) 
    $('#timePrint').html(time) 
    window.print()
}

$('.loket-menu-wrapper .loket-menu-button').each(function(i) {
    $(this).on('click', () => {
        setActiveButton(i)
        setActiveTab(i)
    })
})

const setActiveButton = (index) => {
    $('.loket-menu-wrapper .loket-menu-button').each( function(i) {
        i == index ? $(this).addClass('active') : $(this).removeClass('active')
    })
}

const setActiveTab = (index) => {
    $('.loket-tab-wrapper .card-antrian').each( function(i) {
        i == index ? $(this).removeClass('hidden') : $(this).addClass('hidden')
    })
}