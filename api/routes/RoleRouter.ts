import { Router } from "express";
import { RoleController } from "../controllers/RoleController";

export class RoleRouter {
  private router: Router;
  private roleController: RoleController;

  constructor() {
    this.router = Router();
    this.roleController = new RoleController();
    this.addRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.post("/", this.roleController.create);
  }
}
