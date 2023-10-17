const loader = $('#loader').html();
const noData = $('#noData').html();
const errData = $('#errData').html();
let minDate, maxDate;

document.addEventListener('DOMContentLoaded', () => {
    getData();
});

$('a#reload').on('click', function() {
    if(myTable){
        myTable.clear().destroy();
    }
    getData();
});

$('#searchDropdown').on('shown.bs.dropdown' , () => {
    $('#searchMobile').focus();
});

$('#searchDesktop, #searchMobile').on('keypress', (e) => {
    e.keyCode == 13 && e.preventDefault();
});

const showData = async (data) => {
    // $.fn.dataTable.moment('llll');
    globalThis.myTable = $('#datatable').DataTable({
        data: await data,
        retrieve: true,
        deferRender: true,
        columns: columns
    });

    $('#searchDesktop, #searchMobile').on( 'keyup', function () {
        myTable.search(this.value ).draw();
    });
};

const getDate = (date) => {
    let dateParsing = moment(date).format('LL');
    return dateParsing;
}

const targetContent = () => {
    return new Promise( async (res, rej) => {
        await $('#targetContent').html(`
            <div class="table-responsive mb-0 py-3 px-1" data-pattern="priority-columns">
                <table class="table table-striped table-centered" id="datatable">
                </table>
            </div>
        `);
        setTimeout(() => {
            res("success");
        },500);
    });

}


const delConfirm = (name, id) => {
    Swal.queue([
        {
            title: "Hapus Data",
            text: "Apakah anda yakin ingin menghapus data ini?",
            icon: "warning",
            showCancelButton: !0,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#3051D3",
            cancelButtonColor: "#505d69",
            allowOutsideClick: false,
            closeOnClickOutside: false,
            showLoaderOnConfirm: !0,
            preConfirm: () => {
                    return new Promise((e) =>  {
                        setTimeout(() => {
                            $.get(`/${name}/delete/${id}`).done((res) => {
                                if(res.status == 1){
                                    $('#detailModal').modal('hide');
                                    Swal.fire({
                                        title: "Berhasil",
                                        text: "Data berhasil dihapus!",
                                        icon: "success",
                                        confirmButtonText: "OK",
                                        confirmButtonColor: "#3051D3",
                                    }).then(() => {
                                        myTable.row($(`button[data-id="${id}"]`).parents('tr')).remove().draw()
                                    })
                                }else{
                                    Swal.fire({
                                        title: "Gagal",
                                        text: res.msg,
                                        icon: "error",
                                        confirmButtonText: "OK",
                                        confirmButtonColor: "#3051D3",
                                    });
                                }
                            }).catch(err => {
                                Swal.fire({
                                    title: err.status,
                                    text: err.statusText,
                                    icon: "error",
                                    confirmButtonText: "OK",
                                    confirmButtonColor: "#3051D3",
                                });
                            })
                        }, 500);
                    });
                },
            },
      ])
}

$('#modelId').on('show.bs.modal', function(e){
    clearUserForm();
    hideAlert();
    enableSubmitBtn();
});

const clearUserForm = () => {
    $('.form-control').removeClass('is-invalid').val('');
}

const showAlert = (msg) => {
    $('.alert').removeClass('hide');
    $('.err-message').html(msg);
}

const hideAlert = () => {
    $('.alert').addClass('hide');
}

const enableSubmitBtn = () => {
    $('button[type="submit"]').prop('disabled', false);
}

const disableBtn = (btn) => {
    btn.prop('disabled', true);
    showLoadingBtn(btn);
    changeTextBtn(btn, "Mengirim");
}

const enableBtn = (btn) => {
    btn.prop('disabled', false);
    hideLoadingBtn(btn);
    changeTextBtn(btn, "Submit");
}

const showLoadingBtn = (btn) => {
    let loaderWrapper = btn.children('.loader-wrapper');
    loaderWrapper.removeClass('hide');
}

const hideLoadingBtn = (btn) => {
    let loaderWrapper = btn.children('.loader-wrapper');
    loaderWrapper.addClass('hide');
}

const changeTextBtn = (btn, string) => {
    let loaderText = btn.children('span');
    loaderText.html(string);

}