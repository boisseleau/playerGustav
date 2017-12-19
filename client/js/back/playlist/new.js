let $nom, $holocube, $video, $admin, $idUser, $body;

$(document).ready(function() {

    let accessToken = localStorage.getItem('accessToken');
    $admin = $('#admin');
    $idUser = $('#idUser');
    $body = $('body');

    $body.on('click', "input.submit", addPlaylist);

    if(accessToken !== null) {

        let html = '<h2>Créer une nouvelle playlist</h2>';
        html += '<form action="" method="post">';
        html += '<label for="nomPlaylist">Nom* :</label>';
        html += '<input id="nomPlaylist" type="text" name="nom" placeholder="Nom" required><br>';
        html += '<fieldset><legend id="holocubes">Holocubes:</legend></fieldset>';
        html += '<fieldset><legend id="videos">Vidéos:</legend></fieldset>';
        html += '<input class="submit" type="submit"></form>';
        html += '<br><p>* Obligatoire</p><br><br>';

        $body.append(html);

        $nom = $('#nomPlaylist');
        $holocube = $('#holocubes');
        $video = $('#videos');
        $p = $('p');

        $.get(apiUrl + 'videos/' + accessToken + '/role').then(function (res) {

            if (res.role === "admin") {

                $('<a href="/admin/playlist">Retourner à la liste des playlists</a>').insertAfter($p);

                $.get(apiUrl + 'utilisateurs/' + accessToken + '/idUser').then(function (resultat) {

                    $admin.val(false);
                    $idUser.val(resultat.idUser);
                    displayDatas(resultat.idUser)
                });
            }

            if (res.role === "superAdmin") {

                $('<a href="/admin/playlist/'+$idUser.val()+'">Retourner à la liste des playlists</a>').insertAfter($p);

                $admin.val(true);
                displayDatas($idUser.val())
            }
        });
    }
});

function displayDatas(idUser) {

    $.get(apiUrl+ 'utilisateurs/'+ idUser +'/holocubes').then(function (holocubes) {
        holocubes.forEach(function (holocube) {
            html = '<label for="'+holocube.id+'">'+holocube.nomHolocube+'</label>';
            html+= '<input id="'+holocube.id+'" type="checkbox" name="holocube" value="'+holocube.id+'">';

            $holocube.append(html);
        })
    });

    $.get(apiUrl+ 'utilisateurs/'+ idUser +'/videos').then(function (videos) {
        videos.forEach(function (video) {
            html = '<label for="'+video.id+'">'+video.nomVideo+'</label>';
            html+= '<input id="'+video.id+'" type="checkbox" name="video" value="'+video.id+'">';

            $video.append(html);
        })
    })
}

function addPlaylist(e) {
    e.preventDefault();

    let playlist = {
        nomPlaylist: $nom.val(),
        utilisateurId: $idUser.val(),
    };

    $.post(apiUrl + 'playlists', playlist).then(function (playlist) {

        $('[name="video"]:checked').map(function() {

            let playlist_video = {
                playlistId: playlist.id,
                videoId: $(this).val()
            };

            $.post(apiUrl + 'playlist_videos', playlist_video).then(function () {

            })
        });

        $('[name="holocube"]:checked').map(function() {
            $.get(apiUrl + 'holocubes/' + $(this).val()).then(function (holocubes) {

                let holocube = {
                    adresseIP: holocubes.adresseIP,
                    mdp: holocubes.mdp,
                    nomHolocube: holocubes.nomHolocube,
                    playlistId: playlist.id,
                    utilisateurId: holocubes.utilisateurId
                };

                $.ajax({
                    url: apiUrl+ 'holocubes/'+holocubes.id,
                    type: 'PUT',
                    data: holocube,
                    success: function() {}
                })
            })
        });

        setTimeout(function () {
            if($admin.val() === "true") window.location = '/admin/playlist/'+ $idUser.val();
            if($admin.val() === "false") window.location = '/admin/playlist';
        }, 500)
    });
}