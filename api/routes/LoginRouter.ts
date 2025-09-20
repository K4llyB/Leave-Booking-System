import { Router } from "express";
import { LoginController } from "../controllers/LoginController";

export class LoginRouter {
  private router: Router;
  private loginController: LoginController;

  constructor() {
    this.router = Router();
    this.loginController = new LoginController();
    this.addRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.post("/", this.loginController.login);
  }
}
