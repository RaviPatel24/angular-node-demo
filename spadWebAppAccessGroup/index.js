/*

Module Name: spadWebAppAccessGroup
Decription: Used For Creating,Updating,Getting And Deleting Data Of Access Group
Author: TTS, India
Last Updated Date: 09-19-2021

*/
require("cross-fetch/polyfill");
var config = require("/opt/nodejs/config/config");
var mongoose = require("/opt/nodejs/config/mongo_db_connection");
var roleGroupImpl = require("./roleGroupImpl.js");
var objRoleGroup = new roleGroupImpl();
console.log('env',process.env.SCHEMA_NAME);
var userImpl = require("./userImpl.js");
var objUsers = new userImpl();

var ErrorHandlerImpl = require("./ErrorHandler.js");
var ErrorHandlerObj = new ErrorHandlerImpl();

var util = require("util");
var mongodbConf = config.mongodb;

// Build the connection string
var dbURI =
  "mongodb://" +
  mongodbConf.host +
  ":" +
  mongodbConf.port +
  "/" +
  mongodbConf.schema;
console.log("dbURI: ", dbURI);

var DeleteRoleGroup = util.promisify(objRoleGroup.DeleteRoleGroup);
var GetAccessGroup = util.promisify(objRoleGroup.getAccessGroupList);
var updateRoleGroup = util.promisify(objRoleGroup.updateRoleGroup);
var CreateRoleGroup = util.promisify(objRoleGroup.CreateRoleGroup);
var UpdateNotificationSettings = util.promisify(
  objRoleGroup.updateNotificationSettings
);

var handleDuplicateKeyError = util.promisify(
  ErrorHandlerObj.handleDuplicateKeyError
);
var handleValidationError = util.promisify(
  ErrorHandlerObj.handleValidationError
);

var FindUserId = util.promisify(objUsers.getUserByEmail);

exports.handler = async (event, context, callback) => {
  let response = {
    statusCode: 200,
    response: "",
  };
  // Create the database connection
  await mongoose.connect(dbURI, {
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  var payload = event["body-json"];
  if (event.context["resource-path"].split("/")[3] == "notification_settings") {
    if (event.context["http-method"] == "PUT") {
      await Promise.all(
        payload.map(async (data) => {
          try {
            console.log("data", data);
            await FindUserId(data.updatedBy)
              .then(async function (userId) {
                let updatedAt = new Date();
                await UpdateNotificationSettings(data, userId, updatedAt)
                  .then(function (result) {
                    response.response = "Accesss Group Updated";
                  })
                  .catch(async function (err) {
                    if (err.code && err.code == 11000) {
                      let duplicate = await handleDuplicateKeyError(err);
                      response.response = `${duplicate} Is Already Exists`;
                      response.statusCode = 500;
                    } else if (err.name === "ValidationError") {
                      let validation = await handleValidationError(err);
                      response.response = `Format Erorr On Field ${validation}`;
                      response.statusCode = 500;
                    }
                  });
              })
              .catch(function (err) {
                console.log(err);
                response.response = "User ID Does Not Exists";
                response.statusCode = 500;
              });
          } catch (e) {
            console.log(e);
            response.response = "Failed to Update Role Group";
            response.statusCode = 500;
          }
        })
      );
    }
  } else if (event.context["http-method"] == "GET") {
    var result = "";
    if (event.params.querystring.func == "DeviceData") {
      try {
        response.response = result;
      } catch (e) {
        response.response = result;
        response.statusCode = 500;
      }
    } else if (event.params.querystring.func == "AccessGroupList") {
      try {
        await GetAccessGroup()
          .then(function (result) {
            response.response = result;
          })
          .catch(function (err) {
            console.log(err);
            response.response = "AccessGroupList Not Found!";
            response.statusCode = 500;
          });
      } catch (e) {
        response.response = "No Access Found";
        response.statusCode = 500;
      }
    }
  } else if (event.context["http-method"] == "POST") {
    await Promise.all(
      payload.map(async (data) => {
        try {
          await FindUserId(data.createdBy)
            .then(async function (userId) {
              let createdAt = new Date();
              await CreateRoleGroup(data, userId._id, createdAt)
                .then(function (result) {
                  response.response = "Accesss Group Created";
                })
                .catch(async function (err) {
                  if (err.code && err.code == 11000) {
                    let duplicate = await handleDuplicateKeyError(err);
                    response.response = `${duplicate} Is Already Exists`;
                    response.statusCode = 500;
                  } else if (err.name === "ValidationError") {
                    let validation = await handleValidationError(err);
                    response.response = `Format Erorr On Field ${validation}`;
                    response.statusCode = 500;
                  }
                });
            })
            .catch(function (err) {
              console.log(err);
              response.response = "UserId Does Not Exists!";
              response.statusCode = 500;
            });
        } catch (e) {
          response.response = "Failed to Create Access Group";
          response.statusCode = 500;
        }
      })
    );
  } else if (event.context["http-method"] == "PUT") {
    await Promise.all(
      payload.map(async (data) => {
        try {
          await FindUserId(data.createdBy)
            .then(async function (userId) {
              let updatedAt = new Date();
              await updateRoleGroup(data, userId, updatedAt)
                .then(function (result) {
                  response.response = "Accesss Group Updated";
                })
                .catch(async function (err) {
                  if (err.code && err.code == 11000) {
                    let duplicate = await handleDuplicateKeyError(err);
                    response.response = `${duplicate} Is Already Exists`;
                    response.statusCode = 500;
                  } else if (err.name === "ValidationError") {
                    let validation = await handleValidationError(err);
                    response.response = `Format Erorr On Field ${validation}`;
                    response.statusCode = 500;
                  }
                });
            })
            .catch(function (err) {
              console.log(err);
              response.response = "UserId Does Not Exists!";
              response.statusCode = 500;
            });
        } catch (e) {
          response.response = "Failed to Update Access Group";
          response.statusCode = 500;
        }
      })
    );
  } else if (event.context["http-method"] == "DELETE") {
    await Promise.all(
      payload.map(async (data) => {
        try {
          await FindUserId(data.createdBy)
            .then(async function (userId) {
              let updatedAt = new Date();
              result = await DeleteRoleGroup(data, userId, updatedAt)
                .then(function (result) {
                  response.response = "Accesss Group Deleted";
                })
                .catch(async function (err) {
                  if (err.code && err.code == 11000) {
                    let duplicate = await handleDuplicateKeyError(err);
                    response.response = `${duplicate} Is Already Exists`;
                    response.statusCode = 500;
                  } else if (err.name === "ValidationError") {
                    let validation = await handleValidationError(err);
                    response.response = `Format Erorr On Field ${validation}`;
                    response.statusCode = 500;
                  }
                });
            })
            .catch(function (err) {
              console.log(err);
              response.response = "UserId Does Not Exists!";
              response.statusCode = 500;
            });
        } catch (e) {
          response.response = "Failed to Delete Camera Data";
          response.statusCode = 500;
        }
      })
    );
  } else {
    response.response = "No Method Found";
    response.statusCode = 500;
  }
  mongoose.disconnect();
  callback(null, response);
};
