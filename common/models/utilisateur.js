'use strict';
const config = require('../../server/config.json');
const path = require('path');

module.exports = function(Utilisateur) {



    Utilisateur.idUser = function (req, res, access, cb) {

        // retrieve the accessToken of the current user
        let AccessToken = Utilisateur.app.models.AccessToken;

        // find the proper accessToken that matches the one in the local storage
        AccessToken.findById(access, [], function (err, currentAccessToken) {
            if (err) cb(err);

            // find the proper user that matches the current access token
            Utilisateur.findById(currentAccessToken.userId, [], function (err, utilisateur) {
                if (err) cb(err);

                // return the role's name
                let userId = utilisateur.id;
                return cb(null, userId);
            })
        })
    };

    Utilisateur.remoteMethod(
        'idUser',
        {
            description: 'Find the id of the user that owns the accessToken',
            http: {path: '/:token/idUser', verb: 'get'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'token', type: 'string'}
            ],
            returns: {arg: 'idUser', type: 'number'}
        }
    );



    Utilisateur.on('resetPasswordRequest', function(info) {
        let url = 'http://' + config.host + ':' + config.port + '/new-password';
        let html = 'Click <a href="' + url + '?access_token=' +
            info.accessToken.id + '">here</a> to reset your password';

        Utilisateur.app.models.Email.send({
            to: info.email,
            from: 'boisseleau85430@gmail.com',
            subject: 'Password reset',
            html: html,
        }, function(err) {
            if (err) return console.log('> error sending password reset email', info.email, err);
            console.log('> sending password reset email to:', info.email);
        });
    });

    Utilisateur.connect = function (req, res) {
        let email = req.body.email;
        let password = req.body.password;

        if (!localStorage.getItem('accessToken')) {

            Utilisateur.login({
                email: email,
                password: password
            }, 'utilisateur', function (err, token) {
                if (err) {
                    return res.render('login', {
                        email: email,
                        password: password,
                        loginFailed: true
                    });
                }

                token = token.toJSON();
                let accessToken = token.id;
                    console.log(accessToken);
                localStorage.setItem('accessToken', accessToken);
                console.log(localStorage.getItem('accessToken'));


                res.redirect('/admin');
            });
        }
        else res.redirect('/admin')
    };

    Utilisateur.getDisconnect = function (req, res) {
        if (!localStorage.getItem('accessToken')) return res.sendStatus(401); //return 401:unauthorized if accessToken is not present
        Utilisateur.logout(localStorage.getItem('accessToken'), function(err) {
            if (err)  throw err;

            localStorage.removeItem('accessToken');

            res.redirect('/'); //on successful logout, redirect
        });
    };


    Utilisateur.list = function (req, res) {
        res.render('back/utilisateur/index');
    };
    
        Utilisateur.getNew = function (req, res, role, roleMap, access) {
        // if (!localStorage.getItem('accessToken')) {
        //     return res.sendStatus(401);
        // }
        //     Utilisateur.role(role, roleMap, access, function(response) {
            // if (response === 'superAdmin') {
                    Utilisateur.find({}, function (err, utilisateurs) {
                        if (err) {}

                        return res.render('back/utilisateur/new', {
                            err: false,
                            utilisateurs: utilisateurs
                        });
                    });
                // }else{
                //     return res.sendStatus(403);
                // }
            // });
        };


    Utilisateur.afterRemote('create', function(ctx, utilisateur, next) {

        let rolemap = Utilisateur.app.models.RoleMapping;
        rolemap.create({
            principalType: "USER",
            principalId: utilisateur.id,
            roleId: 1,
            utilisateurId: utilisateur.id
        });

        let options = {
            type: 'email',
            from: 'My Application'
        };
        utilisateur.verify(options, function(err) {
            console.log('Error verify', err);
            if (err){
                next(err);
            }
        });

        Utilisateur.app.models.Container.createContainer({name: `${utilisateur.folder}`},(response, error ) => {
            let fs = require('fs');
            fs.mkdir('./server/video/'+ utilisateur.folder +'/.uploads',function(err){
                if (err) {
                    console.error(err);
                    next(err)
                }
                console.log("Directory created successfully!");
            });
        });

        next();
    });


    Utilisateur.getEdit = function (req, res) {

                let utilisateurId = req.params.id;
                        res.render('back/utilisateur/edit', {
                            id: utilisateurId,
                        });
    };


    Utilisateur.editUtilisateur = function (req, res, id, next, cb) {

        let utilisateurId = id;
        let nom = req.body.username;
        let mail = req.body.email;

        Utilisateur.findById(utilisateurId, function (err, utilisateur) {
            if (err) return cb(err);
            utilisateur.updateAttributes({username: nom, email: mail},
                 function (err, utilisateur) {
                    if (err) return cb(err);
                    cb(null, utilisateur);

                });
        });
        next
    };
    
    Utilisateur.remoteMethod(
        'editUtilisateur',
        {
            description: 'update User',
            http: {path: '/:id/update', verb: 'put'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'id', type: 'number'},
                {arg: 'data', type: 'object', 'http': {source: 'body'}},

            ],
            returns: [
                {arg: 'username', type: 'string'},
                {arg: 'email', type: 'string'}
                ],
        }
    );


    Utilisateur.getChangePassword = function (req, res) {

             let utilisateurId = req.params.id;
                     return res.render('back/utilisateur/changePassword', {
                         id: utilisateurId,
                     });
               };


    Utilisateur.ChangedPassword = function (req, res, id, oldPass, newPass, confirme, cb) {


        //verify passwords match
        if (newPass !== confirme) {
            return cb(res.sendStatus(400));
        }

        Utilisateur.findById(id, function(err, user) {
            if (err) return cb(res.sendStatus(404));
            user.hasPassword(oldPass, function(err, isMatch) {
                if (!isMatch) {
                    return cb(res.sendStatus(401));
                } else {
                    user.updateAttribute('password', (newPass), function (err, user) {
                        if (err) cb(err);
                        console.log('> password change request processed successfully');
                        cb(null);
                    });
                }
            });
        });

    };

    Utilisateur.remoteMethod(
        'ChangedPassword',
        {
            description: 'Changed password',
            http: {path: '/:id/ChangePassword', verb: 'put'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'id', type: 'number'},
                {arg: 'oldpassword', type: 'string'},
                {arg: 'newpassword', type: 'string'},
                {arg: 'confirmation', type: 'string'},

            ],
            returns:
                {arg: 'status', type: 'string'},
        }
    );


    Utilisateur.deleteUtilisateur = function (req, res, id, cb) {
                // Penser à ajouter une fenêtre de confirmation avant (pop-up)
                let userId = parseInt(id);

                let holocube = Utilisateur.app.models.holocube;
                holocube.destroyAll({utilisateurId : userId}, function (err, holoc) {
                    if (err) throw err;
                });

                let playlistVideo = Utilisateur.app.models.playlist_video;
                playlistVideo.find({}, function (err, playVideo) {
                    if (err) throw err;
                    console.log(playVideo);
                });

                let video = Utilisateur.app.models.video;
                video.find({ where : {utilisateurId : userId}}, function (err, videoo) {
                    if (err) throw err;

                    videoo.forEach(function (videos) {

                        playlistVideo.destroyAll({videoId : videos.id}, function (err, playVideo) {
                            if (err) throw err;

                            video.destroyAll({utilisateurId : userId}, function (err, videoo) {
                                if (err) throw err;
                            });
                        });
                    });
                });

                let roleMap = Utilisateur.app.models.RoleMapping;
                roleMap.destroyAll({ utilisateurId : userId }, function (err, rolemap) {
                    if (err) throw err;
                });

                let playlist = Utilisateur.app.models.playlist;
                playlist.destroyAll({utilisateurId : userId}, function (err, playlist) {
                    if (err) throw err;
                });
                Utilisateur.findById(userId, function (err, utilisateur) {
                    if(err) throw err;
                    Utilisateur.destroyById(userId, function (err, done) {
                        if(err) throw err;

                        cb(null, utilisateur);
                    })
                })
    };

    Utilisateur.remoteMethod(
        'deleteUtilisateur',
        {
            description: 'Delete User',
            http: {path: '/:id/all', verb: 'delete'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'id', type: 'number'}
            ],
            returns: {arg: 'status', type: 'string'}
        }
    );

    Utilisateur.afterRemote('deleteUtilisateur', function(ctx, utilisateur, next) {

        console.log(utilisateur);
        let fs = require('fs');
        let path = 'server/video/' + utilisateur.status.folder + '/.uploads' ;
        let path2 = 'server/video/' + utilisateur.status.folder ;
        fs.readdir(path, function(err, files) {
            if (err) {
                console.error("error rmdir", err);
                throw err;
            }
            files.forEach(function (file) {
                let pathh = 'server/video/' + utilisateur.status.folder + '/.uploads/' + file;
                fs.unlink(pathh, function (err) {
                    if (err) {
                        console.error("error unlink", err);
                        throw err;
                    }
                })
            });
        });
           setTimeout(function () {
               fs.rmdir(path, function(err) {
                if (err) {
                    console.error("error rmdir", err);
                    throw err;
                }
                    fs.rmdir(path2, function (err) {
                        if (err) {
                            console.error("error rmdir", err);
                            throw err;
                        }
                    })

            });
           }, 200);

        next();
    });



    Utilisateur.getProfil = function (req, res) {
        res.render('back/utilisateur/profil');
    };


    Utilisateur.getProfilEdit = function (req, res) {
         res.render('back/utilisateur/profilEdit');
    };



    Utilisateur.NewPassword = function (req, res, access, password, confirmation, cb) {
        let accessToken = Utilisateur.app.models.AccessToken;
        console.log(access);
        accessToken.findById(access, [], function (err, accessTok) {
            console.log(accessTok);
            if (err) return cb(res.sendStatus(403));

            if(!accessTok) {
                return cb(res.sendStatus(403));
            }

            //verify passwords match
            if (password !== confirmation) {
                return cb(res.sendStatus(400));
            }

            if(accessTok) {
                Utilisateur.findById(accessTok.userId, function (err, user) {
                    if (err) cb(err);
                    user.updateAttribute('password', (password), function (err, user) {
                        if (err) cb(err);
                        console.log('> password change request processed successfully');
                        cb(null);
                    });

                });
            }else{
                cb(res.sendStatus(403));
            }
        });
    };

    Utilisateur.remoteMethod(
        'NewPassword',
        {
            description: 'Changed password',
            http: {path: '/:token/resetPassword', verb: 'put'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'token', type: 'string'},
                {arg: 'newpassword', type: 'string'},
                {arg: 'confirmation', type: 'string'},

            ],
            returns:
                {arg: 'status', type: 'string'},
        }
    );

    Utilisateur.getAdminAction = function(req, res) {

            res.render('back/home');
    };

    Utilisateur.idUser = function (req, res, access, cb) {

        // retrieve the accessToken of the current user
        let AccessToken = Utilisateur.app.models.AccessToken;

        // find the proper accessToken that matches the one in the local storage
        AccessToken.findById(access, [], function (err, currentAccessToken) {
            if (err) cb(err);

            // find the proper user that matches the current access token
            Utilisateur.findById(currentAccessToken.userId, [], function (err, utilisateur) {
                if (err) cb(err);

                // return the role's name
                let userId = utilisateur.id;
                return cb(null, userId);
            })
        })
    };

    Utilisateur.remoteMethod(
        'idUser',
        {
            description: 'Find the id of the user that owns the accessToken',
            http: {path: '/:token/idUser', verb: 'get'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'token', type: 'string'}
            ],
            returns: {arg: 'idUser', type: 'number'}
        }
    )

};
