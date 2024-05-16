const nxPreset = require('@nx/jest/preset').default;
const mongo = require("@shelf/jest-mongodb/jest-preset");
module.exports = { ...nxPreset, ...mongo };
