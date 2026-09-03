export type Role =
  | "customer"
  | "business"
  | "admin"
  | "moderator"
  | "finance"
  | "support";

export type AccountStatus = "active" | "suspended" | "closed";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  accountStatus: AccountStatus;
}

export interface UserWithPasswordHash extends PublicUser {
  passwordHash: string;
}
