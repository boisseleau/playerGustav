class PlaylistController {

    constructor(playlist, holocube, user, video, playlistVideo, accessToken, role, roleMapping) {
        this.playlist = playlist;
        this.holocube = holocube;
        this.user = user;
        this.video = video;
        this.playlistVideo = playlistVideo;
        this.accessToken = accessToken;
        this.roleUser = role;
        this.roleMapping = roleMapping;
    }

//\\//\\    PLAYLIST     //\\//\\

    getPlaylistListAction(req, res) {
        this.playlist.getList(req, res, this.holocube, this.user, this.video, this.playlistVideo, this.accessToken, this.roleMapping, this.roleUser)
    }

    postPlaylistDelete(req, res){
        this.playlist.postDelete(req, res, this.holocube, this.user, this.video, this.playlistVideo, this.accessToken, this.roleMapping, this.roleUser)
    }

    getPlaylistNew(req, res) {
        this.playlist.getNew(req, res, this.holocube, this.user, this.video, this.accessToken, this.roleMapping, this.roleUser)
    }

    postPlaylistNew(req, res) {
        this.playlist.postNew(req, res, this.holocube, this.user, this.video, this.playlistVideo, this.accessToken,this.roleMapping, this.roleUser)
    }

    getPlaylistEdit(req, res) {
        this.playlist.getEdit(req, res, this.holocube, this.user, this.video, this.playlistVideo, this.accessToken, this.roleMapping, this.roleUser)
    }

    postPlaylistEdit(req, res) {
        this.playlist.postEdit(req, res, this.holocube, this.user, this.video, this.playlistVideo, this.accessToken,this.roleMapping, this.roleUser)
    }

    getPlaylistDelete(req, res) {
        this.playlist.getDelete(req, res, this.holocube, this.user, this.video, this.playlistVideo, this.accessToken, this.roleMapping, this.roleUser)
    }


//\\//\\    PLAYLIST ADMIN    //\\//\\

    getClientsPlaylist(req, res) {
        this.playlist.getClient(req, res, this.user, this.accessToken, this.roleMapping, this.roleUser)
    }

}
module.exports = PlaylistController;