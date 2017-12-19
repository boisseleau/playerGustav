
let loopback = require('loopback');
let boot = require('loopback-boot');
let bodyParser = require('body-parser');
let path = require('path');

let app = module.exports = loopback();




// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
    if (err) throw err;

    app.middleware('initial', bodyParser.urlencoded({ extended: true }));



app.set('view engine', 'ejs'); // LoopBack comes with EJS out-of-box
app.set('json spaces', 2); // format json responses for easier viewing


// must be set to serve views properly when starting the app via `slc run` from
// the project root
app.set('views', path.resolve(__dirname, '../client/views'));

    app.use(function(req, res, next) {
        app.currentUser = null;
        if (!req.accessToken) return next();
        req.accessToken.user(function(err, user) {
            if (err) return next(err);
            req.currentUser = user;
            next(
                console.log('Token')
            );
        });
    });


    app.start = function() {
        // start the web server
        return app.listen(function() {
            app.emit('started');
            let baseUrl = app.get('url').replace(/\/$/, '');
            console.log('Web server listening at: %s', baseUrl);
            if (app.get('loopback-component-explorer')) {
                let explorerPath = app.get('loopback-component-explorer').mountPath;
                console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
            }
        });
    };

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();
});
