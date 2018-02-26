const fs = require('fs');
const alioss = require('../utils/alioss');
const config = require('../../config/common');
const globalConfig = config[process.env.NODE_ENV || 'development'];

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

    const isexit = await fs.existsSync(files.files.path);
    if (!isexit) {
      return ctx.success({
        code: 400,
        message: '上传文件时发生错误!'
      });
    }

    let filekey = files.files.name;
    if (globalConfig.alioss.folder) {
      filekey = globalConfig.alioss.folder + filekey;
    }

    const result = await alioss(filekey, files.files.path);
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

    return ctx.success({ message: '上传成功!', data: { url } });
  }
}

module.exports = UploadController;
