const fs = require('fs');
const path = require('path');
const alioss = require('../utils/alioss');
const config = require('../../config/common');
const randomString = require('../utils/randomString');
const globalConfig = config[process.env.NODE_ENV || 'development'];
const mongoose = require ('mongoose');
const ImageModel = mongoose.model('Image');

class UploadController {
   // 图片上传到阿里云oss中间件
  static async alioss (ctx) {
    const { files } = ctx.request.body;
    if (!files || !files.files) {
      return ctx.success({
        code: 400,
        message: '上传失败!'
      });
    }
    const filePath = files.files.path;
    const isexit = await fs.existsSync(filePath);
    if (!isexit) {
      return ctx.success({
        code: 400,
        message: '上传文件时发生错误!'
      });
    }

    let filekey = Date.now() + randomString(6) + path.extname(filePath);
    if (globalConfig.alioss.folder) {
      filekey = globalConfig.alioss.folder + filekey;
    }

    const result = await alioss(filekey, filePath);
    if (!result || !result.url) {
      return ctx.success({
        code: 400,
        message: '上传到云端时发生错误!'
      });
    }

    const { url } = result;
    if (!url) {
      return ctx.success({
        code: 400,
        message: '上传失败!'
      });
    }

    const size = files.files.size;
    const name = files.files.name;
    const img = await ImageModel.create({ path: url, size, name });

    return ctx.success({
      message: '上传成功!',
      data: {
        id: img.id,
        path: img.path
      }
    });
  }
}

module.exports = UploadController;
