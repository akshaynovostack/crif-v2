var Config = require(_pathconst.FilesPath.ConfigUrl);
const axios = require("axios");


exports.getShorturl = async function (url) {
    let response = await axios.request({
        method: "post",
        url: Config.customShortnerBasePath + `short-urls`,
        data: { longUrl: url },
        headers: { 'X-Api-Key': Config.customShortnerApiKey }
    });
    return response.data && response.data.shortUrl ? response.data.shortUrl : "";
}
