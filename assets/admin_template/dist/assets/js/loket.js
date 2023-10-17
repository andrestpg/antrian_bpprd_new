const columns = [
    {title: "#"},
    {title: "No Loket"},
    {title: "Staff"},
    {title: "Layanan"},
    {title: "Operasi"},
];

const getData = () => {
    $('#targetContent').html(loader);
    const url = `/loket/get?${performance.now()}`;
    let dataset = [];
    $.get(url).done((res) => {
        $.each(res, (i, dt) => {
            let name = 'Deleted';
            dt.user != null && (name = dt.user.name)
            i += 1;
            data = [
                i, 
                `<p class="font-weight-bold text-primary m-0">${dt.noLoket}</p>`, 
                name,
                dt.layanan.nama, 
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
                    <button type="button" onclick="delConfirm('loket','${id}')" data-id="${id}" class="btn btn-light btn-sm" data-toggle="tooltip" data-placement="top" title="Delete">
                        <i class="h5 mdi mdi-trash-can text-danger"></i>
                    </button>
                </div>`
    return opr;
}

const insertData = (btn, id) => {
    hideAlert();

    let url = `/loket/add`, modal = "#modelId", optName = '';
    id != "" && (url = `/loket/edit/${id}`, modal = "#editModal", optName = '_edit');

    const noLoket = $(`#no_loket${optName}`).val(),
        user = $(`#user${optName} option:selected`).val(),
        layananId = $(`#layanan${optName} option:selected`).val();

    $.post(url, { 
        noLoket, 
        user, 
        layananId, 
    }).done((res) => {
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
    let id =  $(e.relatedTarget).data('id')
    $('#editId').val(id);
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
        await $.get(`/loket/get_one/${id}`).done((res) => {
            $('#no_loket_edit').val(res.noLoket);
            $('#layanan_edit').val(res.layanan.id);
            $('#user_edit').html('');
            if(res.user){
                $('#user_edit').append(`<option value="${res.user.id}" selected>${res.user.name}</option>`)
            }
        });

        await $.get(`/loket/get_not_registered`).done((res) => {
            for(const staff of res){
                try{
                    $('#user_edit').append(`<option value="${staff.id}">${staff.name}</option>`)
                }catch(err){
                    console.log(err);
                }
            }
        });
        
        $('.loader-modal').addClass('hide');
        $('#userEditForm').removeClass('hide');
    }catch(err){
        console.log(err);
    }
});