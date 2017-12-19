let $id;

$(document).ready(function() {

    let apiUrl = 'http://localhost:3000/api/';
    $id = $('#userId');

    $('body').on('click', "button#submit", editUser);

    if (window.localStorage.getItem('accessToken') !== null) {

        $.get(apiUrl + 'videos/' + localStorage.getItem('accessToken') + '/role').then(function (res) {

            if (res.role === 'superAdmin') {

                $.get(apiUrl + 'utilisateurs/' + $id.val()).then(function (res) {

                    $('img').attr("src", "../../../img/transparent.png");

                    let html = "<div id='alert'></div>";
                    html += "<h2>Modifier l'utilisateur</h2>";
                    html += '<div id="form"><form class="form-horizontal" action="" method="">';

                    html += '<div class="form-group"><label for="nomUtilisateur">Nom:</label>';
                    html += '<input id="nomUtilisateur" class="form-control" type="text" name="nom" value="' + res.username + '" ></div>';

                    html += '<div class="form-group"><label for="mailUtilisateur">E-mail:</label>';
                    html += '<input id="mailUtilisateur" class="form-control" type="email" name="mail" value="' + res.email + '" ></div>';

                    html += '<button type="submit" id="submit" class="btn btn-secondary">Valider</button>';
                    html += '</form></div>';
                    html += '<div id="error"></div>';
                    html += '<div class="lien" id="return"><a href="/admin/utilisateur">Retourner à la liste des utilisateurs</a></div>';

                    $('body').append(html);
                });
            }
            if (res.role === 'admin') {
                $('#error').text('Erreur : Vous n\'avez pas accès à cette page !');
            }
        });
    }
});

function editUser(e) {
    e.preventDefault();
    let $username, $email, $id;
    $username = $('#nomUtilisateur');
    $email = $('#mailUtilisateur');
    $id = $('#userId').val();

    let user = {
        username: $username.val(),
        email: $email.val()

    };

    if($username.val() === "" || $email.val() === "") {
        $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Veuillez remplir tous les champs obligatoires.</div>')
    }
    else {

        $.ajax({
            url: apiUrl+ 'utilisateurs/'+$id+'/update',
            type: 'PUT',
            data: user,
            success: function() {
                $('#alert').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Success!</strong> L\'utilisateur a bien été modifié.</div>');
                setTimeout(function(){
                    window.location="http://localhost:3000/admin/utilisateur"
                }, 1000);
            },
            error: function() {
                $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Une erreur s\'est produite, veuillez recommencer.</div>')
            }
        });
    }
}