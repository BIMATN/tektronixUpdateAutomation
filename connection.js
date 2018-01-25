//Logic for forming URL
const user = 'benr';
const pass = 'none!!';
const mediusIP = "http://"+user+":"+pass+"@10.126.2.21/vnm-api/index.php"; //This Works! Thanks to RFC 1738 you can pass authorization before the host with an @ sign

module.exports = mediusIP;
