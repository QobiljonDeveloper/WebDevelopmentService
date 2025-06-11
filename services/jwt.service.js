const config = require("config");
const jwt = require("jsonwebtoken");

class JwtService {
  constructor(accsesKey, refreshKey, accsesTime, refreshTime) {
    this.accsesKey = accsesKey;
    this.refreshKey = refreshKey;
    this.accsesTime = accsesTime;
    this.refreshTime = refreshTime;
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.accsesKey, {
      expiresIn: this.accsesTime,
    });
    const refreshToken = jwt.sign(payload, this.refreshKey, {
      expiresIn: this.refreshTime,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  verifyAccessToken(token) {
    return jwt.verify(token, this.accsesKey);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshKey);
  }
}

const DeveloperJwtService = new JwtService(
  config.get("access_key_dev"),
  config.get("refresh_key_dev"),
  config.get("access_time_dev"),
  config.get("refresh_time_dev")
);

const ClientJwtService = new JwtService(
  config.get("access_key_client"),
  config.get("refresh_key_client"),
  config.get("access_time_client"),
  config.get("refresh_time_client")
);

const AdminJwtService = new JwtService(
  config.get("access_key_admin"),
  config.get("refresh_key_admin"),
  config.get("access_time_admin"),
  config.get("refresh_time_admin")
);

module.exports = {
  DeveloperJwtService,
  ClientJwtService,
  AdminJwtService,
};
