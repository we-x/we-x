---
title: Twikoo Netlify部署方法及操作流程，给博客网站添加评论功能
description: 需要注意的是此操作流程使用的是Twikoo Netlify部署，其他部署方式略有差异。我们将使用MongoDB提供的免费数据库以及Netlify提供的WEB服务，全程无需支付。
date: 2025-03-26 20:56:12
slug: twikoo-netlify-deploy
image: cover.jpg
categories:
    - guide
tags: 
    - Twikoo
    - Netlify
---

宝子们，今天的文章比较无聊。为了方便查看不废话了，直接上操作流程。

需要注意的是此操作流程使用的是Twikoo Netlify部署，其他部署方式略有差异。我们将使用MongoDB提供的免费数据库以及Netlify提供的WEB服务，全程无需支付。

适合集成了Twikoo的主题（需要配置）或没有集成Twikoo（需要进行前端部署）。

以下内容参考Twikoo官方文档实现，在这个过程中也许会有很多不明白的事情，按顺序照做就行。

## 注册MongoDB Atlas

参考文档：

https://twikoo.js.org/mongodb-atlas.html

### 注册MongoDB账号

进入`MongoDB`官网点击`Get Started`注册账号。

填写`First Name`、`Last Name`、邮箱地址、密码，同意协议，点击`Create your Atlas account`创建你的账户。

你会收到一封来自MongoDB的验证邮箱的邮件，我用的是163邮箱。

### 申请免费数据库

虽然免费的MongoDB只有512M数据存储空间，但是已经足够使用。

`Try Free`开始申请，Twikoo推荐选择`AWS / Oregon (us-west-2)` 数据中心，该数据中心基建成熟，故障率低，照做就行。

### 创建数据库用户

在`Database Access`页面点击`Add New Database User`创建数据库用户，`Authentication Method` 选 `Password`，在`Password Authentication`下设置数据库用户名和密码，密码建议点击`Auto Generate`自动生成一个不含特殊符号的强壮密码并妥善保存。

点击`Database User Privileges`下方的`Add Built In Role`，`Select Role`选择`Atlas Admin`，最后点击 `Add User`提交。

### 添加网络白名单

在`Network Access`页面点击`Add IP Address`添加网络白名单。

因为 Vercel / Netlify / Lambda 的出口地址不固定，因此`Access List Entry`输入`0.0.0.0/0`（允许所有 IP 地址的连接）即可。

如果 Twikoo 部署在自己的服务器上，这里可以填入固定 IP 地址。

点击`Confirm`保存。

### 获取数据库连接字符串

在`Database`页面点击`Connect`按钮，连接方式选择`Drivers`，复制数据库连接字符串。

将连接字符串中的`<username>:<password>`修改为刚刚创建的数据库`用户名:密码`。

链接字符串至关重要，不要搞错也不要外泄。

**链接字符串样例：**

```
mongodb+srv://boke360:apdZNePvwlqc0VwP@clusterboke.fukzc.mongodb.net/?retryWrites=true&w=majority&appName=ClusterBoke
```

## Netlify 部署

参考文档：

https://twikoo.js.org/backend.html#netlify-%E9%83%A8%E7%BD%B2

### GitHub fork仓库

登录GitHub后，fork仓库`twikoojs/twikoo-netlify`。

仓库地址：

https://github.com/twikoojs/twikoo-netlify

### 申请Netlify账号

进入Netlify官网，点击`Sign up`使用邮箱或者GitHub注册。

https://app.netlify.com/

### Netlify添加部署站点

点击`Sites` > `Add New Site` > `Import an existing project`。

在`Let’s deploy your project with…`页面点击`GitHub`（此操作可能需要海外VPN）。

然后选择刚才fork的`twikoo-netlify`仓库，`Deploy`部署站点。

暂时不要绑定自己的域名，因为域名生效需要一段时间，我们可以先配置好Twikoo后再绑定自己的域名。

### 添加站点环境变量

**操作路径**：

`Sites` > `yoursitename.netlify.app` > `Site configuration` > `Environment variables` > `Add avariable` > `Add a single variable`

`Key`输入：`MONGODB_URI`

`Values`输入，之前获取的MongoDB连接字符串，注意用户名和密码要正确。

### 检查是否配置成功

配置好环境变量后，访问`https://yoursitename.netlify.app/.netlify/functions/twikoo`如果显示下面的信息表示Twikoo部署成功。

```
{"code":100,"message":"Twikoo 云函数运行正常，请参考 https://twikoo.js.org/frontend.html 完成前端的配置","version":"1.6.41"}
```

如果不成功，请确认以下信心或执行操作：

- `MONGODB_URI`环境变量是否正确。
- 操作站点部署：`Sites` > `yoursitename.netlify.app` > `Deploys` > `Trigger deploy` > `Deploy site`

### 设置域名

确认Twikoo在Netlify部署成功，就可以绑定自己的域名了。

操作路径：`Sites` > `yoursitename.netlify.app` > `Domain management` > `Production domains` > `Add domain alias`

添加域名后，等待域名解析生效。域名生效后就可以开启HTTPS了。Netlify提供的正是是`Let's Encrypt`的免费证书。当然你也可以使用自己的证书。

## 前端部署

参考文档：

https://twikoo.js.org/frontend.html

#### 方式一、主题配置

如果你的主题支持Twikoo，在配置文件中设置即可。

Hugo Stack主题，可在配置文件中找到以下配置代码，修改即可：

```
    comments:
        enabled: true
        provider: twikoo
```

```
        twikoo:
            envId: https://twikoo.boke360.cn/.netlify/functions/twikoo
            region:
            path:
            lang:
```

#### 方式二、前端部署

参考文档：

https://twikoo.js.org/frontend.html#%E9%80%9A%E8%BF%87-cdn-%E5%BC%95%E5%85%A5

如果你的主题不支持，可以联系主题作者集成Twikoo或自己进行前端部署。

1. **添加评论区HTML标签**

   ```
   <div id="tcomment"></div>
   ```

2. **引入JS脚本**

   ```
   <script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.41/dist/twikoo.all.min.js"></script>
   ```

3. **执行JS脚本**

   ```
   <script>
   twikoo.init({
     envId: '您的环境id', // 腾讯云环境填 envId；Vercel 环境填地址（https://xxx.vercel.app）
     el: '#tcomment', // 容器元素
     // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
     // path: location.pathname, // 用于区分不同文章的自定义 js 路径，如果您的文章路径不是 location.pathname，需传此参数
     // lang: 'zh-CN', // 用于手动设定评论区语言，支持的语言列表 https://github.com/twikoojs/twikoo/blob/main/src/client/utils/i18n/index.js
   })
   </script>
   ```

查看Twikoo在站点上的效果吧。

需要注意的是，第一次访问Twikoo是需要设定管理密码，一定要记及时设置该密码，密码不可泄露。

如果你设置了Twikoo暗号，要保存暗号，丢失管理暗号比较麻烦。

可以在Twikoo使用常见问题，可以查阅官方文档。

https://twikoo.js.org/faq.html
