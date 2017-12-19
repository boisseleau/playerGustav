let id, $nom, $holocube, $video, $idUser, $admin;

$(document).ready(function() {

    let accessToken = localStorage.getItem('accessToken');
    id = $('#idPlaylist').val();
    $idUser = $('#idUser');
    $admin = $('#admin');
    $body = $('body');

    $body.on('click', "input.submit", updatePlaylist);

    if(accessToken !== null) {

        let html = '<h2>Modifier la playlist</h2>';
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
    
    $.get(apiUrl+ 'playlists/' + id).then(function (playlist) {

        $nom.attr("value", playlist.nomPlaylist);

        $.get(apiUrl+ 'utilisateurs/'+ idUser +'/holocubes').then(function (holocubes) {
            holocubes.forEach(function (holocube) {

                html = '<label for="holocube_'+holocube.id+'">'+holocube.nomHolocube+'</label>';
                if(holocube.playlistId === playlist.id) {
                    html+= '<input id="'+holocube.id+'" type="checkbox" name="holocube" value="'+holocube.id+'" checked="checked">';
                }
                else html+= '<input id="'+holocube.id+'" type="checkbox" name="holocube" value="'+holocube.id+'">';

                $holocube.append(html);
            })
        });

        $.get(apiUrl+ 'utilisateurs/'+ idUser +'/videos').then(function (videos) {
            videos.forEach(function (video) {

                html = '<label for="video_'+video.id+'">'+video.nomVideo+'</label>';

                $.get(apiUrl+'playlists/'+playlist.id+'/videos').then(function (playlistVideos) {

                    let compteur = 0;

                    playlistVideos.forEach(function (playlistVideo) {

                        if(playlistVideo.id === video.id) compteur++

                    });

                    if(compteur === 0) $('<input id="'+video.id+'" type="checkbox" name="video" value="'+video.id+'">').insertAfter($('label[for="video_'+video.id+'"]'));
                    else $('<input id="'+video.id+'" type="checkbox" name="video" value="'+video.id+'" checked="checked">').insertAfter($('label[for="video_'+video.id+'"]'));
                });


                $video.append(html);
            })
        })
    })
}

function updatePlaylist(e) {
    e.preventDefault();

    let playlist = {
        nomPlaylist: $nom.val(),
        utilisateurId: $idUser.val()
    };

    $.ajax({
        url: apiUrl + 'playlists/' + id,
        type: 'PUT',
        data: playlist,
        success: function (playlist) {

            let compteur = 0;

            // retrieve all checked videos
            $('[name="video"]:checked').each(function () {

                let videoId = $(this).val();

                // get all videos owned by the current playlist
                $.get(apiUrl + 'playlists/' + playlist.id + '/videos').then(function (playlistVideos) {

                    playlistVideos.forEach(function (playlistVideo) {

                        if (playlistVideo.id.toString() === videoId) compteur++
                    });

                    if(compteur === 0) {
                        let playlist_video = {
                            playlistId: playlist.id,
                            videoId: videoId
                        };

                        $.post(apiUrl + 'playlist_videos', playlist_video).then(function () {

                        })
                    }
                    compteur = 0
                })
            });

            // get all videos owned by the current playlist
            $.get(apiUrl + 'playlists/' + playlist.id + '/videos').then(function (playlistVideos) {

                playlistVideos.forEach(function (playlistVideo) {

                    //retrieve all checked videos
                    $('[name="video"]:checked').each(function () {

                        let videoId = $(this).val();

                        if(playlistVideo.id.toString() === videoId) compteur++
                    });

                    if(compteur === 0) {
                        $.ajax({
                            url: apiUrl+ 'playlists/'+ playlist.id + '/videos/rel/' + playlistVideo.id,
                            type: 'DELETE',
                            success: function() {}
                        })
                    }

                    compteur = 0
                })
            });

            $('[name="holocube"]:checked').each(function() {

                $.get(apiUrl + 'holocubes/' + $(this).val()).then(function (holocube) {

                    if(holocube.playlistId !== playlist.id) {

                        let newHolocube = {
                            adresseIP: holocube.adresseIP,
                            mdp: holocube.mdp,
                            nomHolocube: holocube.nomHolocube,
                            playlistId: playlist.id,
                            utilisateurId: holocube.utilisateurId
                        };

                        $.ajax({
                            url: apiUrl+ 'holocubes/'+holocube.id,
                            type: 'PUT',
                            data: newHolocube,
                            success: function() {}
                        })
                    }
                })
            });

            $.get(apiUrl + 'playlists/' + playlist.id + '/holocubes').then(function (playlistHolocubes) {

                playlistHolocubes.forEach(function (playlistHolocube) {

                    $('[name="holocube"]:checked').map(function() {

                        let holocube = $(this).val();

                        if(playlistHolocube.id.toString() === holocube) compteur++

                    });

                    if(compteur === 0) {
                        let changedHolocube = {
                            adresseIP: playlistHolocube.adresseIP,
                            mdp: playlistHolocube.mdp,
                            nomHolocube: playlistHolocube.nomHolocube,
                            playlistId: 0,
                            utilisateurId: playlistHolocube.utilisateurId
                        };

                        $.ajax({
                            url: apiUrl+ 'holocubes/'+playlistHolocube.id,
                            type: 'PUT',
                            data: changedHolocube,
                            success: function() {}
                        })
                    }
                })
            });

            setTimeout(function () {
                if($admin.val() === "true") window.location = '/admin/playlist/'+ $idUser.val();
                if($admin.val() === "false") window.location = '/admin/playlist';
            }, 500)

        }
    });
}