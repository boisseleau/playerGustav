$(document).ready(function() {
    let apiUrl = 'http://localhost:3000/api/';
    if (window.localStorage.getItem('accessToken') !== null) {
        $.get(apiUrl + 'videos/' + localStorage.getItem('accessToken') + '/role').then(function (res) {

            if (res.role === 'superAdmin') {
                getDatasSA()
            }
            if (res.role === 'admin') {
                getDatasA()
            }
        });
    }
});


function getDatasSA() {

    let html = '<div class="container"><h2>Vidéos</h2>';
    html += '<div id="lien"><a href="/admin/video/new" class="btn btn-default">Ajouter une nouvelle video</a></div>';
    html += '<div style="overflow-x:auto;"><table class="table">';
    html += '<thead><tr><th>Titre</th><th>Client</th><th>Url</th><th>Durée</th><th>Poids</th><th>Résolution</th><th>Holographique</th><th></th></tr></thead>';
    html += '</table></div></div>';

    $('body').append(html);

    $.get(apiUrl + 'videos').then(function (videos) {
        videos.forEach(function (video) {

            let holo;
            switch(video.holographique) {
                case 0:
                    holo = 'Non';
                    break;
                case 1:
                    holo = 'Oui';
                    break;
                case 2:
                    holo = 'Les deux';
                    break;
                default:
                    holo = 'non renseigné'
            }

            let html= '<tbody><tr id="'+video.id+'">';
            html+= '<td id="name'+video.id+'">' + video.nomVideo + '</td>';
            html+= '<td>' + video.url + '</td>';
            html+= '<td>' + video.duree + '</td>';
            html+= '<td>' + video.poids + '</td>';
            html+= '<td>' + video.resolution + '</td>';
            html+= '<td>' + holo + '</td>';
            html+= '<td><input type="button" value="Supprimer" class="btn btn-danger" onclick="deleteVideo('+video.id+', '+video.utilisateurId+')"></a></td></tr></tbody>';

            $table = $('table');
            $table.append(html);

            $.get(apiUrl + 'utilisateurs').then(function (utilisateurs) {
                utilisateurs.forEach(function (utilisateur) {

                    if(video.utilisateurId === utilisateur.id){
                        $('<td>'+utilisateur.username+'</td>').insertAfter($("td[id='name"+video.id+"']"));
                    }
                })
            })
        })
    })
}

function getDatasA(){

    let html = '<div class="container"><h2 style="margin-bottom: 70px">Vidéos</h2>';
    html += '<div style="overflow-x:auto;"><table class="table">';
    html += '<thead><tr><th>Titre</th><th>Url</th><th>Durée</th><th>Poids</th><th>Résolution</th><th>Holographique</th></tr></thead>';
    html += '</table></div></div>';

    $('body').append(html);

    $.get(apiUrl + 'utilisateurs/'+ window.localStorage.getItem('accessToken') + '/idUser').then(function (res) {

        $.get(apiUrl + 'utilisateurs/'+ res.idUser + '/videos').then(function (videos) {

            videos.forEach(function (video) {

                let holo;
                switch (video.holographique) {
                    case 0:
                        holo = 'non';
                        break;
                    case 1:
                        holo = 'oui';
                        break;
                    case 2:
                        holo = 'les deux';
                        break;
                    default:
                        holo = 'pas renseigné';
                }

                let html = '<tbody><tr id="' + video.id + '">';
                html += '<td id="name' + video.id + '">' + video.nomVideo + '</td>';
                html += '<td>' + video.url + '</td>';
                html += '<td>' + video.duree + '</td>';
                html += '<td>' + video.poids + '</td>';
                html += '<td>' + video.resolution + '</td>';
                html += '<td>' + holo + '</td></tbody>';

                $table = $('table');
                $table.append(html);
            })
        })
    })
}


function deleteVideo(id, fk) {
    $.ajax({
        url: apiUrl+ 'videos/'+id+ '/utilisateur/'+fk,
        type: 'DELETE',
        success: function() {
            window.location="http://localhost:3000/admin/video"
        }
    });
}