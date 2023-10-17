const authUser = (username, password) => {
    $('.loader-wrapper').removeClass('hide');
    $('#authBtnText').html('Loging in..');
    hideAlert();
    let saveDevice = 0;
    const remember = $(':checkbox[name="remember"]:checked').val();
    remember !== undefined && (saveDevice = 1);
    setTimeout(() => {
        $.post("/auth/login", {
            username: username,
            password: password,
            saveDevice: saveDevice
        }).done( res => {
            let redirectURL = '/users';
            typeof res.redirectURL !== 'undefined' && (redirectURL = `/${res.redirectURL}`);
            res.status == 1 && ($('#authBtnText').html('Redirecting'),location.assign(redirectURL));
            res.status == 0 && ($('.loader-wrapper').addClass('hide'), $('#authBtnText').html('Log in'), showAlert(res.msg)); 
        });
    },500);
}


const showAlert = (msg) => {
    $('#authAlert').removeClass('hide');
    $('#authAlert span').css('display','inline');
    $('#authAlert span').html(msg);
}

const hideAlert = () => {
    $('#authAlert').addClass('hide');
    $('#authAlert span').css('display','none');
}