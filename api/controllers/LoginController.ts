import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export class LoginController {
  private userRepo = AppDataSource.getRepository(User);

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
      const user = await this.userRepo.findOne({ where: { email }, relations: ["role"] });

      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid credentials" });
        return;
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid credentials" });
        return;
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role.name
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "defaultsecret",
        { expiresIn: process.env.JWT_EXPIRY || "1h" }
      );

      res.status(StatusCodes.OK).json({ token });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };
}
