class UtilisateurController {

    constructor(user, role, roleMap, accessToken, holocube, video, playlist, playlistVideo, container) {
        this.user = user;
        this.role = role;
        this.roleMap = roleMap;
        this.accessToken = accessToken;
        this.holocub = holocube;
        this.video = video;
        this.playlist = playlist;
        this.playlistVideo = playlistVideo;
        this.container = container
    }

    getUtilisateurListAction(req, res){

        this.user.list(req, res, this.role, this.roleMap, this.accessToken);
    }

    getUtilisateurNewAction(req, res){
        this.user.getNew(req, res, this.role, this.roleMap, this.accessToken);
    }

    postUtilisateurNewAction(req, res){
        this.user.postNew(req, res, this.role, this.roleMap, this.container);
    }

    getUtilisateurEditAction(req, res){
        this.user.getEdit(req, res, this.role, this.roleMap, this.accessToken);
    }

    postUtilisateurEditAction(req, res){
        this.user.postEdit(req, res);
    }

    getUtilisateurChangePasswordAction(req, res){
        this.user.getChangePassword(req, res, this.role, this.roleMap, this.accessToken);
    }

    postUtilisateurChangePasswordAction(req, res){
        this.user.postChangePassword(req, res);
    }

    getUtilisateurDeleteAction(req, res){
        this.user.getDelete(req, res, this.role, this.roleMap, this.accessToken, this.holocub, this.video, this.playlist, this.playlistVideo);
    }

    getUtilisateurProfilAction(req, res){
        this.user.getProfil(req, res, this.accessToken, this.roleMap, this.role);
    }

    getUtilisateurProfilEditAction(req, res){
        this.user.getProfilEdit(req, res, this.accessToken, this.roleMap, this.role);
    }

    postUtilisateurProfilEdit(req, res){
        this.user.postProfilEdit(req, res, this.accessToken);
    }

    getUtilisateurPasswordReset(req, res){
        res.render('back/utilisateur/resetPassword');
    }

    postUtilisateurPasswordReset(req, res){
    };

    getUtilisateurNewPasswordAction(req, res){
        res.render('back/utilisateur/newPassword');
    }

    postUtilisateurNewPasswordAction(req, res){
            this.user.postNewPassword(req, res, this.accessToken);

    }

    getAdminAction(req, res){
        this.user.getAdminAction(req, res, this.role, this.roleMap, this.accessToken)

    }



}

module.exports = UtilisateurController;