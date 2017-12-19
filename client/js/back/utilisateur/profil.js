$(document).ready(function() {

    if (localStorage.getItem('accessToken') !== null) {

        getUtilisateur()
    }

});

function getUtilisateur() {

    $.get(apiUrl + 'utilisateurs/'+ localStorage.getItem('accessToken')+'/idUser').then(function (res) {

        $.get(apiUrl + 'utilisateurs/'+ res.idUser ).then(function (utilisateur) {

            let html = '<div class="container"><h2 style="margin-bottom: 70px">Profil</h2>';
            html += '<table class="table"><thead><tr><th>Nom</th><th>E-mail</th></tr></thead>';
            html += '<tbody><tr id="' + utilisateur.id + '">';
            html += '';
            html += '';
            html += '<td >' + utilisateur.username + '</td>';
            html += '<td>' + utilisateur.email + '</td></tr></tbody></table></div>';
            html += '<a id="modifProfil" href="/admin/utilisateur/profil/edit" class="btn btn-warning">Modifier mes données</a>';

            $('body').append(html);
        })
    });
}