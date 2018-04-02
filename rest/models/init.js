const {
  auth,
  manager
} = require('./index');

module.exports = async function initMongoData() {
  if (process.env.NODE_ENV !== 'production') { return; }
  manager.findOne().remove();

  const hadManager = await manager.find();

  if (hadManager.length) { return; }

  let authList = await auth.find();
  if (!authList.length) {
    authList = await auth.create([
      {
          "parentId" : 0,
          "id" : 10000,
          "name" : "user",
          "label" : "用户管理"
      },  {
          "parentId" : 10000,
          "id" : 10001,
          "name" : "user_view",
          "label" : "查看用户"
      },  {
          "parentId" : 10000,
          "id" : 10002,
          "name" : "user_manage",
          "label" : "用户增删改"
      },  {
          "parentId" : 20000,
          "id" : 20001,
          "name" : "photo_view",
          "label" : "相片查看"
      },  {
          "parentId" : 0,
          "id" : 20000,
          "name" : "photo",
          "label" : "相片管理"
      },  {
          "parentId" : 20000,
          "id" : 20002,
          "name" : "photo_manager",
          "label" : "相片增删改"
      },  {
          "parentId" : 0,
          "id" : 30000,
          "name" : "message",
          "label" : "消息管理"
      },  {
          "parentId" : 30000,
          "id" : 30001,
          "name" : "message_message",
          "label" : "消息管理"
      },  {
          "parentId" : 30000,
          "id" : 30002,
          "name" : "message_suggest",
          "label" : "查看反馈"
      },
      {
          "parentId" : 0,
          "id" : 40000,
          "name" : "active",
          "label" : "活动管理"
      },
      {
          "parentId" : 50000,
          "id" : 50002,
          "name" : "analysis_customer",
          "label" : "客户分析"
      },
      {
          "parentId" : 40000,
          "id" : 40001,
          "name" : "active_view",
          "label" : "活动查看"
      },
      {
          "parentId" : 0,
          "id" : 60000,
          "name" : "manager",
          "label" : "系统设置"
      },
      {
          "parentId" : 40000,
          "id" : 40002,
          "name" : "active_manage",
          "label" : "活动管理"
      },
      {
          "parentId" : 0,
          "id" : 50000,
          "name" : "analysis",
          "label" : "数据分析"
      },
      {
          "parentId" : 50000,
          "id" : 50001,
          "name" : "analysis_photo",
          "label" : "相片分析"
      }
    ]);
  }

  manager.create([
    {
     "name" : "admin",
     "auth" : authList.map(item => item._id),
     "mobile" : "13777847949",
     "password" : "96e79218965eb72c92a549dd5a330112"
   }
  ]);
};
