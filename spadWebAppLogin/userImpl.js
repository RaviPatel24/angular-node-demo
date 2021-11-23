var User = require("./user");

var userImpl = function () {};

module.exports = userImpl;


/***
    This method fetches a record from User collection based on emailId.
***/
userImpl.prototype.getUserByEmail = function (emailId, callback) {
  User.findOne(
    { email_id: emailId, is_deleted: false, is_active: true },
    function (findOneUserErr, findOneUserResult) {
      if (!findOneUserErr) {
        callback(null, findOneUserResult);
      } else {
        callback(findOneUserErr, null);
      }
    }
  );
};
