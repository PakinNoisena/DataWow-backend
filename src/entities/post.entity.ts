import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { CommunityEntity } from "./community.entity";

@Entity("posts")
export class PostEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: "owner" })
  owner!: UserEntity;

  @ManyToOne(() => CommunityEntity, { eager: true })
  @JoinColumn({ name: "community" })
  community!: CommunityEntity;
}
