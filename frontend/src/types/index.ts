export type Role = "Admin" | "Manager" | "Member";
export type Status = "Active" | "Inactive";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: Status;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
}