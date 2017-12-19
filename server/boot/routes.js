// All variables that will be used again
module.exports = function(app) {
    const LoginCtrl = require('../../controller/LoginController');
    const HolocubeCtrl = require('../../controller/HolocubeController');
    const UtilisateurCtrl = require('../../controller/UtilisateurController');
    const PlaylistCtrl = require('../../controller/PlaylistController');
    const VideoCtrl = require('../../controller/VideoController');

    const router = app.loopback.Router();
    const playlistVideo = app.models.playlist_video;
    const video = app.models.video;
    const holocube = app.models.holocube;
    const utilisateur = app.models.utilisateur;
    const playlist = app.models.playlist;
    const role = app.models.Role;
    const roleMapping = app.models.RoleMapping;
    const accessToken = app.models.AccessToken;

    const videoController = new VideoCtrl(video, utilisateur, role, roleMapping, accessToken, playlistVideo);
    const loginController = new LoginCtrl(utilisateur, accessToken, role, roleMapping);
    const utilisateurController = new UtilisateurCtrl(utilisateur, role, roleMapping, accessToken, holocube, video, playlist, playlistVideo);
    const holocubeController = new HolocubeCtrl(holocube, utilisateur, playlist, accessToken, role, roleMapping);
    const playlistController = new PlaylistCtrl(playlist, holocube, utilisateur, video, playlistVideo, accessToken, role, roleMapping);


    if (typeof localStorage === "undefined" || localStorage === null) {
        const LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
    }
    // index of the website
    router.get('/', function (req, res) {

        if (localStorage.getItem('accessToken')) {
            res.render('index', {
                accessToken: true
            });
        }
        else {
            res.render('index', {
                accessToken: false
            });
        }
    });

    // login page
    router.get('/login', loginController.getLoginAction)
    // page where you send the data and connect the user
    .post('/login', loginController.postLoginAction.bind(loginController));

    // homepage of the back office
    router.get('/admin', utilisateurController.getAdminAction.bind(utilisateurController));

    // log a user out
    router.get('/logout', loginController.getLogoutAction.bind(loginController));


//\\//\\    HOLOCUBE    //\\//\\

    // index page
    router.get('/admin/holocube', function (req, res) {
        res.render('back/hologramme/index')
    });

    // new holocube
    router.get('/admin/holocube/new', function (req, res) {
        res.render('back/hologramme/new')
    });

    // edit holocube
    router.get('/admin/holocube/:id/edit', function (req, res) {
        let id = req.params.id;
        res.render('back/hologramme/edit', {
            id: id
        })
    });



//\\//\\    UTILISATEUR     //\\//\\

    //index page
    router.get('/admin/utilisateur', function (req, res) {
        res.render('back/utilisateur/index');
    });

    router.get('/admin/utilisateur/new', utilisateurController.getUtilisateurNewAction.bind(utilisateurController));
    //.post('/admin/utilisateur/new', utilisateurController.postUtilisateurNewAction.bind(utilisateurController));

    router.get('/admin/utilisateur/profil/edit', utilisateurController.getUtilisateurProfilEditAction.bind(utilisateurController));
        //.post('/admin/utilisateur/profil/edit', utilisateurController.postUtilisateurProfilEdit.bind(utilisateurController));

    router.get('/admin/utilisateur/:id/edit', utilisateurController.getUtilisateurEditAction.bind(utilisateurController))
    .post('/admin/utilisateur/:id/edit', utilisateurController.postUtilisateurEditAction.bind(utilisateurController));

    router.get('/admin/utilisateur/:id/change-password', utilisateurController.getUtilisateurChangePasswordAction.bind(utilisateurController))
        .post('/admin/utilisateur/:id/change-password', utilisateurController.postUtilisateurChangePasswordAction.bind(utilisateurController));

    router.get('/admin/utilisateur/:id/delete', utilisateurController.getUtilisateurDeleteAction.bind(utilisateurController));

    router.get('/admin/utilisateur/profil', utilisateurController.getUtilisateurProfilAction.bind(utilisateurController));

    router.get('/password-reset', utilisateurController.getUtilisateurPasswordReset)
        .post('/request-password-reset', utilisateurController.postUtilisateurPasswordReset.bind(utilisateurController));

    router.get('/new-password', utilisateurController.getUtilisateurNewPasswordAction)
        .post('/new-password', utilisateurController.postUtilisateurNewPasswordAction.bind(utilisateurController));


//\\//\\    PLAYLIST     //\\//\\

    // index page
    router.get('/admin/playlist', function (req, res) {
        res.render('back/playlist/index', {
            id: false
        })
    });
    router.get('/admin/play', function (req, res) {
       res.render('back/playlist/play');
    });
    // delete playlist
    // .post('/admin/playlist', playlistController.postPlaylistDelete.bind(playlistController));

    // new playlist
    router.get('/admin/playlist/new', function (req, res) {
        res.render('back/playlist/new', {
            id: false
        })
    });
    // new playlist when you send the POST data
    // .post('/admin/playlist/new', playlistController.postPlaylistNew.bind(playlistController));

    // edit playlist
    router.get('/admin/playlist/:id/edit', function (req, res) {
        let id = req.params.id;
        res.render('back/playlist/edit', {
            id: id,
            user: false
        })
    });
    // edit playlist when you send the POST data
    // .post('/admin/playlist/:id/edit', playlistController.postPlaylistEdit.bind(playlistController));

    // delete playlist
    // router.get('/admin/playlist/:id/delete', playlistController.getPlaylistDelete.bind(playlistController));


//\\//\\    PLAYLIST ADMIN    //\\//\\

    // list of clients where you can choose on which one you want to see/add/edit/delete playlists
    router.get('/admin/clientplaylist', function (req, res) {
        res.render('back/playlist/clientList')
    });

    // index page
    router.get('/admin/playlist/:id', function (req, res) {
        let id = req.params.id;
        res.render('back/playlist/index', {
            id: id
        })
    });
    // delete playlist
    // .post('/admin/playlist/:id', playlistController.postPlaylistDelete.bind(playlistController));

    // new playlist
    router.get('/admin/playlist/:id/new', function (req, res) {
        let id = req.params.id;
        res.render('back/playlist/new', {
            id: id
        })
    });
    // new playlist when you send the POST data
    // .post('/admin/playlist/:id/new', playlistController.postPlaylistNew.bind(playlistController));

    // edit playlist
    router.get('/admin/playlist/:id/edit/:user', function (req, res) {
        let id = req.params.id;
        let user = req.params.user;
        res.render('back/playlist/edit', {
            id: id,
            user: user
        })
    });
    // edit playlist when you send the POST data
    // .post('/admin/playlist/:id/edit/:user', playlistController.postPlaylistEdit.bind(playlistController));

    // delete playlist
    // router.get('/admin/playlist/:id/delete/:user', playlistController.getPlaylistDelete.bind(playlistController));


//\\//\\    VIDEO    //\\//\\

    // index page
    router.get('/admin/video',function (req, res) {
      res.render('back/video/index');
    });

    // new video
 //   router.get('/admin/video/new', videoController.getVideoNew.bind(videoController))
    // new playlist when you send the POST data
  //  .post('/admin/video/new', videoController.postVideoNew.bind(videoController));

   // router.get('/admin/video/:id/edit', videoController.getVideoEditAction.bind(videoController))
     //   .post('/admin/video/:id/edit', videoController.postVideoEditAction.bind(videoController));

    router.get('/admin/video/new', function (req, res) {
        res.render('back/video/new');
    });
    router.post('/admin/video/new', function (req, res) {
        let obj = {};
        console.log('body: ' + JSON.stringify(req.body));
        res.send(req.body);
    });

    // delete holocube
    router.get('/admin/video/:id/delete', videoController.getVideoDelete.bind(videoController));

    app.use(router);
};