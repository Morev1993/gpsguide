// Set user info from request
var fs = require("fs");

exports.setUserInfo = function setUserInfo(request) {
    var getUserInfo = {
        _id: request._id,
        email: request.email,
        name: request.name,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt
    };

    return getUserInfo;
};

exports.setDeviceInfo = function setDeviceInfo(request) {
    var getDeviceInfo = {
        _id: request._id,
        accountId: request.accountId,
        name: request.name,
        authCode: request.authCode,
        device: request.device,
        version: request.version,
        orderBy: request.orderBy,
        status: request.status
    };

    return getDeviceInfo;
};

exports.deleteFolderRecursive = deleteFolderRecursive = path => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
