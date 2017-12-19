let $id;

$(document).ready(function() {

    let apiUrl = 'http://localhost:3000/api/';
    let accessToken = localStorage.getItem('accessToken');
    $id = $('#userId');
    $('body').on('click', "button#submit", editMdp);

    if (accessToken !== null) {

        $.get(apiUrl + 'videos/' + accessToken + '/role').then(function (res) {

            if (res.role === 'superAdmin') {

                let href = '/admin/utilisateur/'+$('#userId').val()+'/edit';

                displayDatas(href)
            }
            if (res.role === 'admin') {

                $.get(apiUrl + 'utilisateurs/' + accessToken + '/idUser').then(function (resultat) {

                    if(resultat.idUser === parseInt($('#userId').val())) {

                        let href = '/admin/utilisateur/profil/edit';

                        displayDatas(href)
                    }
                    else {
                        html = "<h2>Vous n'avez pas les droits d'accès à cette page</h2>";
                        $('body').append(html)
                    }
                })
            }
        });
    }
});

function displayDatas(href) {

    $('#bannerTitle').attr("src", "../../../img/transparent.png");

    let html = '<div id="alert"></div>';
    html += '<h2>Modifier le mot de passe</h2>';
    html += '<div id="form"><form class="form-horizontal" action="" method="">';

    html += '<div class="form-group"><label for="oldMdp">Ancien mot de passe * :</label>';
    html += '<input id="oldMdp" type="password" name="oldPassword" placeholder="Ancien mot de passe" class="form-control" required></div>';

    html += '<div class="form-group"><label for="newMdp">Nouveau mot de passe * :</label>';
    html += '<input id="newMdp" type="password" name="password" placeholder="Mot de passe actuel" class="form-control" required></div>';

    html += '<div class="form-group"><label for="confirmMdp">Confirmation * :</label>';
    html += '<input id="confirmMdp" type="password" name="confirmation" placeholder="Confirmer le mot de passe" class="form-control" required></div>';

    html += '<button type="submit" id="submit" class="btn btn-secondary">Valider</button>';
    html += '<p>*: champ obligatoire</p>';
    html += '</form></div>';
    html += '<div id="lien"><a href="'+href+'">Retourner à la page de modification du profil</a></div>';

    $('body').append(html);
}

function editMdp(e) {
    e.preventDefault();
    let $oldPass, $newPass, $confirmation, $id;
    $oldPass = $('#oldMdp');
    $newPass = $('#newMdp');
    $confirmation = $('#confirmMdp');
    $id = $('#userId').val();

    let mdp = {
        oldpassword: $oldPass.val(),
        newpassword: $newPass.val(),
        confirmation: $confirmation.val()

    };

    if($oldPass.val() === "" || $newPass.val() === "" || $confirmation.val() === "") {
        $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Veuillez remplir tous les champs obligatoires.</div>')
    }
    else {

        $.ajax({
            url: apiUrl+ 'utilisateurs/'+$id+'/ChangePassword',
            type: 'PUT',
            data: mdp,
            success: function() {
                $('#alert').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Succès!</strong> Le mot de passe a bien été modifié.</div>');
                window.localStorage.removeItem('accessToken');
                setTimeout(function(){  window.location="http://localhost:3000/login" }, 1500);
            },
            error: function(err) {
                if (err.status === 401) {
                    $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> L\'ancien mot de passe est incorrect.</div>')
                }
                if (err.status === 400) {
                    $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Le nouveau mot de passe et sa confirmation ne sont pas égaux.</div>')
                }
            }
        });
    }
}