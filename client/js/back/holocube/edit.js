
let $id, $nom, $adresseIP, $mdp, $client, $option;

$(document).ready(function() {

    $('body').on('click', "button#submit", editHolocube);

    let accessToken = localStorage.getItem('accessToken');

    $id = $('#idHolocube').val();

    if(accessToken !== null) {

        $.get(apiUrl + 'videos/' + accessToken + '/role').then(function (res) {

            if (res.role === 'superAdmin') {

                $.get(apiUrl + 'holocubes/' + $id).then(function (holocube) {

                    $('img').attr("src", "../../../img/transparent.png");

                    let html = '<div id="alert" ></div>';
                    html += '<h2>Modifier holocube</h2>';
                    html += '<div id="form"><form id="form" class="form-horizontal" action="" method="post">';

                    html += '<div class="form-group"><label for="nomHolocube">Nom * :</label>';
                    html += '<input id="nomHolocube" class="form-control" type="text" name="nom" placeholder="ex: Holocube_Nantes" value="' + holocube.nomHolocube + '" required></div>';

                    html += '<div class="form-group"><label for="adresseIP">Adresse IP * :</label>';
                    html += '<input id="adresseIP" class="form-control" type="text" name="adresseIP" placeholder="ex: 172.16.254.1" value="' + holocube.adresseIP + '" required></div>';

                    html += '<div class="form-group"><label for="mdpHolocube">Mot de passe * :</label>';
                    html += '<input id="mdpHolocube" class="form-control" type="password" name="password" value="' + holocube.mdp + '" required></div>';

                    html += '<div class="form-group"><label for="clientHolo">Client * :</label>';
                    html += '<select id="clientHolo" class="form-control" name="client">';
                    html += '<option id="empty"></option>';
                    html += '</select></div>';
                    html += '<button type="submit" id="submit" class="btn btn-secondary">Valider</button>';
                    html += '<div id="lien"></div><p>* : Obligatoire</p></form></div>';
                    html += '<div id="lien"><a href="/admin/holocube">Retourner à la liste des holocubes</a></div>';

                    $('body').append(html);

                    getUtilisateur(holocube)
                })
            }
            else {
                html = "<h2>Vous n'avez pas les droits d'accès à cette page</h2>";
                $('body').append(html)
            }
        });
    }
});

function getUtilisateur(holocube) {

    $nom = $('#nomHolocube');
    $adresseIP = $('#adresseIP');
    $mdp = $('#mdpHolocube');
    $client = $('#clientHolo');
    $option = $('#empty');

    $.get(apiUrl + 'utilisateurs').then(function(res) {
        res.forEach(function (utilisateur) {

            if(utilisateur.id === holocube.utilisateurId) {
                $('<option value="'+utilisateur.id+'" selected="selected">'+utilisateur.username+'</option>').insertAfter($option)
            }
            else $('<option value="'+utilisateur.id+'">'+utilisateur.username+'</option>').insertAfter($option);
        })
    })
}

function editHolocube(e) {
    e.preventDefault();

    let holocube = {
        nomHolocube: $nom.val(),
        adresseIP: $adresseIP.val(),
        mdp: $mdp.val(),
        utilisateurId: $client.val()
    };

    $.ajax({
        url: apiUrl+ 'holocubes/'+$id,
        type: 'PUT',
        data: holocube,
        success: function() {
            $('#alert').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Succès!</strong> L\'holocube a bien été enregistré.</div>');
            setTimeout(function () {
                window.location="http://localhost:3000/admin/holocube"
            }, 1000);
        },
        error: function () {
            $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Veuillez remplir tous les champs obligatoires.</div>')
        }
    });
}