export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface FitnessPlan {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
  advice: string[];
  generatedAt: string;
}

export interface UserInterface {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  imageUrl: string;
  gender?: string;
  goal?: string;
  workoutDays?: string;
  birthdate?: string;
  height?: number;
  weight?: number;
  onboardingComplete: boolean;
  fitnessPlan?: FitnessPlan;
}

export class User implements UserInterface {
  uid: string = "";
  email: string = "";
  firstName: string = "";
  lastName: string = "";
  role: UserRole = UserRole.USER;
  createdAt: string = new Date().toISOString();
  imageUrl: string = "";
  gender?: string;
  goal?: string;
  workoutDays?: string;
  birthdate?: string;
  height?: number;
  weight?: number;
  onboardingComplete: boolean = false;
  fitnessPlan?: FitnessPlan;

  constructor() { }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON() {
    const data: any = {
      uid: this.uid,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      role: this.role,
      createdAt: this.createdAt,
      imageUrl: this.imageUrl,
      onboardingComplete: this.onboardingComplete,
    };

    if (this.gender !== undefined) data.gender = this.gender;
    if (this.goal !== undefined) data.goal = this.goal;
    if (this.workoutDays !== undefined) data.workoutDays = this.workoutDays;
    if (this.birthdate !== undefined) data.birthdate = this.birthdate;
    if (this.height !== undefined) data.height = this.height;
    if (this.weight !== undefined) data.weight = this.weight;
    if (this.fitnessPlan !== undefined) data.fitnessPlan = this.fitnessPlan;

    return data;
  }
}
