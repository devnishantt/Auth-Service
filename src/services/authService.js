import {
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from "../utils/errors.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

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

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ id: user.id });

    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Account is deactivated");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    await this.userRepository.updateLastLogin(user.id);

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateAccessToken({
      id: user.id,
    });

    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }
}
