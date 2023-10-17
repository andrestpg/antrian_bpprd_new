const columns = [
    {title: "#"},
    {title: "Nama"},
    {title: "Kategori"},
    {title: "Kode Antrian"},
    {title: "Operasi"},
];

const getData = () => {
    $('#targetContent').html(loader);
    const url = `/layanan/get?${performance.now()}`;
    let dataset = [];
    $.get(url).done((res) => {
        $.each(res, (i, dt) => {
            i += 1;
            data = [
                i, 
                `<p class="font-weight-bold text-primary m-0">${dt.nama}</p>`, 
                dt.kategori.nama, 
                dt.kategori.kodeAntrian,
                generateOpr(dt.id)];
            dataset.push(data);
        });
    }).fail(() => {
        $('#targetContent').html('<p class="text-center">Gagal Memuat Data</p>');
    }).then(() => {
        targetContent().then((mess) => {mess == "success" && showData(dataset)});
    });
}

const generateOpr = (id) => {
    let opr = `<div class="btn-group" role="group">
                    <button type="button" data-id="${id}" class="edit-btn btn btn-light btn-sm" data-toggle="modal" data-target="#editModal" data-id="${id}">
                        <i class="h5 mdi mdi-pencil text-success"></i>
                    </button>
                </div>`
    return opr;
}

const insertData = (btn, id) => {
    hideAlert();

    let url = `/layanan/add`, modal = "#modelId", optName = '';
    id != "" && (url = `/layanan/edit/${id}`, modal = "#editModal", optName = '_edit');

    const nama = $(`#nama${optName}`).val(),
        kategoriId = $(`#kategoriId${optName}`).val();

    $.post(url, {nama, kategoriId}).done((res) => {
        changeTextBtn(btn, "Data Terkirim");
        setTimeout(() => {
            $(modal).modal('toggle');
            getData();
        },1000);
    }).fail((res) => {
        showAlert(res.responseJSON.desc);
    }).always(() => {
        setTimeout(() => {
            hideLoadingBtn(btn);
            changeTextBtn(btn, "Submit");
            enableBtn(btn);
        },1000)
    })
};

$('#editModal').on('show.bs.modal', (e) => {
    $('.loader-modal').html() == "" && $('.loader-modal').html(loader);
    $('.loader-modal').removeClass('hide');
    $('#userEditForm').addClass('hide');

    clearUserForm();
    hideAlert();
    enableSubmitBtn();
});

$('#editModal').on('shown.bs.modal', async (e) => {
    let btn = $(e.relatedTarget);
    let id = btn.data('id');
    try{
        await $.get(`/layanan/get_one/${id}`).done((res) => {
            $('#editId').val(id);
            $(`#nama_edit`).val(res.nama);
            $(`#kategoriId_edit`).val(res.kategoriId);
        });
        $('.loader-modal').addClass('hide');
        $('#userEditForm').removeClass('hide');
    }catch(err){
        console.log(err);
    }
});