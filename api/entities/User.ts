import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert} from "typeorm";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "./Role";
import * as bcrypt from "bcrypt";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  @MinLength(10, { message: "Password must be at least 10 characters long" })
  password!: string;

  @Column({ default: 25 })
  remaining_leave_days!: number;


  @Column({ unique: true })
  @IsEmail({}, { message: "Must be a valid email address" })
  email!: string;

  @ManyToOne(() => Role, { nullable: false, eager: true })
  @IsNotEmpty({ message: "Role is required" })
  role!: Role;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

  
  }
}
