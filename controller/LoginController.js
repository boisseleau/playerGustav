class LoginController {

    constructor(user) {
        this.user = user;
    }


    getLoginAction(req, res){

        if (!localStorage.getItem('accessToken')) {
            res.render('login', {
                loginFailed: false
            });
        }
        else res.redirect('/admin')
    }

    postLoginAction(req, res){
        this.user.connect(req, res);
    }

    getLogoutAction(req, res){
        this.user.getDisconnect(req, res);
    }
}

module.exports = LoginController;