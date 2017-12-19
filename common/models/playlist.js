'use strict';

module.exports = function(Playlist) {

//\\//\\//\\//\\    PLAYLIST     //\\//\\//\\//\\

    // function that returns the role of the current user
    Playlist.role = function (Role, RoleMapping, AccessToken, User, Callback) {

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

    Playlist.transferVideo = function (req, res, container, file, holocube, cb) {
        let fs = require('fs');
        let videoPath = 'server/video/'+ container +'/.uploads/' + file;
        let playPath = 'server/video/'+ container + '/' + holocube + '/' + file;

        fs.readFile(videoPath, function(err, data) {
            fs.writeFile(playPath, data, function(err) {
                if(err)throw err;
                    console.log("File uploaded to: " + playPath);
                    cb(null);
            });
        });

    };

    Playlist.remoteMethod(
        'transferVideo',
        {
            description: 'upload video in playlist',
            http: {path: '/transfer', verb: 'post'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'container', type: 'string'},
                {arg: 'file', type: 'string'},
                {arg: 'holocube', type: 'string'}

            ],
            returns:
                {arg: 'status', type: 'string'},
        }
    );

    Playlist.getPlaylist = function (req, res, container, holocube, cb) {
        let fs = require('fs');
        let playPath = 'server/video/'+ container + '/' + holocube+ '/' ;

        fs.readdir(playPath, function(err, data) {
            console.log(data);
                console.log("File list to: " + playPath);
                cb(null, data);
        });

    };

    Playlist.remoteMethod(
        'getPlaylist',
        {
            description: 'Find a playlist by {{id}} from the folder server',
            http: {path: '/transfer', verb: 'get'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'container', type: 'string'},
                {arg: 'holocube', type: 'string'}

            ],
            returns:
                {arg: 'playlist', type: 'string'},
        }
    );

    Playlist.getList = function (req, res, Holocube, User, Video, PlaylistVideo, AccessToken, RoleMapping, Role) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        let user;
        let admin;

        // Check if the user is on the admin root or the basic root
        if(req.params.id) {
            user = req.params.id;
            admin = true;
            callback()
        }
        else {
            // find the proper accessToken that matches the one in the local storage
            AccessToken.findById(localStorage.getItem('accessToken'), [], function (err, currentAccesstoken) {
                if (err) throw err;

                // find the proper user that matches the current access token
                User.findById(currentAccesstoken.userId, [], function (err, currentUser) {
                    user = currentUser.id;
                    admin = false;
                    callback()
                })
            })
        }

        function callback() {
            // find all playlists
            Playlist.find({where: {utilisateurId: user}}, function (err, Playlists) {
                if (err) throw err;

                // find the proper user
                User.findById(user, [], function (err, selectedUser) {
                    if (err) throw err;

                    if(selectedUser !== null) {

                        // find all holocubes
                        Holocube.find({}, function (err, Holocubes) {
                            if (err) throw err;

                            // find all videos
                            Video.find({}, function (err, Videos) {
                                if (err) throw err;

                                // find all playlist_video
                                PlaylistVideo.find({}, function (err, PlaylistsVideos) {
                                    if (err) throw err;

                                    // Check if the user is on the admin root or the basic root
                                    if (admin === true) {

                                        // function that returns the role of the current user
                                        Playlist.role(Role, RoleMapping, AccessToken, User, function (role) {

                                            //If the user is on the admin root, we need to check if he really is an admin
                                            if (role === "superAdmin") {
                                                res.render('back/playlist/index', {
                                                    videos: Videos,
                                                    holocubes: Holocubes,
                                                    playlists: Playlists,
                                                    playlistsVideos: PlaylistsVideos,
                                                    utilisateur: selectedUser,
                                                    admin: admin,
                                                    role: role,
                                                    err: false
                                                })
                                            }
                                            else res.sendStatus(403)
                                        })
                                    }
                                    else {
                                        res.render('back/playlist/index', {
                                            videos: Videos,
                                            holocubes: Holocubes,
                                            playlists: Playlists,
                                            playlistsVideos: PlaylistsVideos,
                                            utilisateur: selectedUser,
                                            admin: admin,
                                            role: "admin",
                                            err: false
                                        })
                                    }
                                })
                            })
                        })
                    }
                    else res.render('response', {
                        title: 'Utilisateur introuvable',
                        content: "Cet utilisateur n'existe pas ou a été supprimé",
                        redirectTo: '/admin'
                    });
                })
            })
        }
    };

    Playlist.postDelete = function (req, res, Holocube, User, Video, PlaylistVideo, AccessToken, RoleMapping, Role) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        //post datas
        let playlists = (typeof req.body.supprimer ==='undefined') ? [] : req.body.supprimer;

        // retrieve the user's id from the request
        let user;
        // variable that will be used to tell if a user is an admin or not
        let admin;

        // Check if the user is on the admin root or the basic root
        if(req.params.id) {
            user = req.params.id;
            admin = true;
            callback()
        }
        else {
            // find the proper accessToken that matches the one in the local storage
            AccessToken.findById(localStorage.getItem('accessToken'), [], function (err, currentAccesstoken) {
                if (err) throw err;

                // find the proper user that matches the current access token
                User.findById(currentAccesstoken.userId, [], function (err, currentUser) {
                    user = currentUser.id;
                    admin = false;
                    callback()
                })
            })
        }

        function callback() {
            // find all playlists
            Playlist.find({where: {utilisateurId: user}}, function (err, Playlists) {
                if (err) throw err;

                // find the proper user
                User.findById(user, [], function (err, selectedUser) {
                    if (err) throw err;

                    // find all holocubes
                    Holocube.find({}, function (err, Holocubes) {
                        if (err) throw err;

                        // find all videos
                        Video.find({}, function (err, Videos) {
                            if (err) throw err;

                            // find all playlist_video
                            PlaylistVideo.find({}, function (err, PlaylistsVideos) {
                                if (err) throw err;

                                // Check if the user is on the admin root or the basic root
                                if(admin === true) {

                                    // function that returns the role of the current user
                                    Playlist.role(Role, RoleMapping, AccessToken, User, function (role) {

                                        //If the user is on the admin root, we need to check if he really is an admin
                                        if(role === "superAdmin") {

                                            destroyPlaylist(Playlists, selectedUser, Holocubes, Videos, PlaylistsVideos, admin, role)
                                        }
                                        else res.sendStatus(403)
                                    })
                                }
                                else {
                                    let role = "admin";
                                    destroyPlaylist(Playlists, selectedUser, Holocubes, Videos, PlaylistsVideos, admin, role)
                                }
                            })
                        })
                    })
                })
            })
        }

        function destroyPlaylist(Playlists, selectedUser, Holocubes, Videos, PlaylistsVideos, admin, role) {

            if (playlists instanceof Array) {}
            else playlists = [playlists];

            playlists.forEach(function (playlist) {

                // Destroy the playlist_video(s) which is/are related to the playlist
                PlaylistVideo.destroyAll({"playlistId": playlist}, function (err) {
                    if (err) {
                        return res.render('back/playlist/index', {
                            videos: Videos,
                            holocubes: Holocubes,
                            playlists: Playlists,
                            playlistsVideos: PlaylistsVideos,
                            utilisateur: selectedUser,
                            admin: admin,
                            err: true,
                            role: role
                        })
                    }
                });

                // Update the holocube's playlistId to null since the playlist is destroyed
                Holocube.find({where: {playlistId: playlist}}, function (err, Holos) {

                    Holos.forEach(function (currentHolocube) {

                        currentHolocube.updateAttribute("playlistId", null, function (err) {
                            if (err) {
                                return res.render('back/playlist/index', {
                                    videos: Videos,
                                    holocubes: Holocubes,
                                    playlists: Playlists,
                                    playlistsVideos: PlaylistsVideos,
                                    utilisateur: selectedUser,
                                    admin: admin,
                                    role: role,
                                    err: true
                                })
                            }
                        })
                    })
                });

                // Destroy the playlist
                Playlist.destroyById(playlist, function (err) {
                    if (err) {
                        return res.render('back/playlist/index', {
                            videos: Videos,
                            holocubes: Holocubes,
                            playlists: Playlists,
                            playlistsVideos: PlaylistsVideos,
                            utilisateur: selectedUser,
                            admin: admin,
                            role: role,
                            err: true
                        });
                    }
                })
            });
            setTimeout(function () {
                if (admin === true) {
                    res.redirect('/admin/playlist/' + user);
                }
                else res.redirect('/admin/playlist')
            }, 500)
        }
    };


    // Display the page where you create a new playlist
    Playlist.getNew = function (req, res, Holocube, User, Video, AccessToken, RoleMapping, Role) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        // The current user
        let user;
        // True or false depending on its role
        let admin;

        // Check if the user is an admin or a basic user depending on the id in the root
        if(req.params.id) {
            user = req.params.id;
            admin = true;
            callback()
        }
        else {
            // find the proper accessToken that matches the one in the local storage
            AccessToken.findById(localStorage.getItem('accessToken'), [], function (err, currentAccesstoken) {
                if (err) throw err;

                // find the proper user that matches the current access token
                User.findById(currentAccesstoken.userId, [], function (err, currentUser) {
                    user = currentUser.id;
                    admin = false;
                    callback()
                })
            })
        }

        function callback() {

            // find all holocubes
            Holocube.find({where: {utilisateurId: user}}, function (err, Holocubes) {
                if (err) throw err;

                // find all videos
                Video.find({where: {utilisateurId: user}}, function (err, Videos) {
                    if (err) throw err;

                    // find the proper user
                    User.findById(user, [], function (err, selectedUser) {
                        if (err) throw err;

                        if(selectedUser !== null) {

                            // Check if the user is on the admin root or the basic root
                            if (admin === true) {

                                // function that returns the role of the current user
                                Playlist.role(Role, RoleMapping, AccessToken, User, function (role) {

                                    //If the user is on the admin root, we need to check if he really is an admin
                                    if (role === "superAdmin") {
                                        return res.render('back/playlist/new', {
                                            err: false,
                                            videos: Videos,
                                            holocubes: Holocubes,
                                            utilisateur: selectedUser,
                                            admin: admin,
                                            nom: false,
                                            role: role,
                                            Holocubes: false,
                                            Videos: false
                                        })
                                    }
                                    else res.sendStatus(403)
                                })
                            }
                            else {
                                return res.render('back/playlist/new', {
                                    err: false,
                                    videos: Videos,
                                    holocubes: Holocubes,
                                    utilisateur: selectedUser,
                                    admin: admin,
                                    nom: false,
                                    role: "admin",
                                    Holocubes: false,
                                    Videos: false
                                })
                            }
                        }
                        else res.render('response', {
                            title: 'Utilisateur introuvable',
                            content: "Cet utilisateur n'existe pas ou a été supprimé",
                            redirectTo: '/admin'
                        });
                    })
                })
            })
        }
    };

    // Register the datas entered by the user for the creation of a playlist
    Playlist.postNew = function (req, res, Holocube, User, Video, PlaylistVideo, AccessToken,  RoleMapping, Role) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        //post datas
        let nom = req.body.nom;
        let client = req.body.client;
        let holocubes = (typeof req.body.holocube==='undefined') ? [] : req.body.holocube;
        let videos = (typeof req.body.video==='undefined') ? [] : req.body.video;
        let admin = req.body.admin;

        if(admin === "true") admin = true;
        else admin = false;

        // Verify if the user checked one or several videos
        if (videos instanceof Array) {}
        else videos = [videos];

        // Verify if the user checked one or several holocubes
        if (holocubes instanceof Array) {}
        else holocubes = [holocubes];

        // Check if the user is on the admin root or the basic root
        if(admin === true) {

            // function that returns the role of the current user
            Playlist.role(Role, RoleMapping, AccessToken, User, function (role) {

                //If the user is on the admin root, we need to check if he really is an admin
                if(role === "superAdmin") {

                    createPlaylist(role)
                }
                else res.sendStatus(403)
            })
        }
        else {
            let role = "admin";
            createPlaylist(role)
        }

        function createPlaylist(role) {

            // find all holocubes
            Holocube.find({where: {utilisateurId: client}}, function (err, Holocubes) {
                if (err) throw err;

                // find all videos
                Video.find({where: {utilisateurId: client}}, function (err, Videos) {
                    if (err) throw err;

                    // find the proper user
                    User.findById(client, [], function (err, selectedUser) {
                        if (err) throw err;

                        // Register a new playlist
                        Playlist.create({
                            nomPlaylist: nom,
                            utilisateurId: client,
                        }, function (err, playlist) {
                            if (err) {
                                return res.render('back/playlist/new', {
                                    nom: nom,
                                    utilisateur: selectedUser,
                                    Holocubes: holocubes,
                                    Videos: videos,
                                    admin: admin,
                                    err: true,
                                    role: role,
                                    holocubes: Holocubes,
                                    videos: Videos
                                })
                            }

                            //Check if it is necessary to register a playlist_video
                            if (videos.length !== 0) {
                                videos.forEach(function (video) {

                                    // Register a new playlist_video related to the new playlist for each videos
                                    PlaylistVideo.create({
                                        playlistId: playlist.id,
                                        videoId: video
                                    }, function (err) {
                                        if (err) {
                                            return res.render('back/playlist/new', {
                                                nom: nom,
                                                utilisateur: selectedUser,
                                                Holocubes: holocubes,
                                                Videos: videos,
                                                admin: admin,
                                                err: true,
                                                role: role,
                                                holocubes: Holocubes,
                                                videos: Videos
                                            })
                                        }
                                    })
                                });
                            }

                            //Check if it is necessary to register a holocube
                            if (holocubes.length !== 0) {
                                holocubes.forEach(function (holocube) {

                                    //Find the holocube that need to be updated
                                    Holocube.findById(holocube, [], function (err, currentHolo) {

                                        // Updated the attribute playlist of the proper holocube
                                        currentHolo.updateAttribute("playlistId", playlist.id, function (err) {
                                            if (err) {
                                                return res.render('back/playlist/new', {
                                                    nom: nom,
                                                    utilisateur: selectedUser,
                                                    Holocubes: holocubes,
                                                    Videos: videos,
                                                    admin: admin,
                                                    err: true,
                                                    role: role,
                                                    holocubes: Holocubes,
                                                    videos: Videos
                                                })
                                            }
                                        })
                                    })
                                });
                            }

                            setTimeout(function () {
                                if (admin === true) res.redirect('/admin/playlist/' + client);
                                else res.redirect('/admin/playlist')
                            }, 500)
                        })
                    })
                })
            })
        }
    };

    // Display the page where you modify a playlist
    Playlist.getEdit = function (req, res, Holocube, User, Video, PlaylistVideo, AccessToken, RoleMapping, Role) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        let admin;

        // Check if the admin or the user is modifying the playlist
        if(req.params.user) {
            admin = true;
        }
        else admin = false;

        // retrieve the playlist's id from the request
        let playlistId = req.params.id;

        // find the current playlist
        Playlist.findById(playlistId, [], function (err, playlist) {
            if(err) throw err;

            if(playlist !== null) {

                // find the current owner of the playlist
                User.findById(playlist.utilisateurId, [], function (err, currentUser) {
                    if (err) throw err;

                    // find all holocubes
                    Holocube.find({where: {utilisateurId: currentUser.id}}, function (err, Holocubes) {
                        if (err) throw err;

                        // find all videos
                        Video.find({where: {utilisateurId: currentUser.id}}, function (err, Videos) {
                            if (err) throw err;

                            // find all playlist_video
                            PlaylistVideo.find({}, function (err, VideosPlaylists) {
                                if (err) throw err;

                                // Check if the user is on the admin root or the basic root
                                if (admin === true) {

                                    // function that returns the role of the current user
                                    Playlist.role(Role, RoleMapping, AccessToken, User, function (role) {

                                        //If the user is on the admin root, we need to check if he really is an admin
                                        if (role === "superAdmin") {
                                            return res.render('back/playlist/edit', {
                                                err: false,
                                                playlist: playlist,
                                                videos: Videos,
                                                holocubes: Holocubes,
                                                utilisateur: currentUser,
                                                videosPlaylists: VideosPlaylists,
                                                admin: admin,
                                                role: role,
                                                nom: false,
                                                client: false,
                                                Holocubes: false,
                                                Videos: false
                                            })
                                        }
                                        else res.sendStatus(403)
                                    })
                                }
                                else {
                                    return res.render('back/playlist/edit', {
                                        err: false,
                                        playlist: playlist,
                                        videos: Videos,
                                        holocubes: Holocubes,
                                        utilisateur: currentUser,
                                        videosPlaylists: VideosPlaylists,
                                        admin: admin,
                                        role: "admin",
                                        nom: false,
                                        client: false,
                                        Holocubes: false,
                                        Videos: false
                                    })
                                }
                            })
                        })
                    })
                })
            }
            else res.render('response', {
                title: 'Playlist introuvable',
                content: "Cette playlist n'existe pas ou a été supprimée",
                redirectTo: '/admin'
            })
        })
    };

    // Register the datas entered by the user for the modification of a playlist
    Playlist.postEdit = function(req, res, Holocube, User, Video, PlaylistVideo, AccessToken, RoleMapping, Role) {
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        //post datas
        let playlistId = req.params.id;
        let nom = req.body.nom;
        let client = req.body.client;
        let holocubes = (typeof req.body.holocube==='undefined') ? [] : req.body.holocube;
        let videos = (typeof req.body.video==='undefined') ? [] : req.body.video;
        let admin = req.body.admin;

        if(admin === "true") admin = true;
        else admin = false;

        // Verify if the user checked one or several videos
        if (videos instanceof Array) {}
        else videos = [videos];

        // Verify if the user checked one or several holocubes
        if (holocubes instanceof Array) {}
        else holocubes = [holocubes];

        // Check if the user is on the admin root or the basic root
        if(admin === true) {

            // function that returns the role of the current user
            Playlist.role(Role, RoleMapping, AccessToken, User, function (role) {

                //If the user is on the admin root, we need to check if he really is an admin
                if(role === "superAdmin") {

                    modifyPlaylist(role)
                }
                else res.sendStatus(403)
            })
        }
        else {
            let role = "admin";
            modifyPlaylist(role)
        }

        function modifyPlaylist(role) {

            // find the current playlist
            Playlist.findById(playlistId, [], function (err, playlist) {
                if (err) throw err;

                // find the current owner of the playlist
                User.findById(client, [], function (err, currentUser) {
                    if (err) throw err;

                    // find all holocubes
                    Holocube.find({where: {utilisateurId: currentUser.id}}, function (err, Holocubes) {
                        if (err) throw err;

                        // find all videos
                        Video.find({where: {utilisateurId: currentUser.id}}, function (err, Videos) {
                            if (err) throw err;

                            // find all playlist_video
                            PlaylistVideo.find({}, function (err, VideosPlaylists) {
                                if (err) throw err;

                                // Modify a playlist
                                Playlist.updateAll({id: playlistId}, {
                                    nomPlaylist: nom,
                                    utilisateurId: client
                                }, function (err, playlist) {
                                    if (err) {
                                        return res.render('back/playlist/edit', {
                                            nom: nom,
                                            client: client,
                                            Holocubes: holocubes,
                                            Videos: videos,
                                            err: true,
                                            admin: admin,
                                            playlist: playlist,
                                            utilisateur: currentUser,
                                            videos: Videos,
                                            holocubes: Holocubes,
                                            videosPlaylists: VideosPlaylists,
                                            role: role
                                        })
                                    }
                                });


                                videos.forEach(function (video) {

                                    // Retrieve all the playlist_video which contain both the proper playlistId et the videoId
                                    PlaylistVideo.find({where: {and: [{videoId: video}, {playlistId: playlistId}]}}, function (err, PlaylistsVideos) {
                                        if (err) throw err;

                                        // Check if the video was already in the playlist_video, if not then create it
                                        if (PlaylistsVideos.length !== 0) {
                                        }
                                        else {
                                            PlaylistVideo.create({
                                                playlistId: playlistId,
                                                videoId: video
                                            }, function (err) {
                                                if (err) {
                                                    return res.render('back/playlist/edit', {
                                                        nom: nom,
                                                        client: client,
                                                        Holocubes: holocubes,
                                                        Videos: videos,
                                                        err: true,
                                                        admin: admin,
                                                        playlist: playlist,
                                                        utilisateur: currentUser,
                                                        videos: Videos,
                                                        holocubes: Holocubes,
                                                        videosPlaylists: VideosPlaylists,
                                                        role: role
                                                    })
                                                }
                                            })
                                        }
                                    })
                                });


                                // Retrieve all the playlist_video which contain the proper playlistId
                                PlaylistVideo.find({where: {playlistId: playlistId}}, function (err, PlaylistsVideos) {
                                    if (err) throw err;
                                    let compteur = 0;

                                    PlaylistsVideos.forEach(function (currentVideoPlaylist) {

                                        videos.forEach(function (video) {

                                            // increment the counter if the video is found both in the database and in the checked videos
                                            if (currentVideoPlaylist.videoId === parseInt(video)) compteur++
                                        });

                                        // If the counter equal 0, then the playlist_video is destroyed because the user unchecked the video
                                        if (compteur === 0) {
                                            PlaylistVideo.destroyById(currentVideoPlaylist.id, function (err) {

                                                if (err) {
                                                    return res.render('back/playlist/edit', {
                                                        nom: nom,
                                                        client: client,
                                                        Holocubes: holocubes,
                                                        Videos: videos,
                                                        err: true,
                                                        admin: admin,
                                                        playlist: playlist,
                                                        utilisateur: currentUser,
                                                        videos: Videos,
                                                        holocubes: Holocubes,
                                                        videosPlaylists: VideosPlaylists,
                                                        role: role
                                                    })
                                                }
                                            })
                                        }
                                        compteur = 0;
                                    })
                                });


                                holocubes.forEach(function (holo) {

                                    // Find all the holocubes that match the checked holocubes
                                    Holocube.findById(holo, [], function (err, correctHolo) {
                                        if (err) throw err;

                                        // Check if the holocube has the correct playlist
                                        if (correctHolo.playlistId === parseInt(playlistId)) {
                                        }
                                        // Update the playlist attribute of the holocube if it isn't the case
                                        else {
                                            correctHolo.updateAttribute("playlistId", playlistId, function (err) {
                                                if (err) {
                                                    return res.render('back/playlist/edit', {
                                                        nom: nom,
                                                        client: client,
                                                        Holocubes: holocubes,
                                                        Videos: videos,
                                                        err: true,
                                                        admin: admin,
                                                        playlist: playlist,
                                                        utilisateur: currentUser,
                                                        videos: Videos,
                                                        holocubes: Holocubes,
                                                        videosPlaylists: VideosPlaylists,
                                                        role: role
                                                    })
                                                }
                                            })
                                        }
                                    })
                                });


                                // Retrieve all the holocubes which contain the proper playlistId
                                Holocube.find({where: {playlistId: playlistId}}, function (err, Holocubes) {
                                    if (err) throw err;
                                    let compteur = 0;

                                    Holocubes.forEach(function (currentHolocube) {

                                        holocubes.forEach(function (holocube) {

                                            // increment the counter if the holocube is found both in the database and in the checked holocubes
                                            if (currentHolocube.id === parseInt(holocube)) compteur++
                                        });

                                        // If the counter equal 0, then the holocube is updated because the user unchecked the holocube
                                        if (compteur === 0) {
                                            currentHolocube.updateAttribute("playlistId", null, function (err) {

                                                if (err) {
                                                    return res.render('back/playlist/edit', {
                                                        nom: nom,
                                                        client: client,
                                                        Holocubes: holocubes,
                                                        Videos: videos,
                                                        err: true,
                                                        admin: admin,
                                                        playlist: playlist,
                                                        utilisateur: currentUser,
                                                        videos: Videos,
                                                        holocubes: Holocubes,
                                                        videosPlaylists: VideosPlaylists,
                                                        role: role
                                                    })
                                                }
                                            })
                                        }
                                        compteur = 0;
                                    });

                                });

                                setTimeout(function () {
                                    if (admin === true) res.redirect('/admin/playlist/' + client);
                                    else res.redirect('/admin/playlist')
                                }, 500)
                            })
                        })
                    })
                })
            })
        }
    };

    // Delete the selected playlist and everything that's attached to it
    Playlist.getDelete = function (req, res, Holocube, User, Video, PlaylistVideo, AccessToken, RoleMapping, Role) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        // retrieve the playlist's id from the request
        let playlistId = req.params.id;
        // retrieve the user's id from the request
        let user;
        // variable that will be used to tell if a user is an admin or not
        let admin;

        // Check if the user is on the admin root or the basic root
        if(req.params.user) {
            user = req.params.user;
            admin = true;
            callback()
        }
        else {
            // find the proper accessToken that matches the one in the local storage
            AccessToken.findById(localStorage.getItem('accessToken'), [], function (err, currentAccesstoken) {
                if (err) throw err;

                // find the proper user that matches the current access token
                User.findById(currentAccesstoken.userId, [], function (err, currentUser) {
                    user = currentUser.id;
                    admin = false;
                    callback()
                })
            })
        }

        function callback() {
            // find all playlists
            Playlist.find({where: {utilisateurId: user}}, function (err, Playlists) {
                if (err) throw err;

                // find the proper user
                User.findById(user, [], function (err, selectedUser) {
                    if (err) throw err;

                    // find all holocubes
                    Holocube.find({}, function (err, Holocubes) {
                        if (err) throw err;

                        // find all videos
                        Video.find({}, function (err, Videos) {
                            if (err) throw err;

                            // find all playlist_video
                            PlaylistVideo.find({}, function (err, PlaylistsVideos) {
                                if (err) throw err;

                                // Check if the user is on the admin root or the basic root
                                if(admin === true) {

                                    // function that returns the role of the current user
                                    Playlist.role(Role, RoleMapping, AccessToken, User, function (role) {

                                        //If the user is on the admin root, we need to check if he really is an admin
                                        if(role === "superAdmin") {

                                            destroyPlaylist(Playlists, selectedUser, Holocubes, Videos, PlaylistsVideos, admin, role)
                                        }
                                        else res.sendStatus(403)
                                    })
                                }
                                else {
                                    let role = "admin";
                                    destroyPlaylist(Playlists, selectedUser, Holocubes, Videos, PlaylistsVideos, admin, role)
                                }
                            })
                        })
                    })
                })
            })
        }

        function destroyPlaylist(Playlists, selectedUser, Holocubes, Videos, PlaylistsVideos, admin, role) {

            // Destroy the playlist_video(s) which is/are related to the playlist
            PlaylistVideo.destroyAll({"playlistId": playlistId}, function (err) {
                if (err) {
                    return res.render('back/playlist/index', {
                        videos: Videos,
                        holocubes: Holocubes,
                        playlists: Playlists,
                        playlistsVideos: PlaylistsVideos,
                        utilisateur: selectedUser,
                        admin: admin,
                        err: true,
                        role: role
                    })
                }
            });

            // Update the holocube's playlistId to null since the playlist is destroyed
            Holocube.find({where: {playlistId: playlistId}}, function (err, Holos) {

                Holos.forEach(function (currentHolocube) {

                    currentHolocube.updateAttribute("playlistId", null, function (err) {
                        if (err) {
                            return res.render('back/playlist/index', {
                                videos: Videos,
                                holocubes: Holocubes,
                                playlists: Playlists,
                                playlistsVideos: PlaylistsVideos,
                                utilisateur: selectedUser,
                                admin: admin,
                                role: role,
                                err: true
                            })
                        }
                    })
                })
            });

            // Destroy the playlist
            Playlist.destroyById(playlistId, function (err) {
                if (err) {
                    return res.render('back/playlist/index', {
                        videos: Videos,
                        holocubes: Holocubes,
                        playlists: Playlists,
                        playlistsVideos: PlaylistsVideos,
                        utilisateur: selectedUser,
                        admin: admin,
                        role: role,
                        err: true
                    });
                }
                if (admin === true) {
                    res.redirect('/admin/playlist/' + user);
                }
                else res.redirect('/admin/playlist')
            })
        }
    };


//\\//\\//\\//\\    PLAYLIST ADMIN     //\\//\\//\\//\\


    // Display the list of all clients in order to choose on which one you want to see/add/edit/delete playlists
    Playlist.getClient = function (req, res, User, AccessToken, RoleMapping, Role) {
        //check if the user is an authenticated user
        if (!localStorage.getItem('accessToken')) {
            return res.sendStatus(401);
        }

        // function that returns the role of the current user
        Playlist.role(Role, RoleMapping, AccessToken, User, function (role) {

            if(role === "superAdmin") {

                //find all users
                User.find({}, function (err, Users) {
                    if (err) throw err;

                    res.render('back/playlist/clientList', {
                        utilisateurs: Users,
                        role: role
                    })
                })
            }
            else res.sendStatus(403)
        })
    }
};