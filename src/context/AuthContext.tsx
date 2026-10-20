// /* eslint-disable react-refresh/only-export-components */
// import React, {
//   createContext,
//   useEffect,
//   useState,
//   type Dispatch,
//   type ReactNode,
// } from "react";

// type AuthContextType = {
//   userLogin: string | null;
//   setuserLogin: Dispatch<React.SetStateAction<string>>;
// };

// export const AuthContext = createContext<AuthContextType>({
//   userLogin: null,
//   setuserLogin: () => {},
// });

// export default function AuthContextProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const [userLogin, setuserLogin] = useState("");
//   useEffect(() => {
//     if (localStorage.getItem("userToken")) {
//       setuserLogin(localStorage.getItem("userToken")!);
//     }
//   }, []);
//   // useEffect(() => {
//   //   localStorage.getItem("userToken");
//   // }, []);
//   return (
//     <AuthContext.Provider value={{ userLogin, setuserLogin }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type UserData = {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
};

type AuthContextType = {
  userLogin: string | null;
  setuserLogin: Dispatch<SetStateAction<string | null>>;
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
};

export const AuthContext = createContext<AuthContextType>({
  userLogin: null,
  setuserLogin: () => {},
  userData: null,
  setUserData: () => {},
});

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userLogin, setuserLogin] = useState<string | null>(() =>
    localStorage.getItem("userToken"),
  );

  const [userData, setUserData] = useState<UserData | null>(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <AuthContext.Provider
      value={{ userLogin, setuserLogin, userData, setUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}
