$(document).ready(function() {

    clientId = $("input[id='userId']").val();
    let accessToken = localStorage.getItem('accessToken');

    if(accessToken !== null) {

        let html = '<h2>Playlists</h2>';
        html += '<table><tr><th>Nom</th>';
        html += '<th>Holocube(s)</th>';
        html += '<th>Video(s)</th></tr></table>';
        html += '<input id="supMult" type="submit" onclick="deleteMultiple()" value="Supprimer la sélection">';

        $('body').append(html);

        $table = $('table');
        $h2 = $('h2');

        $.get(apiUrl + 'videos/' + accessToken + '/role').then(function (res) {

            if (res.role === "admin") {

                $.get(apiUrl + 'utilisateurs/' + accessToken + '/idUser').then(function (resultat) {

                    $('<a href="/admin/playlist/new">Créer une nouvelle playlist</a><br><br>').insertAfter($h2);
                    displayDatasA(resultat.idUser)
                });
            }

            if (res.role === "superAdmin") {

                $('<a href="/admin/playlist/' + clientId + '/new">Créer une nouvelle playlist</a><br><br>').insertAfter($h2);
                displayDatasSA(clientId)
            }
        });
    }
});

function displayDatasSA(userId) {

    $.get(apiUrl+ 'utilisateurs/'+ userId).then(function () {

        $.get(apiUrl+ 'utilisateurs/'+ userId +'/playlists').then(function (playlists) {
            playlists.forEach(function (playlist) {

                html = '<tr id="'+playlist.id+'">';
                html+= '<td>' + playlist.nomPlaylist + '</td>';
                html+= '<td id="holocubes'+playlist.id+'"></td>';
                html+= '<td id="videos'+playlist.id+'"></td>';
                html+= '<td><a href="/admin/playlist/'+playlist.id+'/edit/'+userId+'">Modifier</a></td>';
                html+= '<td><input type="button" value="Supprimer" onclick="deletePlaylist('+playlist.id+')"></a></td>';
                html+= '<td><input type="checkbox" name="supprimer" value="'+playlist.id+'"></td></tr>';

                $table.append(html);

                $.get(apiUrl+'playlists/'+playlist.id+'/holocubes').then(function (holocubes) {
                    html="";
                    holocubes.forEach(function (holocube) {
                        html+= holocube.nomHolocube+'<br>';
                        $("td[id='holocubes"+playlist.id+"']").html(html);
                    })
                });

                $.get(apiUrl+'playlists/'+playlist.id+'/videos').then(function (videos) {
                    html="";
                    videos.forEach(function (video) {
                        html+= video.nomVideo+'<br>';
                        $("td[id='videos"+playlist.id+"']").html(html);
                    })
                })
            })
        })
    })
}

function displayDatasA(userId) {

    $.get(apiUrl+ 'utilisateurs/'+ userId).then(function () {

        $.get(apiUrl+ 'utilisateurs/'+ userId +'/playlists').then(function (playlists) {
            playlists.forEach(function (playlist) {

                html = '<tr id="'+playlist.id+'">';
                html+= '<td>' + playlist.nomPlaylist + '</td>';
                html+= '<td id="holocubes'+playlist.id+'"></td>';
                html+= '<td id="videos'+playlist.id+'"></td>';
                html+= '<td><a href="/admin/playlist/'+playlist.id+'/edit">Modifier</a></td>';
                html+= '<td><input type="button" value="Supprimer" onclick="deletePlaylist('+playlist.id+')"></a></td>';
                html+= '<td><input type="checkbox" name="supprimer" value="'+playlist.id+'"></td></tr>';

                $table.append(html);

                $.get(apiUrl+'playlists/'+playlist.id+'/holocubes').then(function (holocubes) {
                    html="";
                    holocubes.forEach(function (holocube) {
                        html+= holocube.nomHolocube+'<br>';
                        $("td[id='holocubes"+playlist.id+"']").html(html);
                    })
                });

                $.get(apiUrl+'playlists/'+playlist.id+'/videos').then(function (videos) {
                    html="";
                    videos.forEach(function (video) {
                        html+= video.nomVideo+'<br>';
                        $("td[id='videos"+playlist.id+"']").html(html);
                    })
                })
            })
        })
    })
}

function deleteMultiple() {

    $("input:checkbox:checked").map(function() {

        deletePlaylist($(this).val())
    })
}

function deletePlaylist(playlistId) {

    $.get(apiUrl + 'playlists/' + playlistId + '/holocubes').then(function (holocubes) {

        holocubes.forEach(function (holocube) {

            let changedHolocube = {
                adresseIP: holocube.adresseIP,
                mdp: holocube.mdp,
                nomHolocube: holocube.nomHolocube,
                playlistId: 0,
                utilisateurId: holocube.utilisateurId
            };

            $.ajax({
                url: apiUrl+ 'holocubes/'+holocube.id,
                type: 'PUT',
                data: changedHolocube,
                success: function() {}
            })
        })
    });

    $.get(apiUrl + 'playlists/' + playlistId + '/videos').then(function (videos) {

        videos.forEach(function (video) {

            $.ajax({
                url: apiUrl+ 'playlists/'+ playlistId + '/videos/rel/' + video.id,
                type: 'DELETE',
                success: function() {}
            })
        })
    });

    setTimeout(function () {
        $.ajax({
            url: apiUrl+ 'playlists/'+playlistId,
            type: 'DELETE',
            success: function() {
                $("tr[id="+playlistId+"]").remove()
            }
        })
    }, 500)
}