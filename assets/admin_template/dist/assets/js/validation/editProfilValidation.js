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
        rules: 'matches[password2]'
    }, {
        name: 'password2',
        display: 'password confirmation',
        rules: 'matches[password1]'
    }], function(errors, event) {
        if(errors.length >= 1){
            $('.form-control').removeClass('is-invalid');
            $.each(errors, (i, dt) => {
                i == 0 && $(`#${errors[i].id}`).focus(); 
                $(`#${errors[i].id}`).addClass('is-invalid');
            });
        }else{
            event.isTrusted == true && (postEditProfil(btn), disableBtn(btn));
        }
    });
    e.preventDefault();
});