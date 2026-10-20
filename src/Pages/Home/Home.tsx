import axios from "axios";

import type { PostType } from "../../Types/Post.type";
import IsLoding from "../../components/Loding/IsLoding";
import Post from "../../components/post/Post";
import { useQuery } from "@tanstack/react-query";
import PostCreat from "../../components/post/PostCreat";
import { NavLink } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import ChangePassword from "./../Profile/ChangePassword";

import { useState } from "react";
import { IoSettingsOutline, IoChevronDown } from "react-icons/io5";

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return <IsLoding />;
  }
  if (isError) {
    return <h1>`{error.message}`</h1>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 dir-rtl" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 pt-6">
        {/* الشريط الجانبي الأيمن - التنقل */}
        <aside className="hidden md:block lg:col-span-3 space-y-4">
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 sticky top-6">
            <h2 className="text-xl font-bold text-indigo-500 mb-6">تواصل</h2>
            <nav className="space-y-2">
              <NavLink
                to="/Home"
                className="flex items-center gap-3 px-4 py-3 bg-indigo-600/10 text-indigo-400 rounded-xl font-medium text-sm"
              >
                <IoHome />
                Home
              </NavLink>
              <NavLink
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-700/50 rounded-xl font-medium text-sm transition"
              >
                {" "}
                <FaUser />
                Profile
              </NavLink>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen((prev) => !prev)}
                  aria-expanded={isSettingsOpen}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
                >
                  <span className="flex items-center gap-3">
                    <IoSettingsOutline size={18} />
                    Settings
                  </span>

                  <IoChevronDown
                    className={`transition-transform duration-200 ${
                      isSettingsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isSettingsOpen && (
                  <div className="ml-4 rounded-xl border border-slate-700/60 bg-slate-900/50 p-3">
                    <ChangePassword />
                  </div>
                )}
              </div>
            </nav>
          </div>
        </aside>

        {/* الخلاصة الوسطى - المنشورات */}
        <main className="col-span-1 md:col-span-3 lg:col-span-6 space-y-6">
          {/* مربع إنشاء منشور */}
          <PostCreat />
          {/* بطاقة منشور */}
          {data?.data.data.posts.map((post: PostType) => (
            <Post post={post} key={post.id} AllComment={false} />
          ))}
        </main>

        {/* الشريط الجانبي الأيسر - الاقتراحات */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 sticky top-6">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">
              اقتراحات للمتابعة
            </h3>
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700" />
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        مستخدم جديد
                      </p>
                      <span className="text-[10px] text-slate-400">
                        @user_{item}
                      </span>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-xs transition">
                    متابعة
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
