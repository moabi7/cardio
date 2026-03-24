export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface UserInterface {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  imageUrl: string;
}

export class User implements UserInterface {
  uid: string = "";
  email: string = "";
  firstName: string = "";
  lastName: string = "";
  role: UserRole = UserRole.USER;
  createdAt: string = new Date().toISOString();
  imageUrl: string = "";

  constructor() {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON() {
    return {
      uid: this.uid,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      role: this.role,
      createdAt: this.createdAt,
      imageUrl: this.imageUrl,
    };
  }
}
