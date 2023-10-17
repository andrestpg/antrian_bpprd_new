$('#userForm').on('submit', function(e){
    let btn = $('#userForm button[type="submit"]');
    new FormValidator(this, [{
        name: 'no_loket',
        display: 'no_loket',
        rules: 'required|number'
    }, {
        name: 'kode_layanan',
        display: 'kode_layanan',
        rules: 'required'
    }, {
        name: 'user',
        display: 'user',
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
        name: 'no_loket_edit',
        display: 'no_loket_edit',
        rules: 'required|number'
    }, {
        name: 'kode_antrian_edit',
        display: 'kode_antrian_edit',
        rules: 'required'
    }, {
        name: 'user_edit',
        display: 'user_edit',
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