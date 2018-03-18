const BackendAuth = require('./backend/auth');
const BackendManager = require('./backend/manager');
const BackendPhoto = require('./backend/photo');
const BackendPicType = require('./backend/picType');
const BackendCustomer = require('./backend/customer');
const BackendPlayRecord = require('./backend/playRecord');
const BackendAnalysis = require('./backend/analysis');
const Upload = require('./upload');

module.exports = {
  BackendAuth,
  BackendManager,
  BackendPhoto,
  BackendPicType,
  BackendCustomer,
  BackendPlayRecord,
  BackendAnalysis,
  Upload
};
