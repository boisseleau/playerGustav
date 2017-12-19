let splitTab, accessToken, apiUrl, $body;

$(document).ready(function() {

    splitTab = $(location).attr('href').split('=');
    accessToken = splitTab[1];
    apiUrl = 'http://localhost:3000/api/';
    $body = $('body');

    $body.on('click', "button#submit", submitNewMdp);

    if(accessToken) {

        window.localStorage.setItem('accessToken', accessToken);
        displayDatas()
    }
    else {
        let html = '<h1>Erreur 401</h1>';
        html += "<h2>Vous n'avez pas accès à cette partie du site</h2>";

        $body.append(html);
    }
});

function displayDatas() {

    let html = '<div id="banner"><img id="bannerTitle" src="../../img/transparent.png"></div>';
    html += '<div id="alert"></div>';
    html += '<h2>Modification du mot de passe</h2>';
    html += '<div id="form"><form class="form-horizontal" action="" method="">';

    html += '<div class="form-group"><label for="newMdp">Nouveau mot de passe * :</label>';
    html += '<input id="newMdp" type="password" name="password" placeholder="Nouveau mot de passe" class="form-control" required></div>';

    html += '<div class="form-group"><label for="confirmMdp">Confirmation * :</label>';
    html += '<input id="confirmMdp" type="password" name="confirmation" placeholder="Confirmer le nouveau mot de passe" class="form-control" required></div>';

    html += '<button type="submit" id="submit" class="btn btn-secondary">Valider</button>';
    html += '<p>* : champ obligatoire</p>';
    html += '</form></div>';
    html += '<div id="lien"><a href="/login">Retour</a></div>';

    $body.append(html);
}

function submitNewMdp(e) {
    e.preventDefault();
    let $newPass, $confirmation;
    $newPass = $('#newMdp');
    $confirmation = $('#confirmMdp');

    let mdp = {
        newpassword: $newPass.val(),
        confirmation: $confirmation.val()
    };

    if($newPass.val() === "" || $confirmation.val() === "") {

        $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Veuillez compléter tous les champs requis.</div>')
    }
    else {

        $.ajax({
            url: apiUrl+ 'utilisateurs/'+ accessToken +'/resetPassword',
            type: 'PUT',
            data: mdp,
            success: function() {
                $('#alert').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Succès! </strong>Le mot de passe a bien été modifié.</div>');
                window.localStorage.removeItem('accessToken');
                setTimeout(function(){  window.location= "http://localhost:3000/login" }, 1500);
            },
            error: function(err) {
                if (err.status === 403) {
                    $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Le nouveau mot de passe et sa confirmation ne sont pas égaux.</div>')
                }
                if (err.status === 422) {
                    $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Veuillez compléter tous les champs requis.</div>')
                }
            }
        });
    }
}