let inputId = $('#idPendaftaran').val();

const inputEl = document.getElementById('inputFilepond');
const baseUrl = "http://localhost:8888/"

FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,
    FilePondPluginFileRename
);

FilePond.create(inputEl, {
    server: `${baseUrl}upload/${$('#idPendaftaran').val()}`,
    maxFileSize: "10MB",
    acceptedFileTypes: ["application/zip","application/x-zip","application/x-zip-compressed"],
    labelFileTypeNotAllowed: 'Format file yang anda pilih tidak di izinkan!',
    fileValidateTypeLabelExpectedTypes: 'Format yang di izinkan {allButLastType} atau {lastType}',
    imageValidateSizeLabelImageSizeTooBig: 'Ukuran file terlalu besar',
    imageValidateSizeLabelExpectedMaxSize: 'Maksimal ukuran file yang diizinkan adalah 10MB',
    labelIdle: '<div class="py-3 w-100"><span class="text-form">Klik disini untuk memilih file <br> Atau tarik file anda ke area ini <br> <img src="'+baseUrl+'public_template/img/file.svg" style="height:120px; margin:10px 0;" /> <br/> <small style="font-size:.8rem;">Maksimal Ukuran <b>10MB</b></small></span></div>' ,
    fileRenameFunction: (file) => {
        return `${inputId+file.extension}`;
    }
});

document.addEventListener('FilePond:addfilestart', e => {
    $('input[type="submit"]').prop('disabled', true);
    $('#uploadAlert').addClass('d-none');
});

document.addEventListener("FilePond:processfile", e => {
    let fileName = e.detail.file.filename;
    if(fileName){
        let extFile = fileName.split('.');
        extFile = extFile[extFile.length - 1];
        e.detail.error == null && 
        setTimeout(() => {
            $('#formCarousel').carousel(2);
        }, 500);
    }
});

$('input[type="submit"]').on('click', function(e) {
    $('#fileKartuIdentitas').val() == '' && (
        e.preventDefault(), 
        $('#uploadAlert').removeClass('d-none'),
        $(this).prop('disabled', true)
    );
});