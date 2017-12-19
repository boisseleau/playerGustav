var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.gustavtest;
var appModels = ['utilisateur', 'playlist', 'holocube', 'video'];
ds.isActual(appModels, function(err, actual) {
    if (!actual) {
        ds.autoupdate(appModels, function(err) {
            if (err){
                throw (err);
            }
        });
    }
});

console.log("Migrated: " + appModels.join());