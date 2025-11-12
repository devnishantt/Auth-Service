import BaseRepository from "./baseRepository.js";
import User from "../models/user.js";
import { NotFoundError } from "../utils/errors.js";

export default class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }

  async saveRefreshToken(userId, refreshToken) {
    if (!refreshToken) {
      throw new NotFoundError("Refresh token not found!");
    }
    return await this.update(userId, { refreshToken });
  }

  async updateLastLogin(userId) {
    return await this.update(userId, { lastLogin: new Date() });
  }
}
