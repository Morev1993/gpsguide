// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
  var getUserInfo = {
	_id: request._id,
    email: request.email
  };

  return getUserInfo;
};