const RefreshToken = require("../models/RefreshTokenModel");

class TokenService {
  async saveRefreshToken(userId, token, expiresInDays = 7) {
    try {
      const expiresAt = new Date(
        Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
      );
      const doc = new RefreshToken({ token, user: userId, expiresAt });
      return await doc.save();
    } catch (error) {
      throw new Error(`Lỗi khi lưu refresh token: ${error.message}`);
    }
  }


  async findRefreshToken(token) {
    try {
      return await RefreshToken.findOne({ token, revoked: false }).exec();
    } catch (error) {
      throw new Error(`Lỗi khi tìm refresh token: ${error.message}`);
    }
  }


  async removeRefreshToken(token) {
    try {
      return await RefreshToken.deleteOne({ token }).exec();
    } catch (error) {
      throw new Error(`Lỗi khi xóa refresh token: ${error.message}`);
    }
  }


  async replaceRefreshToken(userId, oldToken, newToken, expiresInDays = 7) {
    try {
      // Xóa token cũ
      await RefreshToken.deleteOne({ token: oldToken, user: userId }).exec();
      // Lưu token mới
      return await this.saveRefreshToken(userId, newToken, expiresInDays);
    } catch (error) {
      throw new Error(`Lỗi khi thay thế refresh token: ${error.message}`);
    }
  }


  async revokeRefreshToken(token) {
    try {
      return await RefreshToken.findOneAndUpdate(
        { token },
        { revoked: true },
        { new: true },
      ).exec();
    } catch (error) {
      throw new Error(`Lỗi khi revoke refresh token: ${error.message}`);
    }
  }


  async cleanupExpiredTokens() {
    try {
      const now = new Date();
      return await RefreshToken.deleteMany({
        expiresAt: { $lt: now },
      }).exec();
    } catch (error) {
      throw new Error(`Lỗi khi xóa token hết hạn: ${error.message}`);
    }
  }

  async revokeAllUserTokens(userId) {
    try {
      return await RefreshToken.deleteMany({ user: userId }).exec();
    } catch (error) {
      throw new Error(`Lỗi khi xóa tất cả token của user: ${error.message}`);
    }
  }
}

module.exports = new TokenService();
