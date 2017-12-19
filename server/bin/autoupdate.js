let path = require('path');
let app = require(path.resolve(__dirname, '../server'));


let models = require(path.resolve(__dirname, '../model-config.json'));
let datasources = require(path.resolve(__dirname, '../datasources.json'));

function autoUpdateAll(){
    Object.keys(models).forEach(function(key) {
        if (typeof models[key].dataSource != 'undefined') {
            if (typeof datasources[models[key].dataSource] != 'undefined') {
                app.dataSources[models[key].dataSource].autoupdate(key, function (err) {
                    if (err) throw err;
                    console.log('Model ' + key + ' updated');
                });
            }
        }
    });
}
autoUpdateAll();


