let $file, $option, $name, $duree, $poid, $resolution, $client, $holo;

$(document).ready(function() {

    let apiUrl = 'http://localhost:3000/api/';

    let accessToken = localStorage.getItem('accessToken');

    $('body').on('click', "button#submit", addVideo);

    if (accessToken !== null) {

        $.get(apiUrl + 'videos/' + localStorage.getItem('accessToken') + '/role').then(function (res) {

            if (res.role === 'superAdmin') {
                let html = '<div id="alert" ></div>';
                html += '<h2>Ajouter une nouvelle vidéo</h2>';
                html += '<div id="form">';
                html += '<form class="form-horizontal" action="" method="post" enctype="multipart/form-data">';
                html += '<div class="form-group">';
                html += '<label for="video"">Fichier * :</label>';
                html += '<input  id="files" type="file" name="video" class="form-control"  required></div>';

                html += '<div class="form-group"><label for="duree"">Durée * :</label>';
                html += '<input id="duree" type="text" name="duree" placeholder="ex: 1 mn 30" class="form-control" required></div>';

                html += '<div class="form-group"><label  for="poids"">Poids * :</label>';
                html += '<input id="poids" type="text" name="poids" placeholder="ex: 200 Mo" class="form-control" required></div>';

                html += '<div class="form-group"><label for="resolution"">Résolution * :</label>';
                html += '<input id="resolution" type="text" name="resolution" placeholder="ex: 1600*1200" class="form-control" required></div>';

                html += '<div class="form-group"><label for="client"">Client * :</label>';
                html += '<select class="form-control" id="client">';
                html += '<option id="empty"></option></select></div>';

                html += '<div class="form-group"><label for="holo">Holographique? * :</label>';
                html += '<select class="form-control" id="holo">';
                html += '<option value="0">Non</option>';
                html += '<option value="1">Oui</option>';
                html += '<option value="2">Les deux</option></select></div>';

                html += '<button type="submit" id="submit" class="btn btn-secondary">Valider</button>';
                html += '<p>* : Champs obligatoires</p></form></div>';
                html += '<div id="lien"><a href="/admin/video">Retourner à la liste des vidéos</a></div>';
                html += '<div id="error"></div>';

                $('body').append(html);

                $option = $('#empty');
                getUtilisateur()
            }
            if (res.role === 'admin') {
                $('#error').text('Erreur : Vous n\'avez pas accès à cette page !');
            }
        });
    }
});

function getUtilisateur() {
    $.get(apiUrl+ 'utilisateurs').then(function (utilisateurs) {
        utilisateurs.forEach(function (utilisateur) {

            $('<option value="'+utilisateur.folder+'-'+utilisateur.id+'" selected="selected">'+utilisateur.username+'</option>').insertAfter($option)
        })
    })
}

function addVideo(e) {
    e.preventDefault();
    $file = $('#files');
    $name = $('#name');
    $duree = $('#duree');
    $poid = $('#poids');
    $resolution = $('#resolution');
    $client = $('#client');
    $holo = $('#holo');

    let splitChaine = $client.val().split('-');
    let folder = splitChaine[0];
    let id = parseInt(splitChaine[1]);

    if( $file.get(0).files.length === 0){
        $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Veuillez sélectionner un fichier.</div>')
    }
    else {

        let video = {
            nomVideo: $file.get(0).files[0].name,
            url: 'server/video/'+ folder + '/' + $file.get(0).files[0].name,
            duree: $duree.val(),
            poids: $poid.val(),
            resolution: $resolution.val(),
            holographique: $holo.val(),
            utilisateurId: id
        };

        $.ajax({
            url: apiUrl+ 'videos',
            type: 'POST',
            data: video,
            success: function () {

                let fichier = {
                    url:$file.val()
                };
                $('#alert').html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Succès!</strong> La vidéo a bien été enregistré.</div>');
                sendFile($file.get(0).files[0], apiUrl+'videos/'+ folder +'/upload');
                setTimeout(function(){
                    window.location="http://localhost:3000/admin/video"
                }, 1000);
            },
            error: function () {
                $('#alert').html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>\<strong>Erreur!</strong> Veuillez remplir tous les champs obligatoires.</div>')
            }
        });
    }
}

function sendFile(file, url) {
    return new Promise(function(resolve, reject) {
        console.log(file);
        let xhr = new XMLHttpRequest();
        let fd = new FormData();

        xhr.open("POST", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.responseText);
                console.log(resolve);
            }
        };
        fd.append('file', file);
        xhr.send(fd);
    });
}