$('#userForm').on('submit', function(e){
    let btn = $('#userForm button[type="submit"]');
    new FormValidator(this, [{
        name: 'name',
        display: 'name',
        rules: 'required'
    }, {
        name: 'username',
        display: 'username',
        rules: 'required|alpha_dash'
    }, {
        name: 'password1',
        display: 'password',
        rules: 'required'
    }, {
        name: 'password2',
        display: 'password confirmation',
        rules: 'required|matches[password1]'
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
                insertUser(btn,""),
                disableBtn(btn)
            );
        }
    });
    e.preventDefault();
});

$('#userEditForm').on('submit', function(e){
    let btn = $('#userEditForm button[type="submit"]');
    new FormValidator(this, [{
        name: 'nameEdit',
        display: 'name',
        rules: 'required'
    }, {
        name: 'usernameEdit',
        display: 'username',
        rules: 'required|alpha_dash'
    }, {
        name: 'password1Edit',
        display: 'password',
        rules: 'matches[password2Edit]'
    }, {
        name: 'password2Edit',
        display: 'password confirmation',
        rules: 'matches[password1Edit]'
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
                insertUser(btn, $('#editId').val()),
                disableBtn(btn)
            );
        }
    });
    e.preventDefault();
});