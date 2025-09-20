import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsDateString, IsNotEmpty } from "class-validator";

@Entity({ name: "leave_request" })
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  employee_id!: number;

  @Column()
  @IsDateString()
  start_date!: string;

  @Column()
  @IsDateString()
  end_date!: string;

  @Column({ default: "Pending" })
  status!: string;
}
