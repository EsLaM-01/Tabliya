import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import {
  RegisterSchema,
  type RegisterSchemaType,
} from "../../schemas/auth.schema";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";

// interface UserData {
//   name: string;
//   // username: string,
//   email: string;
//   dateOfBirth: string;
//   gender: "male" | "female";
//   password: string;
//   rePassword: string;
// }
// const RegisterSchema = zod
//   .object({
//     name: zod
//       .string()
//       .nonempty("Name is required")
//       .min(3, "Name must be at least 3 characters")
//       .max(20, "Name must not exceed 20 characters"),

//     email: zod
//       .string()
//       .nonempty("Email is required")
//       .regex(
//         /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|icloud)\.com/,
//         "Email must be a valid Gmail, Yahoo, or iCloud address",
//       ),

//     dateOfBirth: zod
//       .string()
//       .nonempty("Date of birth is required")
//       .refine((dateOfBirthValue) => {
//         const userDate = new Date(dateOfBirthValue).getFullYear();
//         const nowDate = new Date().getFullYear();
//         return nowDate - userDate > 16 ? true : false;
//       }, "You must be older than 16 years"),
//     gender: zod.enum(["male", "female"], "Please select your gender"),
//     password: zod
//       .string()
//       .nonempty("Password is required")
//       .regex(
//         /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
//         "Must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@#$%).",
//       ),
//     rePassword: zod.string().nonempty("Please confirm your password"),
//   })
//   .refine((opj) => opj.password === opj.rePassword, {
//     message: "Passwords do not match",
//     path: ["rePassword"],
//   });
export default function Register() {
  const [isLodding, setisLodding] = useState(false);
  const navigate = useNavigate();
  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      // username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  let { register, handleSubmit, formState, getValues, watch, setError } = form;

  function handelRegister(valuesReg: RegisterSchemaType) {
    setisLodding(true);
    console.log(valuesReg);
    console.log(formState.errors);
    axios
      .post("https://route-posts.routemisr.com/users/signup", valuesReg)
      .then(function (res) {
        console.log(res);

        toast.success(res.data.message || "Registration successful!");
        navigate("/login");
      })
      .catch(function (err) {
        console.log(err.response);

        toast.error(err.response?.data?.message || "Registration failed!");
      })
      .finally(function () {
        setisLodding(false);
      });
    // toast.promise(
    //   axios.post("https://route-posts.routemisr.com/users/signup", valuesReg),
    //   {
    //     loading: "Creating your account...",
    //     success: (res) => res.data.message || "Registration successful!",
    //     error: (err) => err.response?.data?.message || "Registration failed!",
    //   },
    // );
  }
  return (
    <>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-500 mb-2">
              Register
            </h1>
            <p className="text-slate-400 text-sm">
              انضم إلى لمّتنا وشاركنا حكاويك
              {/* — حكاياتنا تبدأ هنا */}
            </p>
          </div>
          <form onSubmit={handleSubmit(handelRegister)} className="space-y-4">
            <div>
              <label
                className="block text-xs font-medium text-slate-400 mb-1"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                placeholder="Enter Your Name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none transition text-sm text-slate-200"
              />
              {formState.errors.name?.message && (
                <p className="flex items-center gap-1.5 mt-1.5 ms-1 text-xs font-medium text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  {formState.errors.name?.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-xs font-medium text-slate-400 mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                // name="email"
                type="email"
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none transition text-sm text-slate-200"
              />
              {formState.errors.email?.message && (
                <p className="flex items-center gap-1.5 mt-1.5 ms-1 text-xs font-medium text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  {formState.errors.email?.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-xs font-medium text-slate-400 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                {...register("password")}
                id="password"
                // name="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none transition text-sm text-slate-200"
              />
              {formState.errors.password?.message && (
                <p className="flex items-center gap-1.5 mt-1.5 ms-1 text-xs font-medium text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  {formState.errors.password?.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-xs font-medium text-slate-400 mb-1"
                htmlFor="repassword"
              >
                Confirm Password
              </label>
              <input
                {...register("rePassword")}
                id="repassword"
                // name="repassword"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none transition text-sm text-slate-200"
              />
              {formState.errors.rePassword?.message && (
                <p className="flex items-center gap-1.5 mt-1.5 ms-1 text-xs font-medium text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  {formState.errors.rePassword?.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-xs font-medium text-slate-400 mb-1"
                htmlFor="date"
              >
                Day Of Birth
              </label>
              <input
                {...register("dateOfBirth")}
                id="date"
                // name="dateOfBirth"
                type="date"
                placeholder="Birth"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none transition text-sm text-slate-200"
              />
              {formState.errors.dateOfBirth?.message && (
                <p className="flex items-center gap-1.5 mt-1.5 ms-1 text-xs font-medium text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  {formState.errors.dateOfBirth?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-400">
                Gender
              </label>
              <div className="flex items-center gap-6">
                <label
                  htmlFor="male"
                  className="flex items-center gap-2 cursor-pointer text-sm text-slate-200"
                >
                  <input
                    {...register("gender")}
                    id="male"
                    // name="gender"
                    type="radio"
                    value="male"
                    defaultChecked
                    className="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  Male
                </label>
                <label
                  htmlFor="female"
                  className="flex items-center gap-2 cursor-pointer text-sm text-slate-200"
                >
                  <input
                    {...register("gender")}
                    id="female"
                    // name="gender"
                    type="radio"
                    value="female"
                    className="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  Female
                </label>
                {formState.errors.gender?.message && (
                  <p className="flex items-center gap-1.5 mt-1.5 ms-1 text-xs font-medium text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    {formState.errors.gender?.message}
                  </p>
                )}
              </div>
            </div>

            <button
              disabled={isLodding}
              type="submit"
              className=" disabled:cursor-not-allowed w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition duration-200 shadow-lg shadow-indigo-500/25 text-sm"
            >
              {isLodding ? "Loading ..." : "Create a new account"}
            </button>
            <div className="mt-6 text-center text-sm text-slate-400">
              <span>Already have an account? </span>
              <Link
                to={"/login"}
                className="text-indigo-400 hover:underline font-medium"
              >
                LogIn
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
