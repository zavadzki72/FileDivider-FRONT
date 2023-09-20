window.onload = function() {
    const alertList = document.querySelectorAll('.alert')
    const alerts = [...alertList].map(element => new bootstrap.Alert(element));
}

const thisForm = document.getElementById('file-form');

thisForm.addEventListener('submit', async function (e) {

    e.preventDefault();

    var errorAlert = $('#error-alert');
    var sucessAlert = $('#sucess-alert');
    var errorAlertMessage = $('#alert-error-message');
    var sucessAlertMessage = $('#alert-sucess-message');

    var numberLines = document.getElementById("file-form-number-lines-input").value;
    var file = document.querySelector('#file-form-file-input');

    var headers = new Headers();
    headers.append("accept", "*/*");

    if(!file.files[0]){
        errorAlertMessage.text('Voce precisa informar um arquivo!');
        errorAlert.fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
        return;
    }

    var formdata = new FormData();
    formdata.append("formFile", file.files[0], "/path/to/file");

    // var urlRequest = `https://localhost:7149/divide?numberLineToDivide=${numberLines}`;
    var urlRequest = `https://filedivider-api-lctjimkxeq-uc.a.run.app/divide?numberLineToDivide=${numberLines}`;

    const response = await fetch(urlRequest, {
        method: 'POST',
        headers: headers,
        body: formdata
    }).catch(x => {
        errorAlertMessage.text('Ocorreu um erro inesperado, tente novamente mais tarde!');
        errorAlert.fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
        return;
    });

    if(response.status != 200){
        var respString = await response.text();

        errorAlertMessage.text(`Ocorreu um erro (${respString})!`);
        errorAlert.fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );

        return;
    }

    var blob = await response.blob();
    document.getElementById("file-form-number-lines-input").value = '';
    file.value = '';

    var date = new Date();
    saveFile(blob, `FileDivider_${date.toISOString()}.zip`);

    sucessAlertMessage.text('Seu arquivo foi baixado!');
    sucessAlert.fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
});

const errorAlert = document.getElementById('error-alert');

const appendAlert = (message, type) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
    `   <div>${message}</div>`,
    `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
    '</div>'
  ].join('');

  errorAlert.append(wrapper)
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