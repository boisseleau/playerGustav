$(document).ready(function() {

    if (localStorage.getItem('accessToken') !== null) {
        getUtilisateur()
    }
});

function getUtilisateur() {

    let apiUrl = 'http://localhost:3000/api/';
    $('body').on('click', "button#submit", editUser);

    $.get(apiUrl + 'utilisateurs/'+ localStorage.getItem('accessToken')+'/idUser').then(function (res) {

        $.get(apiUrl + 'utilisateurs/'+ res.idUser ).then(function (utilisateur) {

            $('img').attr("src", "../../../img/transparent.png");

            let html = '<div id="alert"></div>';
            html += '<h2>Modifier mon profil</h2>';
            html += '<div id="form"><form class="form-horizontal" action="" method="">';

            html += '<div class="form-group"><label for="nomUtilisateur">Nom:</label>';
            html += '<input id="nomUtilisateur" class="form-control" type="text" name="nom" value="' + utilisateur.username + '" ></div>';

            html += '<div class="form-group"><label for="mailUtilisateur">E-mail:</label>';
            html += '<input id="mailUtilisateur" class="form-control" type="email" name="mail" value="' + utilisateur.email + '" ></div>';

            html += '<button type="submit" id="submit" class="btn btn-secondary">Valider</button>';
            html += '</form></div>';
            html += '<div id="error"></div>';
            html += '<div class="lien" id="changePass"><a href="/admin/utilisateur/' + utilisateur.id + '/change-password">Modifier mon mot de passe</a></div>';
            html += '<div class="lien" id="return"><a href="/admin/utilisateur/profil">Retourner à mon profil</a></div>';

            $('body').append(html);
        })
    });
}

function editUser(e) {
    e.preventDefault();
    let $username, $email;
    $username = $('#nomUtilisateur');
    $email = $('#mailUtilisateur');

    let user = {
        username: $username.val(),
        email: $email.val()
    };

    if($username.val() === "" || $email.val() === "") {
        $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Veuillez ne pas laisser de champ vide.</div>')
    }
    else {

        $.get(apiUrl + 'utilisateurs/'+ localStorage.getItem('accessToken')+'/idUser').then(function (res) {
            $.ajax({
                url: apiUrl + 'utilisateurs/' + res.idUser + '/update',
                type: 'PUT',
                data: user,
                success: function (data) {
                    $('#alert').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Succès!</strong> Vos informations ont bien été modifiés, vous allez être redirigé vers la page de login.</div>');
                    setTimeout(function () {
                        window.localStorage.removeItem('accessToken');
                        window.location = "http://localhost:3000/login"
                    }, 2500);
                },
                error: function(err) {
                    console.log('error', err);
                }
            });
        });
    }
}