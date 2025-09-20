import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import { validate } from "class-validator";

export class UserController {
  private userRepo = AppDataSource.getRepository(User);
  private roleRepo = AppDataSource.getRepository(Role);

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = new User();
      user.email = req.body.email;
      user.password = req.body.password;

      const role = await this.roleRepo.findOne({ where: { id: req.body.roleId } });
      if (!role) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid role ID" });
        return;
      }
      user.role = role;

      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors });
        return;
      }

      const saved = await this.userRepo.save(user);
      res.status(StatusCodes.CREATED).json({ data: saved });
    } catch (err: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  };

  public getAll = async (_: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userRepo.find({ relations: ["role"] });
      res.status(StatusCodes.OK).json({ data: users });
    } catch (err: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  };

  public getByEmail = async (req: Request, res: Response): Promise<void> => {
    const email = req.params.email;
    try {
      const user = await this.userRepo.findOne({ where: { email }, relations: ["role"] });
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
        return;
      }
      res.status(StatusCodes.OK).json({ data: user });
    } catch (err: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  };
}
