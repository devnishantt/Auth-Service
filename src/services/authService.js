import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
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

    await this.userRepository.saveRefreshToken(user.id, refreshToken);

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
    const refreshToken = generateRefreshToken({
      id: user.id,
    });

    await this.userRepository.saveRefreshToken(user.id, refreshToken);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new NotFoundError("Refresh token not found");
    }
    const decoded = await verifyRefreshToken(incomingRefreshToken);
    const user = await this.userRepository.findById(decoded.id);
    // if(!user){
    //     throw new UnauthorizedError("Invalid or mismatched refresh token");
    // }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new UnauthorizedError("Invalid or mismatched refresh token");
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = generateRefreshToken({ id: user.id });

    await this.userRepository.saveRefreshToken(user.id, newRefreshToken);

    return { newAccessToken, newRefreshToken };
  }

  async logout(userId, refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is required for logout");
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    console.log("servide hu bc", user.refreshToken);

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    await this.userRepository.saveRefreshToken(user.id, null);

    return true;
  }

  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.userRepository.findById(userId);

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    await this.userRepository.saveRefreshToken(user.id, null);

    return true;
  }
}
