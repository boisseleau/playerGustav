let apiUrl = 'http://localhost:3000/api/';

$(document).ready(function() {
    let $body = $('body');
    let accessToken = localStorage.getItem('accessToken');
    if(accessToken !== null) {

        $.get(apiUrl+ 'videos/'+localStorage.getItem('accessToken')+'/role').then(function(res) {
            if (res.role === "admin") {

                let html = '<div id="banner"><img id="bannerTitle" src="../../img/transparent.png"></div><div class="navbar navbar-inverse"><div class="navbar-header">';
                html += '<button aria-controls="navbar" aria-expanded="false" class="navbar-toggle collapsed"data-target="#navbar" data-toggle="collapse" type="button" data-parent="#parent">';
                html += '<span class="sr-only">Toogle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>';
                html += '<a class="navbar-brand" href="/">Accueil</a></div>';
                html += '<nav class="collapse navbar-collapse" id="navbar"><ul class="nav navbar-nav navbar-left">';
                html += '<li><a href="/admin/holocube">Holocubes</a></li>';
                html += '<li><a href="/admin/video">Vidéos</a></li>';
                html += '<li><a href="/admin/playlist">Playlists</a></li>';
                html += '<li><a href="/admin/utilisateur/profil">Profil</a></li></ul>';
                html += '<ul class="nav navbar-nav navbar-right"><li><a id="disconnect" href="#"><span class="glyphicon glyphicon-log-in"></span> Deconnexion</a></li></ul></nav></div>';

                $body.prepend(html);
                $('#disconnect').on('click', disconnect);
            }
            if (res.role === "superAdmin"){
                let html = '<div id="banner"><img id="bannerTitle" src="../../img/transparent.png"></div><div class="navbar navbar-inverse"><div class="navbar-header">';
                html += '<button aria-controls="navbar" aria-expanded="false" class="navbar-toggle collapsed"data-target="#navbar" data-toggle="collapse" type="button" data-parent="#parent">';
                html += '<span class="sr-only">Toogle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>';
                html += '<a class="navbar-brand" href="/">Accueil</a></div>';
                html += '<nav class="collapse navbar-collapse" id="navbar"><ul class="nav navbar-nav navbar-left">';
                html += '<li><a href="/admin/utilisateur">Utilisateurs</a></li>';
                html += '<li><a href="/admin/holocube">Holocubes</a></li>';
                html += '<li><a href="/admin/video">Vidéos</a></li>';
                html += '<li><a href="/admin/clientplaylist">Playlists</a></li>';
                html += '<li><a href="/admin/utilisateur/profil">Profil</a></li></ul>';
                html += '<ul class="nav navbar-nav navbar-right"><li><a id="disconnect" href="#"><span class="glyphicon glyphicon-log-in"></span> Deconnexion</a></li></ul></div></nav>'

                $body.prepend(html);
                $('#disconnect').on('click', disconnect);
            }
        })
    }
    else {

        let html = '<h1>Erreur 401</h1>';
        html += "<h2>Vous n'avez pas accès à cette partie du site</h2>";

        $body.append(html);
    }
});



function disconnect(e) {
    e.preventDefault();

    $.post(apiUrl + 'utilisateurs/logout?access_token=' + localStorage.getItem('accessToken')).then(function () {

        window.localStorage.removeItem('accessToken');
        window.location = "http://localhost:3000/";
    });
}

