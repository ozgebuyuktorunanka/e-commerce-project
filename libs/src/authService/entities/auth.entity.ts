import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Index
} from 'typeorm';
import { Exclude } from 'class-transformer';

/**
 * Auth Entity
 * 
 * Represents authentication credentials and account status
 * for users in the system.
 */
@Entity('auth')
export class Auth {
  /**
   * Unique identifier for the auth record
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Username used for authentication
   * Must be unique across the system
   */
  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true
  })
  username: string;

  /**
   * Hashed password
   * Original password should never be stored
   */
  @Exclude({ toPlainOnly: true }) // Prevents password hash from being serialized
  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: false
  })
  passwordHash: string;

  /**
   * Indicates if the account is currently active
   * Inactive accounts cannot authenticate
   */
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true
  })
  isActive: boolean;

  /**
   * Number of failed login attempts
   * Used for security lockout features
   */
  @Column({
    name: 'failed_attempts',
    type: 'int',
    default: 0
  })
  failedAttempts: number;

  /**
   * Last login timestamp
   */
  @Column({
    name: 'last_login',
    type: 'timestamp',
    nullable: true
  })
  lastLogin: Date;

  /**
   * Password reset token
   * Used for password recovery
   */
  @Column({
    name: 'reset_token',
    type: 'varchar',
    length: 255,
    nullable: true
  })
  resetToken: string;

  /**
   * Password reset token expiration
   */
  @Column({
    name: 'reset_token_expires',
    type: 'timestamp',
    nullable: true
  })
  resetTokenExpires: Date;

  /**
   * Record creation timestamp
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Record last update timestamp
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Executed before inserting or updating the entity
   * Normalizes the username to lowercase for case-insensitive comparison
   */
  @BeforeInsert()
  @BeforeUpdate()
  normalizeUsername() {
    if (this.username) {
      this.username = this.username.toLowerCase().trim();
    }
  }

  /**
   * Check if password reset token is valid
   * @returns boolean indicating if token is still valid
   */
  isResetTokenValid(): boolean {
    if (!this.resetToken || !this.resetTokenExpires) {
      return false;
    }

    return new Date() < this.resetTokenExpires;
  }

  /**
   * Check if account is locked due to too many failed attempts
   * @param maxAttempts Maximum number of allowed attempts
   * @returns boolean indicating if account is locked
   */
  isAccountLocked(maxAttempts: number = 5): boolean {
    return this.failedAttempts >= maxAttempts;
  }
}