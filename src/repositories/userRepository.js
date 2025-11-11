import BaseRepository from "./baseRepository.js";
import { User } from "../models/user.js";

export default class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }
}
