$('#userForm').on('submit', function(e){
    let btn = $('#userForm button[type="submit"]');
    new FormValidator(this, [{
        name: 'nama',
        display: 'nama',
        rules: 'required'
    }, {
        name: 'kategoriId',
        display: 'kategoriId',
        rules: 'required'
    }], function(errors, event) {
        if(errors.length >= 1){
            $('.form-control').removeClass('is-invalid');
            $.each(errors, (i, dt) => {
                i == 0 && $(`#${errors[i].id}`).focus(); 
                $(`#${errors[i].id}`).addClass('is-invalid');
            });
        }else{
            $('.form-control').removeClass('is-invalid');
            event.isTrusted == true && (
                insertData(btn,""),
                disableBtn(btn)
            );
        }
    });
    e.preventDefault();
});

$('#userEditForm').on('submit', function(e){
    let btn = $('#userEditForm button[type="submit"]');
    new FormValidator(this, [{
        name: 'nama_edit',
        display: 'nama_edit',
        rules: 'required'
    }, {
        name: 'kategoriId_edit',
        display: 'kategoriId_edit',
        rules: 'required'
    }], function(errors, event) {
        if(errors.length >= 1){
            $('.form-control').removeClass('is-invalid');
            $.each(errors, (i, dt) => {
                i == 0 && $(`#${errors[i].id}`).focus(); 
                $(`#${errors[i].id}`).addClass('is-invalid');
            });
        }else{
            event.isTrusted == true && (
                $('.form-control').removeClass('is-invalid'),
                insertData(btn, $('#editId').val()),
                disableBtn(btn)
            );
        }
    });
    e.preventDefault();
});