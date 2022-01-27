var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var accessGroupSchema = new Schema({
  access_group_name: { type: String, required: true, unique: true },
  access_list: { type: [{ type: String }] },
  created_at: { type: Date, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  is_deleted: { type: Boolean, default: false },
  updated_at: { type: Date },
  updated_by: { type: Schema.Types.ObjectId, ref: "User" },
  SMSEnabled: { type: Boolean, default: false },
  EmailEnabled: { type: Boolean, default: false },
  CallEnabled: { type: Boolean, default: false },
});

var AccessGroup = mongoose.model("accessGroup", accessGroupSchema);

module.exports = AccessGroup;
