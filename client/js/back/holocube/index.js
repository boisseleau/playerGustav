$(document).ready(function() {

    let accessToken = localStorage.getItem('accessToken');

    if(accessToken !== null) {

        getDatas(accessToken)
    }
});

function getDatas(accessToken) {

    $.get(apiUrl+ 'utilisateurs/' + accessToken +'/idUser').then(function (resultat) {

        $.get(apiUrl + 'videos/' + accessToken + '/role').then(function (res) {

            if (res.role === "admin") {

                $.get(apiUrl + 'utilisateurs/' + resultat.idUser + '/holocubes').then(function (holocubes) {

                    html = '<div class="container"><h2 style="margin-bottom: 70px">Holocubes</h2>';
                    html += '<div style="overflow-x:auto;"><table class="table"><thead><tr><th>Nom</th>';
                    html += '<th>Adresse IP</th>';
                    html += '<th>Mot de passe</th>';
                    html += '</tr></thead></table></div></div>';

                    $('body').append(html);

                    holocubes.forEach(function (holocube) {


                        html = '<tbody><tr id="' + holocube.id + '">';
                        html += '<td>' + holocube.nomHolocube + '</td>';
                        html += '<td>' + holocube.adresseIP + '</td>';
                        html += '<td id="mdpHolocube' + holocube.id + '">' + holocube.mdp + '</td></tr></tbody>';

                        $('table').append(html);
                    })
                })
            }

            if (res.role === "superAdmin") {

                html = '<div class="container"><h2>Holocubes</h2>';
                html += '<div id="liens"><div id="create"><a id="newHolo" href="/admin/holocube/new" class="btn btn-default">Créer un nouvel holocube</a></div>';
                html += '<div id="supp"><input id="supMult" type="submit" onclick="deleteMult()" value="Supprimer la sélection" class="btn btn-danger"></div></div>';
                html += '<div style="overflow-x:auto;"><table class="table"><thead><tr><th>Nom</th>';
                html += '<th>Adresse IP</th>';
                html += '<th>Mot de passe</th>';
                html += '<th id="client">Client</th><th></th><th></th></tr></thead></table></div></div>';

                $('body').append(html);

                $.get(apiUrl + 'holocubes').then(function (holocubes) {
                    holocubes.forEach(function (holocube) {

                        html = '<tbody><tr id="' + holocube.id + '">';
                        html += '<td>' + holocube.nomHolocube + '</td>';
                        html += '<td>' + holocube.adresseIP + '</td>';
                        html += '<td id="mdpHolocube' + holocube.id + '">' + holocube.mdp + '</td>';
                        html += '<td><a href="/admin/holocube/' + holocube.id + '/edit" class="btn btn-warning">Modifier</a></td>';
                        html += '<td><input type="button" value="Supprimer" class="btn btn-danger" onclick="deleteHolocube(' + holocube.id + ')"></a></td>';
                        html += '<td><input type="checkbox" name="supprimer" value="' + holocube.id + '"></td></tr></tbody>';

                        $('table').append(html);

                        $.get(apiUrl + 'utilisateurs').then(function (utilisateurs) {
                            utilisateurs.forEach(function (utilisateur) {

                                if (holocube.utilisateurId === utilisateur.id) {
                                    $('<td>' + utilisateur.username + '</td>').insertAfter($("td[id='mdpHolocube" + holocube.id + "']"));
                                }
                            })
                        });

                        if(holocube.utilisateurId === 0) {
                            $('<td></td>').insertAfter($("td[id='mdpHolocube" + holocube.id + "']"));
                        }
                    })
                })
            }
        })
    })
}

function deleteMult() {

    $("input:checkbox:checked").map(function() {

        deleteHolocube($(this).val())
    })
}

function deleteHolocube(holocubeId) {

    $.ajax({
        url: apiUrl+ 'holocubes/'+holocubeId,
        type: 'DELETE',
        success: function() {
            $("tr[id="+holocubeId+"]").remove()
        }
    });
}




