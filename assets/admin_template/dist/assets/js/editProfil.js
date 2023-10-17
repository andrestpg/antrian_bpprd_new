const getData = () => {
}

const postEditProfil = (btn) => {
    hideAlert();
    let id = $('#userId').val();

    let url = `/users/edit_profil/${id}`;
    $.post(url, {
        name: $(`#name`).val(),
        username: $(`#username`).val(),
        password: $(`#password1`).val()
    }).done((res) => {
        if(res.status == 1) {
            
            changeTextBtn(btn, "Profil Berhasil Diubah");
            hideLoadingBtn(btn);

            setTimeout(() => {
                showLoadingBtn(btn);
                changeTextBtn(btn, "Redirecting...");
                location.assign(`/users`);
            },1000);
        }else{
            showAlert(res.desc),
            btn.prop('disabled', false)
        }
    }).fail((res) => {
        showAlert(res.responseJSON.desc);
        hideLoadingBtn(btn);
        changeTextBtn(btn, "Submit");
        enableBtn(btn);
    });
};
