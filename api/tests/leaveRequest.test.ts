import { validate } from "class-validator";
import { LeaveRequest } from "../entities/LeaveRequest";

describe("LeaveRequest validation", () => {
  it("should fail if fields are missing", async () => {
    const leave = new LeaveRequest(); 

    const errors = await validate(leave);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("should pass with valid data", async () => {
    const leave = new LeaveRequest();
    leave.employee_id = 123;
    leave.start_date = "2025-06-01";
    leave.end_date = "2025-06-05";

    const errors = await validate(leave);
    expect(errors.length).toBe(0);
  });
});
