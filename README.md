
### 1. 使用
`npm install`
<br>

`npm start` 开启服务  使用pm2js管理 
<br>

`npm run dev` 运行开发环境

申请当面付[链接](https://openhome.alipay.com/svr/ability/SM010000000000001000/DANGMIAN_API/manage) 当面付每单会有 0.006 的费率 没有营业执照会有限制 具体看文档
<br>

### 2. 接口
<br>

| 接口    | 参数                                           | 返回                                                                      | 功能         |
| ------- | ---------------------------------------------- | ------------------------------------------------------------------------- | ------------ |
| /qrcode | -                                              | code:num<br>qrcode:string base64图片<br>origin: object<br>amount:num 金额 | 获取二维码   |
| /query  | out\_trade\_no 订单<br>device\_id 设备的唯一id | code:num                                                                  | 查询激活     |
| /active | device\_id 设备的唯一id                        | code:num                                                                  | 查询永久激活 |

### 3\. 配置

在package.json config 中配置 不得缺少参数

**在 keys/alipay-private.pem 文件加中 begin end 中间添加生成的私钥**
<br>
| server    | 服务器相关                             |
| --------- | -------------------------------------- |
| appId     | 支付宝创建当面付的 appid               |
| notifyUrl | 支付完成的回调地址                     |
| amount    | 金额                                   |
| errorNote | 发生错误 返回的备注信息                |
| db        | 注意数据库 使用的mongodb  需要配置密码 |
| subject   | 支付时显示的信息                       |

### 4. 日志
1. log/trade-record.log  交易记录 

