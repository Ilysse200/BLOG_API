import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { BlogAuthor } from "../types/blog.types";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column("text")
  body!: string;

  // Keep existing author relationship unchanged
  @ManyToOne(() => User, user => user.blogs, { nullable: true })
  author!: User;

  // Make blogAuthors nullable and optional for now
  @Column("json", { 
    nullable: true,
    default: null
  })
  blogAuthors?: BlogAuthor[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}