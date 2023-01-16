const checkAuth = function (req, res, next) {
    console.log("in profile");
    try{
        if (!req.user){
            throw("User not logged in");
        }
        else{
            next();
        }
    }
    catch{
        res.status(401).send("User not logged in");
    }
        
}

module.exports = function(app) {
    var userHandlers = require('../controllers/usercontroller.js');

    app.route('/tasks')
        .post(userHandlers.loginRequired, userHandlers.profile);
    app.route('/register')
        .post(userHandlers.register);
    app.route('/login')
        .post(userHandlers.sign_in);
    app.use(checkAuth);
    app.route('/logout')
        .put(userHandlers.logout)
};