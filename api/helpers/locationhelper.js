const { json } = require('body-parser');
var geoip = require('geoip-lite');

exports.getLocation = async (req) => {
    try {
        let ipData = await geoip.lookup(req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress);

        if (Object.keys(ipData)) {
            console.log("user location by ip :" + " " + JSON.stringify(ipData))
            return ipData;
        } else {
            return {};
        }

    }
    catch (e) {
        console.log(e);
        return {};
    }
}