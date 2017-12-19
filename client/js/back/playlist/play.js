let $tb, $option;

$(document).ready(function() {
    let apiUrl = 'http://localhost:3000/api/';
    if (window.localStorage.getItem('accessToken') !== null) {
        let html = '<form class="form-horizontal" action="" method="">';
        html += '<div class="form-group">';
        html += '<div class="form-group"><label for="holocube" class="col-sm-2 control-label">Holocube*:</label><div class="col-sm-4">';
        html += '<select class="form-control" id="holocube">';
        html += '<option id="empty"></option></select></div></div><br>';
        html += '<div class="form-group"><div class="col-sm-offset-2 col-sm-10"><button type="submit" id="holoc"  class="btn btn-primary">Valider</button></div></div>';
        html += '</form>';

        $('.container').prepend(html);

        $option = $('#empty');
        $.get(apiUrl + 'utilisateurs/'+ window.localStorage.getItem('accessToken') + '/idUser').then(function (res) {
            $.get(apiUrl + 'utilisateurs/'+ res.idUser + '/holocubes' ).then(function (holocubes) {
                holocubes.forEach(function (holocube) {

                    $('<option value="' + holocube.folder + '" selected="selected">' + holocube.nomHolocube + '</option>').insertAfter($option)
                })
            })
        });
       getPlaylist();
        $('#holoc').on('click', getUtilisateur);
    }
});

function getUtilisateur(e){
    e.preventDefault();
    let $holocube = $('#holocube');
    let html = '<thead><tr><th>Titre</th></tr></thead>';

    $('table').append(html);

    $.get(apiUrl + 'utilisateurs/'+ window.localStorage.getItem('accessToken') + '/idUser').then(function (res) {
        console.log(res);

        $.get(apiUrl + 'utilisateurs/'+ res.idUser).then(function (utilisateur) {
            console.log(utilisateur);

            $.get(apiUrl + 'utilisateurs/' + res.idUser + '/videos').then(function (videos) {
                videos.forEach(function (video) {

                    console.log(utilisateur.folder );

                    $('h2').text('Videos');
                    let html = '<tbody><tr id="' + video.id + '">';
                    html += '<td id="name' + video.id + '">' + video.nomVideo + '</td>';
                    html+= '<td><input type="button" id="sub" value="Ajouter" class="btn btn-primary" onclick="transfer(\'' + utilisateur.folder + '\', \'' + video.nomVideo + '\', \''+ $holocube.val()+'\' )"></a></td></tr></tbody>';

                    $tb = $('#table1');
                    $tb.append(html);

                    getPlaylist()

                })
            })
        })
    });
}

function getPlaylist() {
    let $holocube = $('#holocube');
    let $table;

    $.get(apiUrl + 'utilisateurs/'+ window.localStorage.getItem('accessToken') + '/idUser').then(function (res) {
        console.log(res);

        $.get(apiUrl + 'utilisateurs/' + res.idUser).then(function (utilisateur) {

            let data = {
                container: utilisateur.folder,
                holocube: $holocube.val()
            };

            $.get(apiUrl + 'playlists/transfer', data).then(function (playlists) {

                    for (let i = 0; i < playlists.playlist.length; i++) {
                        let html = '<h2>Playlists</h2>';
                        html += '<table class="table"><tbody><tr>';
                        html += '<td>' + playlists.playlist[i] + '</td>';
                        html += '<td><input type="button"  value="Supprimer" class="btn btn-danger" ></a></td></tr></tbody></table>';

                        $table = $('#table');
                        $table.prepend(html);
                    }

            })
        })
    })
}


function transfer(container, file, holocube) {
    console.log(container)
    let data = {
        container: container,
        file: file,
        holocube: holocube
    }
    console.log(data);
    $.ajax({
        url: apiUrl+ 'playlists/transfer',
        type: 'POST',
        data: data,
        success: function(data) {
            console.log(data)
        }
    });
}