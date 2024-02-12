$(document).ready(function () {
    onClickNav();
    onChangeFile();
    onSubmitFormTxt();
    onSubmitFormPdf();
});

function onChangeFile(){
    onChangeFileItens('#file-input-txt');
    onChangeFileItens('#file-input-pdf');
}

function onChangeFileItens(id){
    $(id).change(function() {

        $('#header-content-btn').removeClass('header-content-btn-padding');

        $('#have-file').removeClass('closed');
        $('#have-file').addClass('open');
        $('#have-file span').text(this.value.split(/(\\|\/)/g).pop());

    });
}

function onClickNav(){
    $('#nav-menu-tools').on('click', function() {
        navElementsOpenAndClose();
    });

    onClickNavItem('#nav-dropdown-div-item-ciano-1', 'index.html');
    onClickNavItem('#nav-dropdown-div-item-ciano-2', 'pdf-divider.html');
}

function onClickNavItem(id, actionClick){
    $(id).on('click', function() {
        navElementsOpenAndClose();
        relativeRedir(actionClick);
    });

    $(id).on({
        mouseenter: function () {
            var element = $(id);
            element.addClass('nav-item-mouse-over-ciano');
        },
        mouseleave: function () {
            var element = $(id);
            element.removeClass('nav-item-mouse-over-ciano');
        }
    });
}

function navElementsOpenAndClose(){
    var element = $('#nav-dropdown');
    var elementContainer = $('#tudo');
    var body = $('#body');

    if(element.hasClass('open')){
        element.removeClass('open');
        $('#up_arrow').removeClass('open');
        $('#up_arrow').addClass('closed');
        $('#down_arrow').removeClass('closed');
        $('#down_arrow').addClass('open');
        $('#nav-menu-tools').removeClass('nav-menu-tools-active');
        elementContainer.removeClass('blur');
        elementContainer.removeClass('stop-pointer-event');
        body.removeClass('stop-scrolling');
        element.addClass('closed');
    }else{
        element.removeClass('closed');
        $('#up_arrow').addClass('open');
        $('#up_arrow').removeClass('closed');
        $('#down_arrow').addClass('closed');
        $('#down_arrow').removeClass('open');
        $('#nav-menu-tools').addClass('nav-menu-tools-active');
        elementContainer.addClass('blur');
        elementContainer.addClass('stop-pointer-event');
        body.addClass('stop-scrolling');
        element.addClass('open');
    }
}

function onSubmitFormTxt(){

    $('#file-form-txt').on("submit", async function( event ) {

        event.preventDefault();

        var numberLines = document.getElementById("number-lines-input");
        var file = document.querySelector('#file-input-txt');

        var response = await sendFileRequestTxt(file, numberLines.value);
        
        if(!response)
            return

        var date = new Date();
        saveFile(response, `FileDivider_${date.toISOString()}.zip`);
    
        numberLines.value = '';
        file.value = '';

        $('#header-content-btn').addClass('header-content-btn-padding');
        $('#have-file').removeClass('open');
        $('#have-file').addClass('closed');

        showAlert('Seu arquivo foi baixado!', 'success', 1500);
    });

}

function onSubmitFormPdf(){

    $('#file-form-pdf').on("submit", async function( event ) {

        event.preventDefault();

        var fileName = document.getElementById("file-name-input");
        var file = document.querySelector('#file-input-pdf');

        var response = await sendFileRequestPdf(file, fileName.value);
        
        if(!response)
            return

        var date = new Date();
        saveFile(response, `FileDivider_${date.toISOString()}.zip`);
    
        fileName.value = '';
        file.value = '';

        $('#header-content-btn').addClass('header-content-btn-padding');
        $('#have-file').removeClass('open');
        $('#have-file').addClass('closed');

        showAlert('Seu arquivo foi baixado!', 'success', 1500);
    });

}

function showAlert(message, type, delay){
    var id = type == 'error' ? 'error-alert' : 'success-alert';
    var alert = $(`#${id}`);

    if(!alert)
        return;

    var messageElement = $(`#${id} span`);
    messageElement.text(`${message}`);
    alert.removeClass('closed');

    alert.fadeIn(500).delay(delay).fadeOut(500);
}

async function sendFileRequestTxt(file, numberLines){

    var headers = new Headers();
    headers.append("accept", "*/*");

    if(!file.files[0]){
        showAlert('Voce precisa informar um arquivo!', 'error', 2000);
        return;
    }

    var formdata = new FormData();
    formdata.append("formFile", file.files[0], "/path/to/file");

    var urlRequest = `https://filedivider-api-lctjimkxeq-uc.a.run.app/divide?numberLineToDivide=${numberLines}`;

    const response = await fetch(urlRequest, {
        method: 'POST',
        headers: headers,
        body: formdata
    }).catch(x => {
        showAlert('Ocorreu um erro inesperado, tente novamente mais tarde!', 'error', 2000);
        return;
    });

    if(response.status != 200){
        var respString = await response.text();

        showAlert(`Ocorreu um erro (${respString})!`, 'error', 2000);
        return;
    }

    var blob = await response.blob();
    return blob;
}

async function sendFileRequestPdf(file, fileName){

    var headers = new Headers();
    headers.append("accept", "*/*");

    if(!file.files[0]){
        showAlert('Voce precisa informar um arquivo!', 'error', 2000);
        return;
    }

    var formdata = new FormData();
    formdata.append("formFile", file.files[0], "/path/to/file");

    var urlRequest = `https://filedivider-api-lctjimkxeq-uc.a.run.app/divide/pdf/by-page?fileName=${fileName}`;

    const response = await fetch(urlRequest, {
        method: 'POST',
        headers: headers,
        body: formdata
    }).catch(x => {
        showAlert('Ocorreu um erro inesperado, tente novamente mais tarde!', 'error', 2000);
        return;
    });

    if(response.status != 200){
        var respString = await response.text();

        showAlert(`Ocorreu um erro (${respString})!`, 'error', 2000);
        return;
    }

    var blob = await response.blob();
    return blob;
}

function saveFile(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement('a');
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0)
    }
}

function relativeRedir(redir){
    location.pathname = location.pathname.replace(/(.*)\/[^/]*/, "$1/"+redir);
}