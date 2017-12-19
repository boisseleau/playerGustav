$(document).ready(function() {

    let apiUrl = 'http://localhost:3000/api/';
    if(window.localStorage.getItem('accessToken') !== null) {

        $.get(apiUrl + 'videos/' + localStorage.getItem('accessToken') + '/role').then(function (res) {

            if (res.role === 'superAdmin') {

                getDatas()
            }
            else {
                html = "<h2>Vous n'avez pas les droits d'accès à cette page</h2>";
                $('body').append(html)
            }
        });
    }
});


function getDatas() {

    let html = '<div class="container"><h2>Utilisateurs</h2>';
    html += '<div id="lien"><a href="/admin/utilisateur/new" class="btn btn-default">Créer un nouvel utilisateur</a></div>';
    html += '<div style="overflow-x:auto;"><table class="table">';
    html += '<thead><tr><th>Nom</th><th>E-mail</th><th></th><th></th></tr></thead>';
    html += '</table></div></div>';

    $('body').append(html);

    $table = $('table');

    $.get(apiUrl + 'utilisateurs').then(function (utilisateurs) {
        utilisateurs.forEach(function (utilisateur) {

            let html = '<tbody><tr id="'+ utilisateur.id +'">';
            html += '<td >'+utilisateur.username +'</td>';
            html += '<td>' + utilisateur.email + '</td>';
            html += '<td><a href="/admin/utilisateur/'+ utilisateur.id +'/edit" class="btn btn-warning">Modifier</a></td>';
            html+= '<td><input type="button" value="Supprimer" class="btn btn-danger" onclick="deleteUser('+utilisateur.id+')"></a></td></tr></tbody>';

            $table.append(html);
        })
    })
}

function deleteUser(id) {
    $.ajax({
        url: apiUrl+ 'utilisateurs/'+id+'/all',
        type: 'DELETE',
        success: function() {
            $("tr[id="+id+"]").remove();
            console.log('success delete user/all');
        },
        error: function(err) {
            console.log('error', err);
        }
    });
}