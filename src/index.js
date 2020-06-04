const express = require('express');
const alipayInterface = require('./alipayInterface');
const qrCode = require('qrcode');
const { config } = require('../package.json');
const { resolve } = require('path');
const { v4 } = require('uuid');
const Pay = require('./payModel');
const log4js = require("log4js");
const recordLog = log4js.getLogger('trade_record');
const log = log4js.getLogger();

const TRADE_SUCCESS = 'TRADE_SUCCESS';

const app = express();

app.use(express.json({ limit: 2000 }));
app.use(express.urlencoded({ limit: 2000, extended: true }));


const alipayApp = alipayInterface.initClient({
  private_key: './keys/alipay_private.pem',
  app_id: config.appId,
});

const genBase64QrCodePic = async function (body) {
  return new Promise((resolve, reject) => {

    if (!!!body.alipay_trade_precreate_response.qr_code) {
      reject({ code: 0, msg: '获取二维码失败' });
    }

    qrCode.toDataURL(body.alipay_trade_precreate_response.qr_code, (err, url) => {
      if (err) {
        reject({ code: 0, msg: '创建二维码失败', error: err });
      } else {
        resolve(url);
      }
    });
  });
}

app.get('/qrcode', async (req, res, next) => {
  const trade_no = v4();
  const notifyUrl = config.notifyUrl;
  const body = await alipayApp.precreate(
    Object.assign({}, {
      biz_content: {
        out_trade_no: trade_no,
        subject: config.subject,
        total_amount: config.amount,
      },
    }, !!notifyUrl ?
      {
        notify_url: config.notifyUrl
      }
      : null)
  ).catch((err) => {

    res.status(400).send({
      code: 0, msg: '获取二维码失败'
    });
    log.error(err);
  });
  const imgData = await genBase64QrCodePic(body).catch((err) => {
    log.error(err);
    res.status(400).send(err);
  });
  res.send({ code: 1, qrcode: imgData, data: body }).end();

});

app.post('/notify', async (req, res) => {
  const data = req.body;
  if (data.trade_status && data.trade_status == TRADE_SUCCESS) {
    const finded = await Pay.findOne({ out_trade_no: data.out_trade_no });
    if (!!!finded) {
      recordLog.info(data.out_trade_no, data.buyer_id);
      new Pay(data).save((err, _val) => {
        if (err) log(err);
      });
    }
  } else {
    log.error(data);
  }
  res.end();
});

app.get('/query', async (req, res) => {
  const { out_trade_no, device_id } = req.query;
  const find = await Pay.findOne({ out_trade_no: out_trade_no });
  if (!!find) {
    if (!!device_id) {
      await Pay.updateOne({ out_trade_no: req.query.out_trade_no }, { $set: { device_id: device_id } }).catch((err) => {
        res.send({ code: 0, msg: '保存设备ID失败 无法永久激活', note: config.errorNote });
      });
    }
    res.send({ code: 1, msg: '激活成功' });
  } else {
    res.send({ code: 0, msg: '没有查询到激活的订单', note: config.errorNote });
  }
});

app.get('/active', async (req, res) => {
  const { device_id } = req.query;
  logger.debug('device_id', device_id);
  console.log(111);
  if (!!device_id) {
    const find = await Pay.findOne({ device_id: device_id });
    if (!!find) {
      res.send({ code: 1, msg: '激活成功' });
    } else {
      res.send({ code: 0, msg: '未查询到设备 如有疑问', note: config.errorNote });
      log.error("device_id", device_id);
    }
  } else {
    res.send({ code: 0, msg: '请加入device_id', note: config.errorNote });
  }
});

app.use(express.static(resolve(__dirname, '../public/')));

module.exports = app;

