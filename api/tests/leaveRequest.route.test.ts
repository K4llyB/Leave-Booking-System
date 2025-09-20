import request from "supertest";
import express from "express";
import { LeaveRequestController } from "../controllers/LeaveRequestController";
import { json } from "express";
import { TestDataSource } from "../test-data-source";
import { AppDataSource } from "../data-source"; 

// Override AppDataSource
(AppDataSource as any).getRepository = TestDataSource.getRepository.bind(TestDataSource);

// Create a test app
const app = express();
app.use(json());

const controller = new LeaveRequestController();
app.post("/leave-requests", controller.createLeaveRequest);

beforeAll(async () => {
  await TestDataSource.initialize();
});

afterAll(async () => {
  await TestDataSource.destroy();
});

describe("POST /leave-requests", () => {
  it("should return 201 for valid request", async () => {
    const response = await request(app)
      .post("/leave-requests")
      .send({
        employee_id: 999,
        start_date: "2025-07-01",
        end_date: "2025-07-05"
      });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("Pending");
  });

  it("should return 400 for missing fields", async () => {
    const response = await request(app)
      .post("/leave-requests")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
