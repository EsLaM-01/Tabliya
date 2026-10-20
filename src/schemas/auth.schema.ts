// import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

export const RegisterSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name must not exceed 20 characters"),

    email: zod
      .string()
      .nonempty("Email is required")
      .regex(
        /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|icloud)\.com/,
        "Email must be a valid Gmail, Yahoo, or iCloud address",
      ),

    dateOfBirth: zod
      .string()
      .nonempty("Date of birth is required")
      .refine((dateOfBirthValue) => {
        const userDate = new Date(dateOfBirthValue).getFullYear();
        const nowDate = new Date().getFullYear();
        return nowDate - userDate > 16 ? true : false;
      }, "You must be older than 16 years"),
    gender: zod.enum(["male", "female"], "Please select your gender"),
    password: zod
      .string()
      .nonempty("Password is required")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
        "Must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@#$%).",
      ),
    rePassword: zod.string().nonempty("Please confirm your password"),
  })
  .refine((opj) => opj.password === opj.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export type RegisterSchemaType = zod.infer<typeof RegisterSchema>;

// ــــــــــــــــــــــــــــــــــــــــــــــــــ

export const LoginSchema = zod.object({
  email: zod
    .string()
    .nonempty("Email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|icloud)\.com/,
      "Email must be a valid Gmail, Yahoo, or iCloud address",
    ),

  password: zod.string().nonempty("Password is required"),
  // .regex(
  //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
  //   "Must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@#$%).",
  // ),
});

export type LoginSchemaType = zod.infer<typeof LoginSchema>;
