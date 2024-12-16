import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { PostEntity } from "./post.entity";

@Entity("comments")
export class CommentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  message!: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: "commented_by" })
  commentedBy!: UserEntity;

  @ManyToOne(() => PostEntity, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "post" })
  post!: PostEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
