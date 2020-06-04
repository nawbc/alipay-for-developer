const mongoose = require('./mongodb');

const paySchema = new mongoose.Schema({
  gmt_create: String,
  charset: String,
  seller_email: String,
  subject: String,
  sign: String,
  buyer_id: String,
  invoice_amount: String,
  notify_id: String,
  fund_bill_list: String,
  notify_type: String,
  trade_status: String,
  receipt_amount: String,
  buyer_pay_amount: String,
  app_id: String,
  sign_type: String,
  seller_id: String,
  gmt_payment: String,
  notify_time: String,
  version: String,
  out_trade_no: String,
  total_amount: String,
  trade_no: String,
  auth_app_id: String,
  buyer_logon_id: String,
  point_amount: String,
  device_id: String,
});

module.exports = mongoose.model('pay', paySchema);

