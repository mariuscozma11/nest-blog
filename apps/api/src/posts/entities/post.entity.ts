import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { PostStatus } from '../../common/enums/post-status.enum';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ nullable: true })
  excerpt!: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  status!: PostStatus;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, { eager: true })
  author!: User;

  @Column()
  authorId!: string;

  @BeforeInsert()
  generateSlug(): void {
    if (!this.slug && this.title) {
      this.slug = this.createSlug(this.title);
    }
  }

  @BeforeUpdate()
  updateSlug(): void {
    if (this.title && !this.slug) {
      this.slug = this.createSlug(this.title);
    }
  }

  private createSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString(36)
    );
  }
}
