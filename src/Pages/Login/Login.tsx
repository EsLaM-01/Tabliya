// import React, { useState } from "react";
// // AuthPage
// export default function Login() {
//   // const [isSignUp, setIsSignUp] = useState(false);

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
//       <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-indigo-500 mb-2">تواصل</h1>
//           <p className="text-slate-400 text-sm">
//             {/* {isSignUp */}? "أنشئ حسابك وابدأ بالتواصل" : "مرحباً بك مجدداً،
//             سجل دخولك"
//             {/* } */}
//           </p>
//         </div>

//         <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
//           {/* {isSignUp && ( */}
//           <div>
//             <label className="block text-xs font-medium text-slate-400 mb-1">
//               الاسم الكامل
//             </label>
//             <input
//               type="text"
//               placeholder="أحمد محمد"
//               className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none transition text-sm text-slate-200"
//             />
//           </div>
//           {/* // )} */}

//           <div>
//             <label className="block text-xs font-medium text-slate-400 mb-1">
//               البريد الإلكتروني
//             </label>
//             <input
//               type="email"
//               placeholder="name@example.com"
//               className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none transition text-sm text-slate-200"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-slate-400 mb-1">
//               كلمة المرور
//             </label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none transition text-sm text-slate-200"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition duration-200 shadow-lg shadow-indigo-500/25 text-sm"
//           >
//             {/* {isSignUp ? */}
//             "إنشاء حساب جديد" : "تسجيل الدخول"
//             {/* } */}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm text-slate-400">
//           <span>
//             {/* {isSignUp ?  */}
//             "لديك حساب بالفعل؟" : "ليس لديك حساب؟"
//             {/* } */}
//           </span>{" "}
//           <button
//             // onClick={() => setIsSignUp(!isSignUp)}
//             className="text-indigo-400 hover:underline font-medium"
//           >
//             {/* {isSignUp ?  */}
//             "سجل دخولك" : "أنشئ حساباً"
//             {/* } */}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { LoginSchema, type LoginSchemaType } from "../../schemas/auth.schema";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

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
export default function Login() {
  const navigate = useNavigate();
  const [isLodding, setisLodding] = useState(false);
  // const { userLogin, setuserLogin } = useContext(AuthContext);
  const { userLogin, setuserLogin, setUserData } = useContext(AuthContext);
  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  let { register, handleSubmit, formState, getValues, watch, setError } = form;

  function handelLogin(valuesReg: LoginSchemaType) {
    setisLodding(true);
    console.log(valuesReg);
    console.log(formState.errors);
    axios
      .post("https://route-posts.routemisr.com/users/signin", valuesReg)
      .then(function (res) {
        const { token, user } = res.data.data;

        localStorage.setItem("userToken", token);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("userData", JSON.stringify(user));

        setuserLogin(token);
        setUserData(user);

        toast.success(res.data.message || "Login successful!");
        navigate("/home");
      })
      .catch(function (err) {
        console.log(err.response);

        toast.error(err.response?.data?.message || "Registration failed!");
      })
      .finally(function () {
        setisLodding(false);
      });
  }
  return (
    <>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-500 mb-2">Login</h1>
            <p className="text-slate-400 text-sm">
              أهلًا بعودتك! سجل الدخول وكمل الحكاوي
              {/* — حكاياتنا تبدأ هنا */}
            </p>
          </div>
          <form onSubmit={handleSubmit(handelLogin)} className="space-y-4">
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

            <button
              disabled={isLodding}
              type="submit"
              className=" disabled:cursor-not-allowed w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition duration-200 shadow-lg shadow-indigo-500/25 text-sm"
            >
              {isLodding ? "Loading ..." : "Sign in"}
            </button>
            <div className="mt-6 text-center text-sm text-slate-400">
              <span>You do not have an account?</span>
              <Link
                to={"/Register"}
                className="text-indigo-400 hover:underline font-medium"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
