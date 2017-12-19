let $email, $password;
let apiUrl = 'http://localhost:3000/api/';
let accessToken = localStorage.getItem('accessToken');

$(document).ready(function() {

    $('#submit').on('click', handleForm);
    $email = $('#email');
    $password = $('#password');

    if (accessToken !== null) {
        window.location="http://localhost:3000/admin" ;
    }
});

function handleForm(e) {
    e.preventDefault();

    let login = {
        email: $email.val() ,
        password: $password.val()

    };

    if($email.val() === "" || $password.val() === "") {

        $('#error').html('Veuillez remplir tous les champs')
    }
    else {

        $.ajax({
            url: apiUrl+ 'utilisateurs/login',
            type: 'POST',
            data: login,
            success: function (res) {
                window.localStorage.setItem('accessToken', res.id);
                window.location="http://localhost:3000/admin" ;
            },
            error: function (err) {
                if(err.status === 401) {
                    $('#error').html("L'email ou le mot de passe est incorrect")
                }
            }
        });
    }
}