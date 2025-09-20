import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LeaveRequestController } from "../controllers/LeaveRequestController";
import { authenticateToken, requireRole } from "../middlewares/auth";


export class MyRouter {
  private router: Router;
  private leaveRequestController: LeaveRequestController;

  constructor() {
    this.router = Router();
    this.leaveRequestController = new LeaveRequestController();
    this.addRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private addRoutes(): void {
    
    this.router.get("/", (req: Request, res: Response) => {
      res.status(StatusCodes.OK).send("reached index");
    });

    this.router.get("/other", (req: Request, res: Response) => {
      res.status(StatusCodes.OK).send("reached other");
    });

    this.router.post("/leave-requests", this.leaveRequestController.createLeaveRequest);

    this.router.get("/leave-requests", authenticateToken, requireRole(["manager", "admin"]), this.leaveRequestController.getAllLeaveRequests);

    this.router.patch("/leave-requests/approve", authenticateToken, requireRole(["manager", "admin"]), this.leaveRequestController.approveLeaveRequest);

    this.router.patch("/leave-requests/reject", authenticateToken, requireRole(["manager", "admin"]), this.leaveRequestController.rejectLeaveRequest);

    this.router.delete("/leave-requests", authenticateToken, this.leaveRequestController.cancelLeaveRequest);

    this.router.get("/leave-requests/status/:employee_id", authenticateToken, this.leaveRequestController.getStatusByEmployee);

    this.router.get("/leave-requests/remaining/:employee_id", authenticateToken, this.leaveRequestController.getRemainingLeave);

  }
}
