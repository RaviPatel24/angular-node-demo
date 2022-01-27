var accessGroup = require("./accessGroup");

var roleGroupImpl = function () {};

module.exports = roleGroupImpl;

/***** This Function Is Used To Get Role Group List *****/
roleGroupImpl.prototype.getAccessGroupList = function (callback) {
  accessGroup.find({}, function (getRoleGroupListErr, getRoleGroupListResult) {
    if (!getRoleGroupListErr) {
      callback(null, getRoleGroupListResult);
    } else {
      callback(getRoleGroupListErr, null);
    }
  });
};

/***** This Function Is Used To Update Device Data *****/
roleGroupImpl.prototype.updateRoleGroup = function (
  dataRoleGroup,
  userId,
  updatedAt,
  callback
) {
  accessGroup.updateOne(
    { access_group_name: dataRoleGroup.AccessGroupName },
    {
      $set: {
        is_active: dataRoleGroup.is_active,
        access_list: dataRoleGroup.AccessList,
        updated_at: updatedAt,
        updated_by: userId,
      },
    },
    function (updateOneRoleGroupErr, updateOneRoleGroupResult) {
      if (!updateOneRoleGroupErr) {
        callback(null, updateOneRoleGroupResult);
      } else {
        callback(updateOneRoleGroupErr, null);
      }
    }
  );
};

/***** This Function Is Used To Create Role Group *****/
roleGroupImpl.prototype.CreateRoleGroup = function (
  dataRoleGroup,
  userId,
  createdAt,
  callback
) {
  accessGroup.create(
    {
      access_group_name: dataRoleGroup.AccessGroupName,
      access_list: dataRoleGroup.AccessList,
      created_at: createdAt,
      created_by: userId,
      is_deleted: false,
    },
    function (createOneDeviceDataErr, createOneDeviceDataResult) {
      if (!createOneDeviceDataErr) {
        callback(null, createOneDeviceDataResult);
      } else {
        callback(createOneDeviceDataErr, createOneDeviceDataResult);
      }
    }
  );
};

/***** This Function Is Used To Delete Camera Data *****/
roleGroupImpl.prototype.DeleteRoleGroup = function (
  dataRoleGroup,
  userId,
  updatedAt,
  callback
) {
  accessGroup.updateOne(
    { access_group_name: dataRoleGroup.AccessGroupName },
    { $set: { is_deleted: true, updated_at: updatedAt, updated_by: userId } },
    function (deleteOneRoleGroupErr, deleteOneRoleGroupResult) {
      if (!deleteOneRoleGroupErr) {
        callback(null, deleteOneRoleGroupResult);
      } else {
        callback(deleteOneRoleGroupErr, deleteOneRoleGroupResult);
      }
    }
  );
};

/***** This Function Is Used To Update Device Data *****/
roleGroupImpl.prototype.updateNotificationSettings = function (
  dataNotificationSetting,
  userId,
  updatedAt,
  callback
) {
  let updateSettings = {};

  updateSettings.SMSEnabled = dataNotificationSetting.SMSEnabled;

  updateSettings.EmailEnabled = dataNotificationSetting.EmailEnabled;

  updateSettings.CallEnabled = dataNotificationSetting.CallEnabled;
  updateSettings.updated_at = updatedAt;
  updateSettings.updated_by = userId;

  accessGroup.updateOne(
    { access_group_name: dataNotificationSetting.AccessGroupName },
    { $set: updateSettings },
    function (updateOneRoleGroupErr, updateOneRoleGroupResult) {
      if (!updateOneRoleGroupErr) {
        callback(null, updateOneRoleGroupResult);
      } else {
        callback(updateOneRoleGroupErr, null);
      }
    }
  );
};
