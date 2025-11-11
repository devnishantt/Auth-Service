import { ConflictError } from "../utils/errors.js";
import { generateToken } from "../utils/tokenUtils.js";

export default class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(userData) {
    const { email, password, firstName, lastName, role } = userData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const user = await this.userRepository.create({
      email,
      password,
      firstName,
      lastName: lastName ?? null,
      role: role || "user",
    });

    const tokens = generateToken(user);

    return {
      user: user.toJSON(),
      ...tokens,
    };
  }
}
