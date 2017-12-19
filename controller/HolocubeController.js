class HolocubeController {

    constructor(holocube, user, playlist, accessToken, role, roleMapping) {
        this.holocube = holocube;
        this.user = user;
        this.playlist = playlist;
        this.accessToken = accessToken;
        this.role = role;
        this.roleMapping = roleMapping;

    }

    getHolocubeListAction(req, res){
        this.holocube.list(req, res, this.user, this.playlist, this.accessToken, this.role, this.roleMapping);
    }

    postHolocubeDelete(req, res){
        this.holocube.postDelete(req, res, this.user, this.playlist, this.accessToken, this.role, this.roleMapping);
    }

    getHolocubeNew(req, res){
        this.holocube.getNew(req, res, this.user, this.accessToken, this.role, this.roleMapping);
    }

    postHolocubeNew(req, res){
        this.holocube.postNew(req, res, this.user, this.accessToken, this.role, this.roleMapping);
    }

    getHolocubeEdit(req, res){
        this.holocube.getEdit(req, res, this.user, this.accessToken, this.role, this.roleMapping);
    }

    postHolocubeEdit(req, res){
        this.holocube.postEdit(req, res, this.user, this.accessToken, this.role, this.roleMapping);
    }

    getHolocubeDelete(req, res){
        this.holocube.getDelete(req, res, this.user, this.playlist, this.accessToken, this.role, this.roleMapping);
    }
}

module.exports = HolocubeController;