
'use strict';
let CONTAINERS_URL = '/api/containers/';
module.exports = function(Video) {
    const remotes = require('strong-remoting').create();
    const fs = remotes.exports.fs = require('fs');
    // function that returns the role of the current user


    Video.upload = function(req, res, user_folder, cb) {
        
        let container = Video.app.models.Container;

        //recover all the containers
        container.getContainers(function (err, containers) {
            //recover all the containers with the user_folder
            if (containers.some(function(e) { return e.name === user_folder; })) {
                //If one of result match uploader in this container
                container.upload(req, res, {container: user_folder}, cb);
            }
            else {
                cb(err);
            }
        });
    };

    Video.remoteMethod(
        'upload',
        {
            description: 'Uploads a file',
            http: {path: '/:container/upload', verb: 'post'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'container', type: 'string'}
            ],
            returns: {arg: 'status', type: 'string'}
        }
    );

    Video.afterRemote('upload', function(ctx, modelInstance, next) {
        let fs = require('fs');
        let files = ctx.result.status.files;

            let oldPath = 'server/video/' + files.file[0].container + '/' + files.file[0].name;
            let newPath = 'server/video/'+ files.file[0].container +'/.uploads/' + files.file[0].name;
            //Reading of the file
            fs.readFile(oldPath, function(err, data) {
                //Writing of the file in another folder
                fs.writeFile(newPath, data, function(err) {
                    if(err) next(err);
                    //removed old file path
                    fs.unlink(oldPath, function(err) {
                        if (err) {
                            console.error("error unlinking", err);
                            next(err);
                        }
                        console.log("File uploaded to: " + newPath);
                    });
                });
            });
        next();
    });

    Video.deleteVideo = function(req, res, id, fk, cb) {
        let fs = require('fs');
        let path;

        let user = Video.app.models.utilisateur;

        user.findById(fk, function (err, utilisateur) {
            if (err) throw err;
            Video.findById(id, function (err, video) {
                if (err) throw err;
                path = 'server/video/' + utilisateur.folder + '/.uploads/' + video.nomVideo;
                fs.unlink(path, function(err) {
                    if (err) {
                        console.error("error unlinking", err);
                        throw err;
                    }
                    Video.destroyAll({id : video.id}, function (err, videoo) {
                        if (err) throw err;
                    });
                    console.log("File delete to: " + path);
                    cb(null);
                });
            });

        })


    };

    Video.remoteMethod(
        'deleteVideo',
        {
            description: 'Delete Video',
            http: {path: '/:id/utilisateur/:fk', verb: 'delete'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'id', type: 'number'},
                {arg: 'fk', type: 'number'}
            ],
            returns: {arg: 'status', type: 'string'}
        }
    );

    Video.role = function (req, res, access, cb) {

        // retrieve the accessToken of the current user
        let AccessToken = Video.app.models.AccessToken;

        // find the proper accessToken that matches the one in the local storage
        AccessToken.findById(access, [], function (err, currentAccessToken) {
            if (err) throw err;

            let User = Video.app.models.utilisateur;
            // find the proper user that matches the current access token
            User.findById(currentAccessToken.userId, [], function (err, utilisateur) {
                if (err) throw err;

                let RoleMapping = Video.app.models.RoleMapping;
                //Find the role mapping related to the current user
                 RoleMapping.find({ where : { principalId: utilisateur.id}}, function (err, RoleMappings) {
                    if (err) throw err;

                    //Since the RoleMapping only returns one occurrence, there is no need for a forEach
                    let currentRoleMapping = RoleMappings[0];

                    let Role = Video.app.models.Role;
                    // Find the role that corresponds to the user
                    Role.findById(currentRoleMapping.roleId, function (err, role) {
                        if (err) throw err;

                        // return the role's name
                        let superAdmin = role.name;
                        return cb(null,superAdmin);
                    })
                })
            })
        })
    };

    Video.remoteMethod(
        'role',
        {
            description: 'Find the role of the user that owns the accessToken',
            http: {path: '/:token/role', verb: 'get'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'token', type: 'string'}
            ],
            returns: {arg: 'role', type: 'string'}
        }
    );
};

//                         // find the proper user that matches the current access token
//                         User.findById(currentAccesstoken.userId, [], function (err, currentUser) {
//
//                             res.render('back/video/index', {
//                                 videos: Videos,
//                                 utilisateurs: Users,
//                                 currentUser: currentUser,
//                                 role: role,
//                                 err: false,
//                                 forbidden: false
//                             })
//                         })
//                     })
//                 })
//             })
//         })
//     };
//
//     Video.postDelete = function (req, res, User, Role, RoleMapping, AccessToken, PlaylistVideo) {
//         if (!localStorage.getItem('accessToken')) {
//             return res.sendStatus(401);
//         }
//
//         //post datas
//         let videos = (typeof req.body.supprimer ==='undefined') ? [] : req.body.supprimer;
//
//         // find the role of the current user
//         Video.role(Role, RoleMapping, AccessToken, User, function(role) {
//
//             // find all videos
//             Video.find({}, function (err, Videos) {
//                 if (err) throw err;
//
//                 // find all users
//                 User.find({}, function (err, Users) {
//                     if (err) throw err;
//
//                     // find the proper accessToken that matches the one in the local storage
//                     AccessToken.findById(localStorage.getItem('accessToken'), [], function (err, currentAccesstoken) {
//                         if (err) throw err;
//
//                         // find the proper user that matches the current access token
//                         User.findById(currentAccesstoken.userId, [], function (err, currentUser) {
//
//                             if(role === "superAdmin") {
//
//                                 if (videos instanceof Array) {}
//                                 else videos = [videos];
//
//                                 videos.forEach(function (video) {
//
//                                     // Destroy the playlist_video(s) which is/are related to the video
//                                     PlaylistVideo.destroyAll({"videoId": parseInt(video)}, function (err) {
//                                         if (err) {
//                                             return res.render('back/playlist/index', {
//                                                 videos: Videos,
//                                                 utilisateurs: Users,
//                                                 currentUser: currentUser,
//                                                 role: role,
//                                                 err: true,
//                                                 forbidden: false
//                                             })
//                                         }
//                                     });
//
//                                     // destroy the video with the proper id
//                                     Video.destroyById(parseInt(video), function (err) {
//                                         if (err) {
//                                             return res.render('back/video/index', {
//                                                 videos: Videos,
//                                                 utilisateurs: Users,
//                                                 currentUser: currentUser,
//                                                 role: role,
//                                                 err: true,
//                                                 forbidden: false
//                                             })
//                                         }
//                                     })
//                                 });
//                                 setTimeout(function () {
//                                     res.redirect('/admin/video')
//                                 }, 500)
//                             }
//                             else {
//                                 return res.render('back/video/index', {
//                                     videos: Videos,
//                                     utilisateurs: Users,
//                                     currentUser: currentUser,
//                                     role: role,
//                                     err: false,
//                                     forbidden: true
//                                 });
//                             }
//                         })
//                     })
//                 })
//             })
//         })
//     };
//
//     Video.getNew = function (req, res, User, Role, RoleMapping, AccessToken) {
//         if (!localStorage.getItem('accessToken')) {
//             return res.sendStatus(401);
//
//         // function that returns the role of the current user
//         Video.role(Role, RoleMapping, AccessToken, User, function(role) {
//
//             if(role === "superAdmin") {
//
//                 // find all users
//                 User.find({}, function (err, Users) {
//                     if (err) throw err;
//
//                     return res.render('back/video/new', {
//                         err: false,
//                         utilisateurs: Users,
//                         client: false,
//                         titre: false,
//                         adresseURL: false,
//                         duree: false,
//                         poids: false,
//                         resolution: false,
//                         Holographiques: false,
//                         role: role
//                     })
//                 })
//             }
//             else res.sendStatus(403)
//         })
//     };
//
//     Video.postNew = function (req, res, User, Role, RoleMapping, AccessToken) {
//         //check if the user is an authenticated user
//         if (!localStorage.getItem('accessToken')) {
//             return res.sendStatus(401);
//         }
//
//         //post datas
//         let titre = req.body.titre;
//         let adresseURL = req.body.adresseURL;
//         let duree = req.body.duree;
//         let poids = req.body.poids;
//         let resolution = req.body.resolution;
//         let client = req.body.client;
//         let holographiques = (typeof req.body.holographique ==='undefined') ? [] : req.body.holographique;
//
//         // function that returns the role of the current user
//         Video.role(Role, RoleMapping, AccessToken, User, function (role) {
//
//             if(role === "superAdmin") {
//
//                 // find all users
//                 User.find({}, function (err, Users) {
//                     if (err) throw err;
//
//                     let holographique;
//
//                     // Verify if the user checked one or several chechboxes
//                     if (holographiques instanceof Array) {
//                         if(holographiques.length === 0) holographique = null;
//                          else holographique = 2
//                     }
//                     else {
//                         holographique = parseInt(holographiques);
//                         holographiques = [holographiques];
//                     }
//
//                     if(holographique === null) {
//
//                         return res.render('back/video/new', {
//                             titre: titre,
//                             adresseURL: adresseURL,
//                             duree: duree,
//                             poids: poids,
//                             resolution: resolution,
//                             Holographiques: holographiques,
//                             client: client,
//                             utilisateurs: Users,
//                             role: role,
//                             err: "Vous devez obligatoirement cocher au moins une des cases pour le type de vidéo"
//                         });
//                     }
//                     else {
//
//                         //Register a new video
//                         Video.create({
//                             nomVideo: titre,
//                             url: adresseURL,
//                             duree: duree,
//                             poids: poids,
//                             resolution: resolution,
//                             holographique: holographique,
//                             utilisateurId: client
//                         }, function (err, video) {
//                             if (err) {
//                                 return res.render('back/video/new', {
//                                     titre: titre,
//                                     adresseURL: adresseURL,
//                                     duree: duree,
//                                     poids: poids,
//                                     resolution: resolution,
//                                     Holographiques: holographiques,
//                                     client: client,
//                                     utilisateurs: Users,
//                                     role: role,
//                                     err: "L'enregistrement a échoué, veuillez recommencer"
//                                 });
//                             }
//                             res.redirect('/admin/video')
//                             // Penser à ajouter un message de réussite qui disparait ensuite
//                         })
//                     }
//                 })
//             }
//             else res.sendStatus(403)
//         })
//     };
//
//     Video.getDelete = function (req, res, User, Role, RoleMapping, AccessToken, PlaylistVideo) {
//
//         if (!localStorage.getItem('accessToken')) {
//             return res.sendStatus(401);
//         }
//
//         // find the role of the current user
//         Video.role(Role, RoleMapping, AccessToken, User, function (role) {
//
//             // retrieve the video's id from the request
//             let videoId = req.params.id;
//
//             // find all videos
//             Video.find({}, function (err, Videos) {
//                 if (err) throw err;
//
//                 // find all users
//                 User.find({}, function (err, Users) {
//                     if (err) throw err;
//
//                     // find the proper accessToken that matches the one in the local storage
//                     AccessToken.findById(localStorage.getItem('accessToken'), [], function (err, currentAccesstoken) {
//                         if (err) throw err;
//
//                         // find the proper user that matches the current access token
//                         User.findById(currentAccesstoken.userId, [], function (err, currentUser) {
//
//                             if(role === "superAdmin") {
//
//                                 // Destroy the playlist_video(s) which is/are related to the video
//                                 PlaylistVideo.destroyAll({"videoId": videoId}, function (err) {
//                                     if (err) {
//                                         return res.render('back/playlist/index', {
//                                             videos: Videos,
//                                             utilisateurs: Users,
//                                             currentUser: currentUser,
//                                             role: role,
//                                             err: true,
//                                             forbidden: false
//                                         })
//                                     }
//                                 });
//
//                                 // destroy the video with the proper id
//                                 Video.destroyById(videoId, function (err) {
//                                     if (err) {
//                                         return res.render('back/video/index', {
//                                             videos: Videos,
//                                             utilisateurs: Users,
//                                             currentUser: currentUser,
//                                             role: role,
//                                             err: true,
//                                             forbidden: false
//                                         });
//                                     }
//                                     res.redirect('/admin/video')
//                                 })
//                             }
//                             else {
//                                 return res.render('back/video/index', {
//                                     videos: Videos,
//                                     utilisateurs: Users,
//                                     currentUser: currentUser,
//                                     role: role,
//                                     err: false,
//                                     forbidden: true
//                                 });
//                             }
//                         })
//                     })
//                 })
//             })
//         })
//     };

