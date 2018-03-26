/*
* @ 服务配置文件
* @ development 开发环境配置
* @ production  生产环境配置
* @ mongo && port  数据库连接配置
* @ alioss 阿里云oss文件上传配置
* @ 可作为cdn空间存放你的图片，视频等等静态资源
*/
module.exports = {

  // 开发环境配置
  development: {
    mongo: {
      uri: 'mongodb://localhost:27017/test'
    },
    jwtSecret: 'owihsiuhseg',
    secretKey: 'owihsiuhseg',
    port: '9999',
    alioss: { // 阿里云oss sdk配置  (仅供参考)
      region: 'oss-cn-hangzhou', // 示例：'oss-cn-hangzhou'
      accessKeyId: 'LTAIB9gGaFAauzRK', // 示例：'SVDFBGBFBFDNGSBRSVFDM'
      accessKeySecret: '3i2B8ozacIGjZ1kGUVLCgINWDxPU3t', // 示例：'wFEWVBG2bFBnNGwe6RSsFfDbDr'
      bucket: 'moge-test',
      folder: 'image/', // 上传到空间的images文件夹下，可自定义，文件夹需提前创建
      imageHost: 'moge-test.oss-cn-hangzhou.aliyuncs.com'
    }
  },

  // 生产环境配置
  production: {
    mongo: {
      uri: 'mongodb://localhost:27017/mogo'
    },
    jwtSecret: 'mogexianshang',
    secretKey: 'mogexianshang',
    port: '443',
    alioss: { // 阿里云oss sdk配置  (仅供参考)
      region: 'oss-cn-hangzhou', // 示例：'oss-cn-hangzhou'
      accessKeyId: 'LTAIB9gGaFAauzRK', // 示例：'SVDFBGBFBFDNGSBRSVFDM'
      accessKeySecret: '3i2B8ozacIGjZ1kGUVLCgINWDxPU3t', // 示例：'wFEWVBG2bFBnNGwe6RSsFfDbDr'
      bucket: 'moge-admin',
      folder: 'image/',
      imageHost: 'moge-test.oss-cn-hangzhou.aliyuncs.com'
    }
  }
};
