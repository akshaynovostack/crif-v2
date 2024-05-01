exports.catchError = (error) => {
    let response = {
        data: {},
        status: 500,
        message: "Something went wrong"
    }
    if (error.response) {
        // Request made and server responded
        response.data = error.response.data;
        response.status = error.response.status;
        response.message = error.message;
    } else if (error.request) {
        // The request was made but no response was received

        response.message = error.message ? error.message : "server time out";
        response.status = 503;
    } else {
        // Something happened in setting up the request that triggered an Error
        response.message = error.message;
    }
    return response;
};
