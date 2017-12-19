// let apiUrl = 'http://localhost:3000/api/';
let accessToken = localStorage.getItem('accessToken');

$(document).ready(function() {

    if(accessToken !== null) {

        getDatas(accessToken)
    }
});

function getDatas() {

    $.get(apiUrl + 'videos/' + accessToken + '/role').then(function (res) {

        if (res.role === 'superAdmin') {

            let html = '<h2>Choisissez un client pour accéder à son espace de gestion de playlist</h2>';
            html += '<ul id="users"></ul>';
            $('body').append(html);

            $.get(apiUrl + 'utilisateurs').then(function(res) {
                res.forEach(function (utilisateur) {
                    html = '<li><a href="/admin/playlist/'+utilisateur.id+'">'+ utilisateur.username +'</a></li>';
                    $('#users').append(html)
                })
            })
        }
        else {
            let html = "<h2>Vous n'avez pas les droits d'accès à cette page</h2>";
            $('body').append(html)
        }
    })
}