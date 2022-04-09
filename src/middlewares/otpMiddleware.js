
const otpGenerator = require("../lib/otp-generator");
const crypto = require("crypto");
const key = "verysecretkey"; // Key for cryptograpy. Keep it secret
//var msg91 = require("msg91")("1", "1", "1");    // ("API_KEY", "SENDER_ID", "ROUTE_NO" )

export const createNewOTP = async function (params, callback) {
  // Generate a 4 digit numeric OTP
  const otp = otpGenerator.generate(4, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const ttl = 5 * 60 * 1000; //5 Minutes in miliseconds
  const expires = Date.now() + ttl; //timestamp to 5 minutes in the future
  const data = `${params.phone}.${otp}.${expires}`; // phone.otp.expiry_timestamp
  const hash = crypto.createHmac("sha256", key).update(data).digest("hex"); // creating SHA256 hash of the data
  const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
  // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
  //sendSMS(phone, `Your OTP is ${otp}. it will expire in 5 minutes`);

  console.log(`Your OTP is ${otp}. it will expire in 5 minutes`);

  var otpMessage = `Dear Customer, ${otp} is the One Time Password ( OTP ) for your login.`;

  //await msg91.send(`+91${params.phone}`, otpMessage, function (err, response) {
    console.log(response);
  //});

  return callback(null, fullHash);
}

export const verifyOTP  = async function(params, callback) {
  // Separate Hash value and expires from the hash returned from the user
  let [hashValue, expires] = params.hash.split(".");
  // Check if expiry time has passed
  let now = Date.now();
  if (now > parseInt(expires)) return callback("OTP Expired");
  // Calculate new hash with the same key and the same algorithm
  let data = `${params.phone}.${params.otp}.${expires}`;
  let newCalculatedHash = crypto
    .createHmac("sha256", key)
    .update(data)
    .digest("hex");
  // Match the hashes
  if (newCalculatedHash === hashValue) {
    return callback(null, "Success");
  }
  return callback("Invalid OTP");
}