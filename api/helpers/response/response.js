exports.apiResponse = (res, status, message, code, data, token) => {
  const resModel = {
    meta: {
      status: status ? status : false,
      message: message ? message : "",
      code: code ? code : 200
    },
    data: data ? data : {},
    token: token ? token : ""
  };
  res.json(resModel);
};
