import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Role } from "../entities/Role";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";

export class RoleController {
  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const role = new Role();
      role.name = req.body.name;

      const errors = await validate(role);
      if (errors.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors });
        return;
      }

      const saved = await AppDataSource.getRepository(Role).save(role);
      res.status(StatusCodes.CREATED).json({ data: saved });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };
}
