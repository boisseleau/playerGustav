$(document).ready(function() {
    let apiUrl = 'http://localhost:3000/api/';

    let accessToken = localStorage.getItem('accessToken');

    $('body').on('click', "button#submit", addUser);

    if(accessToken !== null) {

        $.get(apiUrl + 'videos/' + localStorage.getItem('accessToken') + '/role').then(function (res) {

            if (res.role === 'superAdmin') {
                let html = '<div id="alert" ></div>';
                html += '<h2>Créer un nouvel utilisateur</h2>';
                html += '<div id="form">';
                html += '<form class="form-horizontal" action="" method="post">';
                html += '<div class="form-group">';
                html += '<label for="nomUtilisateur">Nom * :</label>';
                html += '<input id="nomUtilisateur" class="form-control" type="text" name="nom" placeholder="ex : Maison d\'en France" required ></div>';

                html += '<div class="form-group"><label for="mailUtilisateur">E-mail * :</label>';
                html += '<input id="mailUtilisateur" class="form-control" type="email" name="mail" placeholder="ex: paul.jean@gmail.fr" required ></div>';

                html += '<div class="form-group"><label for="passwordUtilisateur">Mot de passe * :</label>';
                html += '<input id="passwordUtilisateur" class="form-control" type="password" name="password" required></div>';

                html += '<div class="form-group"><label for="folder">Dossier * :</label>';
                html += '<input id="folder" class="form-control" type="text" name="folder" required></div>';

                html += '<button type="submit" id="submit" class="btn btn-secondary">Valider</button>';
                html += '<p>* : Champs obligatoires</p>';
                html += '</form></div>';
                html += '<div id="lien"><a href="/admin/utilisateur">Retourner à la liste des utilisateurs</a></div>';

                $('body').append(html);
            }
            if (res.role === 'admin') {
                html = "<h2>Vous n'avez pas les droits d'accès à cette page</h2>";
                $('body').append(html)
            }
        });
    }
});

function addUser(e) {
    e.preventDefault();
    let $username, $email, $password, $folder;
    $username = $('#nomUtilisateur');
    $email = $('#mailUtilisateur');
    $password = $('#passwordUtilisateur');
    $folder = $('#folder');

    let user = {
        username: $username.val(),
        email: $email.val() ,
        password: $password.val(),
        folder: $folder.val()

    };

    $.ajax({
        url: apiUrl+ 'utilisateurs',
        type: 'POST',
        data: user,
        success: function(data) {
            $('#alert').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Succès!</strong> L\'utilisateur a bien été enregistré.</div>');
            setTimeout(function () {
                window.location = "http://localhost:3000/admin/utilisateur"
            }, 1000);
        },
        error: function(err) {
            console.log('error', err);
            $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Veuillez remplir tous les champs obligatoires.</div>')
        }
    });
}