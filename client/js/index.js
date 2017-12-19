let accessToken = localStorage.getItem('accessToken');
let apiUrl = 'http://localhost:3000/api/';

$(document).ready(function() {

    $ul = $('ul.navbar-right');
    $facebook = $('#facebook');
    $twitter = $('#twitter');
    $linkedin = $('#linkedin');

    $ul.on('click', 'a#disconnect', disconnect);
    $facebook.on('click', facebook);
    $twitter.on('click', twitter);
    $linkedin.on('click', linkedin);

    if (accessToken !== null) {

        $ul.append('<li><a href="/admin">Gestion</a></li><li><a id="disconnect" href="">Déconnexion</a></li>')
    }
    else {

        $ul.append('<li><a href="/login">Connexion</a></li>')
    }
});

function disconnect(e) {

    e.preventDefault();

    $.post(apiUrl + 'utilisateurs/logout?access_token=' + localStorage.getItem('accessToken')).then(function () {

        window.localStorage.removeItem('accessToken');
        window.location = "http://localhost:3000/";
    });
}

function facebook() {
    window.location = "https://www.facebook.com/gustavbycocktail";
}

function twitter() {
    window.location = "https://twitter.com/Gustav_by_C";
}

function linkedin() {
    window.location = "https://www.linkedin.com/company/gustav-by-cocktail";
}