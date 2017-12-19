'use strict';

module.exports = function(Container) {

    Container.inContainer = function(req, res, uplo,folder, cb) {
console.log(uplo,folder);
        Container.getContainers(function (err, containers) {
            if (containers.some(function(e) { return e.name === folder; })) {
                console.log('heyyy');
                Container.createContainer({name: req.body.name},  function (err, c) {
                    console.log(c);
                    Container.upload(req, res, c, cb);
                })
            }
           /* else {
                Container.createContainer({name: folder}, function(err, c) {
                    Container.upload(req, res, {container: c.name}, cb);
                });
            }*/
        });
    };

    Container.remoteMethod(
        'inContainer',
        {
            description: 'Create directory in a other',
            http: {path: '/:container/container', verb: 'post'},
            accepts: [
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'data', type: 'object', 'http': {source: 'body'}},
                {arg: 'container', type: 'string'}
            ],
            returns: {arg: 'status', type: 'string'}
        }
    );


};
