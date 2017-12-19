$(document).ready(function() {

    $body = $('body');

    $body.on('click', "button#submit", sendMail);

    let html = '<div id="banner"><img id="bannerTitle" src="../../img/transparent.png"></div>';
    html += '<div id="alert"></div>';
    html += '<h2>Entrez votre mail et validez pour obtenir un nouveau mot de passe</h2>';
    html += '<div id="form"><form class="form-horizontal" action="" method="">';

    html += '<div class="form-group"><label for="email">E-mail :</label>';
    html += '<input id="email" class="form-control" type="text" name="email"></div>';

    html += '<button type="submit" id="submit" class="btn btn-secondary">Valider</button>';
    html += '</form></div>';
    html += '<div id="lien"><a href="/login">Retour</a></div>';

    $body.append(html);
});


function sendMail(e) {

    e.preventDefault();
    let apiUrl = 'http://localhost:3000/api/';
    let $email = $('#email');

    let mail = {
        email: $email.val()
    };

    if ($email.val() === "") {
        $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur! </strong>Veuillez compléter le champ E-mail.</div>');
    }
    else {

        $.ajax({
            url: apiUrl+ 'utilisateurs/reset',
            type: 'POST',
            data: mail,
            success: function() {
                $('#alert').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Succès!</strong> Consultez votre boîte mail pour changer votre mot de passe.</div>');
            },
            error: function(err) {
                if (err.status === 404){
                    $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur! </strong>L\'email est introuvable ou n\'existe pas.</div>');
                }
            }
        });
    }
}