module.exports = function(app) {
    let User = app.models.utilisateur;
    let Role = app.models.Role;
    let RoleMapping = app.models.RoleMapping;

 /*    User.create([
         {username: 'Jane', email: 'jane@doe.com', password: 'root'}
     ], function(err, users) {
         if (err) throw err;

     //create the superAdmin role
     Role.create({
         name: 'superAdmin'
     }, function(err, role) {
         if (err) throw err;

         console.log('Created role:', role);
         role.principals.create({
             principalType: RoleMapping.USER,
             principalId: 2
         }, function(err, principal) {
             if (err) throw err;

             console.log('Created principal:', principal);
         });
     });

     //create the admin role
     Role.create({
         name: 'admin'
     }, function(err, role) {
         if (err) throw err;

         console.log('Created role:', role);


     });
     });*/

    RoleMapping.belongsTo(User);
    User.hasMany(RoleMapping, {foreignKey: 'utilisateurId'});
    Role.hasMany(User, {through: RoleMapping, foreignKey: 'roleId'});
 };

