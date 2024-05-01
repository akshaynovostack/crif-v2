var Config = require(_pathconst.FilesPath.ConfigUrl);

const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient(Config.bitlyAccessToken);

exports.getBitlyurl = async function (url) {
    const response = await bitly.shorten(url);
    // console.log(response.link)
    return response.link
}
