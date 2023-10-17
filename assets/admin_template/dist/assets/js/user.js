const columns = [
    {title: "#"},
    {title: "Nama"},
    {title: "Username"},
    {title: "Role"},
    {title: "Operasi"},
];

const getData = () => {
    $('#targetContent').html(loader);
    const url = `/users/get`;
    let dataset = [];
    $.get(url).done((res) => {
        $.each(res, (i, dt) => {
            i += 1;
            let role = "Staff";
            dt.role == 1 && (role = "Admin");
            data = [i, `<p class="font-weight-bold text-primary m-0">${dt.name}</p>`, dt.username, role,  generateOpr(dt.id, dt.name, dt.username, dt.role)];
            dataset.push(data);
        });
    }).fail(() => {
        $('#targetContent').html('<p class="text-center">Gagal Memuat Data</p>');
    }).then(() => {
        targetContent().then((mess) => {mess == "success" && showData(dataset)});
    });
}

const generateOpr = (id, name, username, role) => {
    let opr = "";
    userRole == 1 && (
        opr = `<div class="btn-group" role="group">
                    <button type="button" data-id="${id}" class="edit-btn btn btn-light btn-sm" data-toggle="modal" data-target="#editModal" data-id="${id}" data-name="${name}" data-username="${username}" data-role="${role}">
                        <i class="h5 mdi mdi-pencil text-success"></i>
                    </button>
                    <button type="button" onclick="delConfirm('users','${id}')" data-id="${id}" class="btn btn-light btn-sm" data-toggle="tooltip" data-placement="top" title="Delete">
                        <i class="h5 mdi mdi-trash-can text-danger"></i>
                    </button>
                </div>`
    );
    return opr;
}

const insertUser = (btn, id) => {
    hideAlert();

    let url = `/users/add`, modal = "#modelId", optName = '';
    id != "" && (url = `/users/edit/${id}`, modal = "#editModal", optName = 'Edit');

    let name = $(`#name${optName}`).val(),
        username = $(`#username${optName}`).val(),
        role = $(`:radio[name="role${optName}"]:checked`).val();
        console.log(role);
    $.post(url, {
        name: name,
        username: username,
        password: $(`#password1${optName}`).val(),
        role: role,
    }).done((res) => {
        if(res.status == 1) {
            
            changeTextBtn(btn, "Data Terkirim");
            hideLoadingBtn(btn);

            setTimeout(() => {
                $(modal).modal('toggle');
                changeTextBtn(btn, "Submit");
                enableBtn(btn);
                id == "" ? appendData(res.resId, name, username, role) : getData();
            },1000);
        }else{

            showAlert(res.desc),
            btn.prop('disabled', false)

        }
    }).fail((res) => {
        showAlert(res.responseJSON.desc);
        hideLoadingBtn(btn);
        setTimeout(() => {
            changeTextBtn(btn, "Submit");
            enableBtn(btn);
        },1000)
    });
};

const appendData = (id, name, username, role) => {
    let roleText = "Admin";
    role != 0 && (roleText = "Superadmin");
    myTable.row.add([ myTable.rows().count()+1, `<p class="font-weight-bold text-primary m-0">${name}</p>`, username, roleText,  generateOpr(id, name, username)]).draw().node();
}

$('#editModal').on('show.bs.modal', (e) => {
    let id =  $(e.relatedTarget).data('id')
    $('#editId').val(id);

    clearUserForm();
    hideAlert();
    enableSubmitBtn();
});

$('#editModal').on('shown.bs.modal', (e) => {
    let btn = $(e.relatedTarget);
    let id = btn.data('id');
    let name = btn.data("name");
    let username = btn.data("username");
    let role = btn.data('role');
    let roleId = 1;
    role == 1 && (roleId = 2);

    $('#userEditForm').attr('data-id', id);
    $('#userEditForm .form-group #nameEdit').val(name);
    $('#userEditForm .form-group #usernameEdit').val(username);
    $(`#userEditForm .form-group #roleEdit${roleId}`).prop('checked', true);
});