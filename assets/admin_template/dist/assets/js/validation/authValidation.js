$('#authForm').on('submit', function(e){
    let btn = $('#authForm button[type="submit"]');
    new FormValidator(this, [ {
        name: 'username',
        display: 'username',
        rules: 'required|alpha_dash'
    }, {
        name: 'password',
        display: 'password',
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
            event.isTrusted == true && (authUser($('#username').val(), $('#password').val()), btn.prop('disabled', false));
        }
    });
    e.preventDefault();
});
