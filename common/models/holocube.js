'use strict';

module.exports = function(Holocube) {

    // function that returns the role of the current user
    Holocube.role = function (Role, RoleMapping, AccessToken, User, Callback) {

        // retrieve the accessToken of the current user
        let accessToken = localStorage.getItem('accessToken');

        // find the proper accessToken that matches the one in the local storage
        AccessToken.findById(accessToken, [], function (err, currentAccessToken) {
            if (err) throw err;

            // find the proper user that matches the current access token
            User.findById(currentAccessToken.userId, [], function (err, utilisateur) {
                if (err) throw err;

                //Find the role mapping related to the current user
                return RoleMapping.find({ where : { principalId: utilisateur.id}}, function (err, RoleMappings) {
                    if (err) throw err;

                    //Since the RoleMapping only returns one occurrence, there is no need for a forEach
                    let currentRoleMapping = RoleMappings[0];

                    // Find the role that corresponds to the user
                    return Role.findById(currentRoleMapping.roleId, function (err, role) {
                        if (err) throw err;

                        // return the role's name
                        let superAdmin = role.name;
                        return Callback(superAdmin);
                    })
                })
            })
        })
    };



    /*Holocube.afterRemote('create', function(ctx, holocube, next) {

        let fs = require('fs');
        let id = holocube.utilisateurId;

        let user = Holocube.app.models.utilisateur;

        user.findById(id, function (err, utilisateur) {
            if (err) throw err;

            fs.mkdir('./server/video/'+ utilisateur.folder +'/'+ holocube.folder,function(err){
                if (err) {
                    return console.error(err);
                }
                console.log("Directory created successfully!");
            });
        });

        next();
    });*/

    //Display the list of all holocubes
    Holocube.list = function (req, res, User, Playlist, AccessToken, Role, RoleMapping) {

        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        // find all holocubes
        Holocube.find({}, function (err, Holocubes) {
            if(err) throw err;

            // find all users
            User.find({}, function (err, Users) {
                if (err) throw err;

                // find all playlists
                Playlist.find({}, function (err, Playlists) {
                    if (err) throw err;

                    // find the proper accessToken that matches the one in the local storage
                    AccessToken.findById(localStorage.getItem('accessToken'), [], function (err, currentAccesstoken) {
                        if (err) throw err;

                        // find the proper user that matches the current access token
                        User.findById(currentAccesstoken.userId, [], function (err, currentUser) {

                            // function that returns the role of the current user
                            Holocube.role(Role, RoleMapping, AccessToken, User, function (role) {

                                res.render('back/hologramme/index', {
                                    holocubes: Holocubes,
                                    utilisateurs: Users,
                                    playlists: Playlists,
                                    currentUser: currentUser,
                                    role: role,
                                    err: false,
                                    forbidden: false
                                })
                            })
                        })
                    })
                })
            })
        })
    };

    Holocube.postDelete = function (req, res, User, Playlist, AccessToken, Role, RoleMapping) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        //post datas
        let holocubes = (typeof req.body.supprimer ==='undefined') ? [] : req.body.supprimer;

        // find all holocubes
        Holocube.find({}, function (err, Holocubes) {
            if(err) throw err;

            // find all users
            User.find({}, function (err, Users) {
                if (err) throw err;

                // find all playlists
                Playlist.find({}, function (err, Playlists) {
                    if (err) throw err;

                    // find the proper accessToken that matches the one in the local storage
                    AccessToken.findById(localStorage.getItem('accessToken'), [], function (err, currentAccesstoken) {
                        if (err) throw err;

                        // find the proper user that matches the current access token
                        User.findById(currentAccesstoken.userId, [], function (err, currentUser) {

                            // function that returns the role of the current user
                            Holocube.role(Role, RoleMapping, AccessToken, User, function (role) {

                                if(role === "superAdmin") {

                                    if (holocubes instanceof Array) {}
                                    else holocubes = [holocubes];

                                    holocubes.forEach(function (holocube) {

                                        // destroy the holocube with the proper id
                                        Holocube.destroyById(parseInt(holocube), function (err) {
                                            if (err) {
                                                return res.render('back/hologramme/index', {
                                                    holocubes: Holocubes,
                                                    utilisateurs: Users,
                                                    playlists: Playlists,
                                                    currentUser: currentUser,
                                                    role: role,
                                                    err: true,
                                                    forbidden: false
                                                })
                                            }
                                        })
                                    });
                                    setTimeout(function () {
                                        res.redirect('/admin/holocube')
                                    }, 500)
                                }
                                else {
                                    return res.render('back/hologramme/index', {
                                        holocubes: Holocubes,
                                        utilisateurs: Users,
                                        playlists: Playlists,
                                        currentUser: currentUser,
                                        role: role,
                                        err: false,
                                        forbidden: true
                                    });
                                }
                            })
                        })
                    })
                })
            })
        })
    };
    
    // Display the page where you create a new holocube
    Holocube.getNew = function (req, res, User, AccessToken, Role, RoleMapping) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        // function that returns the role of the current user
        Holocube.role(Role, RoleMapping, AccessToken, User, function (role) {

            if(role === "superAdmin") {

                // find all users
                User.find({}, function (err, Users) {
                    if (err) throw err;

                    return res.render('new', {
                        err: false,
                        utilisateurs: Users,
                        client: false,
                        nom: false,
                        adresseIP: false,
                        mdp: false,
                        role: role
                    })
                })
            }
            else res.sendStatus(403)
        })
    };

    // Register the datas entered by the user for the creation of a holocube
    Holocube.postNew =  function (req, res, User, AccessToken, Role, RoleMapping) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        //post datas
        let nom = req.body.nom;
        let adresseIP = req.body.adresseIP;
        let mdp = req.body.password;
        let client = req.body.client;

        // function that returns the role of the current user
        Holocube.role(Role, RoleMapping, AccessToken, User, function (role) {

            if(role === "superAdmin") {

                // find all users
                User.find({}, function (err, Users) {
                    if (err) throw err;

                    // //Register a new holocube
                    // Holocube.create({
                    //     nomHolocube: nom,
                    //     adresseIP: adresseIP,
                    //     mdp: mdp,
                    //     utilisateurId: client
                    // }, function (err, holocube) {
                    //     if (err) {
                    //         return res.render('back/hologramme/new', {
                    //             nom: nom,
                    //             adresseIP: adresseIP,
                    //             mdp: mdp,
                    //             client: client,
                    //             utilisateurs: Users,
                    //             role: role,
                    //             err: true
                    //         });
                    //     }
                    //     res.redirect('/admin/holocube')
                    //     // Penser à ajouter un message de réussite qui disparait ensuite
                    //
                    // })
                })
            }
            else res.sendStatus(403)
        })
    };

    // Display the page where you modify a holocube
    Holocube.getEdit = function (req, res, User, AccessToken, Role, RoleMapping) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }
        // retrieve the holocube's id from the request
        let holocubeId = req.params.id;

        // function that returns the role of the current user
        Holocube.role(Role, RoleMapping, AccessToken, User, function (role) {

            if(role === "superAdmin") {

                // find the current holocube
                Holocube.findById(holocubeId, function (err, currentHolocube) {
                    if(err) throw err;

                    // find all users
                    User.find({}, function (err, Users) {
                        if(err) throw err;

                        if(currentHolocube === null) res.render('response', {
                            title: 'Holocube introuvable',
                            content: "Cet holocube n'existe pas ou a été supprimé",
                            redirectTo: '/admin/holocube'
                        });
                        else {
                            return res.render('back/hologramme/edit', {
                                err: false,
                                holocube: currentHolocube,
                                utilisateurs: Users,
                                client: false,
                                nom: false,
                                adresseIP: false,
                                role: role,
                                mdp: false
                            })
                        }
                    })
                })
            }
            else res.sendStatus(403)
        })
    };

    // Register the datas entered by the user for the modification of a holocube
    Holocube.postEdit = function (req, res, User, AccessToken, Role, RoleMapping) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        // retrieve the holocube's id from the request
        let holocubeId = req.params.id;

        //post datas
        let nom = req.body.nom;
        let adresseIP = req.body.adresseIP;
        let mdp = req.body.password;
        let client = req.body.client;

        // function that returns the role of the current user
        Holocube.role(Role, RoleMapping, AccessToken, User, function (role) {

            if(role === "superAdmin") {

                // find all users
                User.find({}, function (err, Users) {
                    if (err) throw err;

                    // Update the holocube
                    Holocube.updateAll({id: holocubeId}, {
                        nomHolocube: nom,
                        adresseIP: adresseIP,
                        mdp: mdp,
                        utilisateurId: client
                    }, function (err, holocube) {
                        if (err) {
                            return res.render('back/hologramme/new', {
                                nom: nom,
                                adresseIP: adresseIP,
                                mdp: mdp,
                                client: client,
                                utilisateurs: Users,
                                role: role,
                                err: true
                            });
                        }
                        res.redirect('/admin/holocube')
                    })
                })
            }
            else res.sendStatus(403)
        })
    };

    // Delete the selected holocube
    Holocube.getDelete = function (req, res, User, Playlist, AccessToken, Role, RoleMapping) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }
        // Penser à ajouter une fenêtre de confirmation avant (pop-up)
        // retrieve the holocube's id from the request
        let holocubeId = req.params.id;

        // find all holocubes
        Holocube.find({}, function (err, Holocubes) {
            if (err) throw err;

            // find all users
            User.find({}, function (err, Users) {
                if (err) throw err;

                // find all playlists
                Playlist.find({}, function (err, Playlists) {
                    if (err) throw err;

                    // find the proper accessToken that matches the one in the local storage
                    AccessToken.findById(localStorage.getItem('accessToken'), [], function (err, currentAccesstoken) {
                        if (err) throw err;

                        // find the proper user that matches the current access token
                        User.findById(currentAccesstoken.userId, [], function (err, currentUser) {

                            // function that returns the role of the current user
                            Holocube.role(Role, RoleMapping, AccessToken, User, function (role) {

                                if(role === "superAdmin") {

                                    // destroy the holocube with the proper id
                                    Holocube.destroyById(holocubeId, function (err) {
                                        if (err) {
                                            return res.render('back/hologramme/index', {
                                                holocubes: Holocubes,
                                                utilisateurs: Users,
                                                playlists: Playlists,
                                                currentUser: currentUser,
                                                role: role,
                                                err: true,
                                                forbidden: false
                                            });
                                        }
                                        res.redirect('/admin/holocube')
                                    })
                                }
                                else {
                                    return res.render('back/hologramme/index', {
                                        holocubes: Holocubes,
                                        utilisateurs: Users,
                                        playlists: Playlists,
                                        currentUser: currentUser,
                                        role: role,
                                        err: false,
                                        forbidden: true
                                    });
                                }
                            })
                        })
                    })
                })
            })
        })
    }
};
