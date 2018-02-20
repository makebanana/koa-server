const {
  BackendAuth,
  BackendManager,
  BackendPhoto,
  BackendPicType,
  BackendCustomer
} = require('../controllers/backend.export');
const upload = require('../middlewares/upload');

const router = require('koa-router')();

router
  // 通用上传
  .post('/api/upload', upload.alioss)

  // 管理员相关
  .post('/server/login', BackendManager.login)
  .get('/server/manager', BackendManager.list)
  .get('/server/manager/:id', BackendManager.detail)
  .post('/server/manager', BackendManager.add)
  .put('/server/manager/:id', BackendManager.update)
  .delete('/server/manager/:id', BackendManager.del)

  // 权限相关
  .get('/server/auth', BackendAuth.has)
  .get('/server/auth/list', BackendAuth.list)

  // 相片相关
  .get('/server/photo', BackendPhoto.list)
  .post('/server/photo', BackendPhoto.add)
  .put('/server/photo/:id', BackendPhoto.update)
  .delete('/server/photo/:id', BackendPhoto.del)

  // 照片分类相关
  .get('/server/pic/type', BackendPicType.list)
  .post('/server/pic/type', BackendPicType.add)
  .put('/server/pic/type/:id', BackendPicType.update)
  .delete('/server/pic/type/:id', BackendPicType.del)

  // 客户相关
  .get('/server/customer', BackendCustomer.list)
  .get('/server/customer/:id', BackendCustomer.detail)
  .post('/server/customer', BackendCustomer.add)
  .put('/server/customer/:id', BackendCustomer.update)
  .delete('/server/customer/:id', BackendCustomer.del);

module.exports = router;
