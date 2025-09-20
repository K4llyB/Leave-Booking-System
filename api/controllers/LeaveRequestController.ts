import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LeaveRequest } from "../entities/LeaveRequest";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { AuthenticatedRequest } from "../middlewares/auth";
import { User } from "../entities/User";



export class LeaveRequestController {
  public createLeaveRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const leaveRepo = AppDataSource.getRepository(LeaveRequest);

      const leave = new LeaveRequest();
      leave.employee_id = req.body.employee_id;
      leave.start_date = req.body.start_date;
      leave.end_date = req.body.end_date;

      const errors = await validate(leave);
      if (errors.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors });
        return;
      }

      console.log("Saving:", leave);

      const saved = await leaveRepo.save(leave);
      res.status(StatusCodes.CREATED).json({
        message: "Leave request created successfully",
        data: saved
      });
    } catch (err: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  };

  public getAllLeaveRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const leaveRepo = AppDataSource.getRepository(LeaveRequest);
    const allRequests = await leaveRepo.find();
    res.status(StatusCodes.OK).json({ data: allRequests });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

public approveLeaveRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { leave_request_id } = req.body;

    const repo = AppDataSource.getRepository(LeaveRequest);
    const requestToUpdate = await repo.findOneBy({ id: leave_request_id });

    if (!requestToUpdate) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Leave request not found" });
      return;
    }

    requestToUpdate.status = "Approved";
    const saved = await repo.save(requestToUpdate);

    res.status(StatusCodes.OK).json({
      message: "Leave request approved successfully",
      data: saved
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

public rejectLeaveRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { leave_request_id } = req.body;

    const repo = AppDataSource.getRepository(LeaveRequest);
    const requestToUpdate = await repo.findOneBy({ id: leave_request_id });

    if (!requestToUpdate) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Leave request not found" });
      return;
    }

    requestToUpdate.status = "Rejected";
    const saved = await repo.save(requestToUpdate);

    res.status(StatusCodes.OK).json({
      message: "Leave request rejected successfully",
      data: saved
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

public cancelLeaveRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { employee_id, leave_request_id } = req.body;
    const leaveRepo = AppDataSource.getRepository(LeaveRequest);
    const userRepo = AppDataSource.getRepository(User);

    const leave = await leaveRepo.findOneBy({ id: leave_request_id });

    if (!leave) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Leave request not found" });
      return;
    }

    const isOwner = req.user.id === employee_id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(StatusCodes.FORBIDDEN).json({ error: "Not authorised to cancel this request" });
      return;
    }

    if (leave.status === "Approved") {
      const user = await userRepo.findOneBy({ id: employee_id });
      if (user) {
        const days = Math.ceil(
          (new Date(leave.end_date).getTime() - new Date(leave.start_date).getTime()) /
          (1000 * 60 * 60 * 24) + 1
        );
        user.remaining_leave_days += days;
        await userRepo.save(user);
      }
    }

    leave.status = "Cancelled";
    await leaveRepo.save(leave);

    res.status(StatusCodes.OK).json({ message: "Leave request cancelled" });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

public getStatusByEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const employee_id = parseInt(req.params.employee_id);
    const leaveRepo = AppDataSource.getRepository(LeaveRequest);

    const requests = await leaveRepo.find({
      where: { employee_id },
      order: { start_date: "ASC" }
    });

    res.status(StatusCodes.OK).json({ data: requests });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

public getRemainingLeave = async (req: Request, res: Response): Promise<void> => {
  try {
    const employee_id = parseInt(req.params.employee_id);
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ id: employee_id });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
      return;
    }

    res.status(StatusCodes.OK).json({
      employee_id: user.id,
      remaining_leave_days: user.remaining_leave_days
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

}
