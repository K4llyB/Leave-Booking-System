import "reflect-metadata";
import { DataSource } from "typeorm";
import { LeaveRequest } from "./entities/LeaveRequest";

export const TestDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3307, // IMPORTANT: MySQL port changed from 3306 to 3307 - This also needs to be changed in XAMPP .ini file for phpmyadmin
  username: "root",
  password: "", 
  database: "leave_booking", 
  synchronize: false, 
  logging: false,
  entities: [LeaveRequest],
});
