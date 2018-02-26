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
    port: '9999',
    alioss: { // 阿里云oss sdk配置  (仅供参考)
      region: 'oss-cn-hangzhou', // 示例：'oss-cn-hangzhou'
      accessKeyId: 'LTAINE1S7Swyh4wI', // 示例：'SVDFBGBFBFDNGSBRSVFDV'
      accessKeySecret: '4YbawEW7Ov7B9LgRm7RhFZ7kQATbjn', // 示例：'WFEWVBGBFBFDNGSBRSVFFDBDV'
      bucket: 'moge-test',
      folder: 'image/' // 上传到空间的images文件夹下，可自定义，文件夹需提前创建
    }
  },

  // 生产环境配置
  production: {
    mongo: {
      uri: 'mongodb://localhost:27017/mogo'
    },
    port: '8080',
    alioss: { // 阿里云oss sdk配置  (仅供参考)
      region: 'oss-cn-hangzhou',
      accessKeyId: '授权key',
      accessKeySecret: '秘钥key',
      bucket: 'mogo',
      folder: 'images/' // 上传到空间的images文件夹下，可自定义，文件夹需提前创建
    }
  }
};
