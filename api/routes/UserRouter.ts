import { Router } from "express";
import { UserController } from "../controllers/UserController";

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.addRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.post("/", this.userController.create);
    this.router.get("/", this.userController.getAll);
    this.router.get("/email/:email", this.userController.getByEmail);
  }
}
