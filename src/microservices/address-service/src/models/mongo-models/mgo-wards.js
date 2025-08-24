const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");

const wardsSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      default: 0,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      default: "",
    },
    shortName: {
      type: String,
      default: "",
    },
    code: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    provinceId: { type: Number, default: null }, // liên kết với Province.id
  },
  {
    timestamps: {
      createdAt: "createDate",
      updatedAt: "updateDate",
    },
  }
);

const Ward = mongoose.model("Ward", wardsSchema);
module.exports = Ward;
