import express, { Application, Request, Response } from "express";
import { MyRouter } from "./routes/MyRouter";
import { StatusCodes } from "http-status-codes";
import { RoleRouter } from "./routes/RoleRouter";
import { UserRouter } from "./routes/UserRouter";
import { LoginRouter } from "./routes/LoginRouter";
import cors from "cors";

export const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));




export class Server {
  private readonly app: Application;

  constructor(private readonly myRouter: MyRouter, private readonly port: number) {
    this.app = express();
    this.initialiseMiddlewares();
    this.initialiseRoutes();
    this.initialiseErrorHandling();
  }

  private initialiseMiddlewares() {
  this.app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
  }));
  this.app.use(express.json());
}

  private initialiseRoutes(): void {
    this.app.use("/api", this.myRouter.getRouter());
    const roleRouter = new RoleRouter();
    
    this.app.use("/api/roles", roleRouter.getRouter());
    
    const userRouter = new UserRouter();
    this.app.use("/api/users", userRouter.getRouter());
    
    const loginRouter = new LoginRouter();
    this.app.use("/api/login", loginRouter.getRouter());

  }

  private initialiseErrorHandling() {
    this.app.get("*", (req: Request, res: Response) => {
      const requestedUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
      res.status(StatusCodes.NOT_FOUND).send("Route " + requestedUrl + " not found");
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}
