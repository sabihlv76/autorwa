import { describe, expect, it } from "vitest";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "./auth";

describe("signUpSchema", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "correct-horse",
    confirmPassword: "correct-horse",
  };

  it("accepts a valid signup", () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it("lowercases the email", () => {
    const result = signUpSchema.safeParse({ ...valid, email: "Jane@Example.COM" });
    expect(result.success && result.data.email).toBe("jane@example.com");
  });

  it("rejects mismatched passwords", () => {
    const result = signUpSchema.safeParse({ ...valid, confirmPassword: "different" });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signUpSchema.safeParse({
      ...valid,
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signUpSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("accepts any non-empty password (length is not re-validated at signin)", () => {
    expect(signInSchema.safeParse({ email: "jane@example.com", password: "x" }).success).toBe(
      true,
    );
  });

  it("rejects an empty password", () => {
    expect(signInSchema.safeParse({ email: "jane@example.com", password: "" }).success).toBe(
      false,
    );
  });
});

describe("forgotPasswordSchema", () => {
  it("requires a valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "jane@example.com" }).success).toBe(true);
    expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("requires matching passwords and a token", () => {
    const result = resetPasswordSchema.safeParse({
      token: "abc123",
      password: "correct-horse",
      confirmPassword: "correct-horse",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing token", () => {
    const result = resetPasswordSchema.safeParse({
      token: "",
      password: "correct-horse",
      confirmPassword: "correct-horse",
    });
    expect(result.success).toBe(false);
  });
});
