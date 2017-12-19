class VideoController {

    constructor(video, user, role, roleMap, accessToken, playlistVideo) {
        this.video = video;
        this.user = user;
        this.role = role;
        this.roleMap = roleMap;
        this.accessToken = accessToken;
        this.playlistVideo = playlistVideo;
    }



    postVideoDelete(req, res){
        this.video.postDelete(req, res, this.user, this.role, this.roleMap, this.accessToken, this.playlistVideo);
    }

    getVideoNew(req, res){
        this.video.getNew(req, res, this.user, this.role, this.roleMap, this.accessToken);
    }

    postVideoNew(req, res){
        this.video.postNew(req, res, this.user, this.role, this.roleMap, this.accessToken);
    }

    getVideoEditAction(req, res){
        this.video.getEdit(req, res, this.user, this.role, this.roleMap, this.accessToken);
    }

    postVideoEditAction(req, res){
        this.video.postEdit(req, res, this.user, this.role, this.roleMap, this.accessToken);
    }

    getVideoDelete(req, res){
        this.video.getDelete(req, res, this.user, this.role, this.roleMap, this.accessToken, this.playlistVideo)
    }
}

module.exports = VideoController;