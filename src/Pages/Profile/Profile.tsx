import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import type { UserType } from "../../Types/profile.type";
import IsLoding from "../../components/Loding/IsLoding";
import type { PostType } from "../../Types/Post.type";
import Post from "../../components/post/Post";
import ChangePassword from "./ChangePassword";
// SinglePostPage;
export default function SinglePostPage() {
  function getMyProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile,
  });
  const user: UserType | undefined = data?.data?.data?.user;
  console.log(user);
  function getMyPost(userId: string) {
    return axios.get(
      `https://route-posts.routemisr.com/users/${userId}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const {
    data: postUser,
    isLoading: postsLoading,
    isError: postsError,
    error: postsErrorDetails,
  } = useQuery({
    queryKey: ["getMyPosts", user?._id],
    queryFn: () => getMyPost(user!._id),
    enabled: !!user?._id,
  });

  const myPosts: PostType[] = postUser?.data?.data?.posts ?? [];
  if (isLoading) return <IsLoding />;

  if (isError) {
    return <p className="text-red-400">{error.message}</p>;
  }

  if (!user) return <IsLoding />;

  if (postsLoading) return <IsLoding />;

  if (postsError) {
    return <p className="text-red-400">{postsErrorDetails.message}</p>;
  }
  // console.log("My posts response:", postUser?.data);
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Cover */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="h-48 sm:h-64 bg-gradient-to-r from-indigo-900 via-slate-800 to-indigo-700 relative">
          {user.cover && (
            <img
              src={user.cover}
              alt="Profile cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Information */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <img
              src={user.photo}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-800 -mt-14 relative"
            />

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-slate-400 mt-1">@{user.username}</p>
            </div>

            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
            >
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-700">
            <div className="text-center">
              <p className="text-xl font-bold text-white">0</p>
              <p className="text-sm text-slate-400">Posts</p>
            </div>

            <div className="text-center">
              <p className="text-xl font-bold text-white">
                {user.followersCount}
              </p>
              <p className="text-sm text-slate-400">Followers</p>
            </div>

            <div className="text-center">
              <p className="text-xl font-bold text-white">
                {user.followingCount}
              </p>
              <p className="text-sm text-slate-400">Following</p>
            </div>
          </div>
        </div>
      </div>
      <ChangePassword />
      {/* Profile Details */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-5">About</h2>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-slate-400 mb-1">Email</p>
            <p className="text-slate-200 break-all">{user.email}</p>
          </div>

          <div>
            <p className="text-slate-400 mb-1">Date of Birth</p>
            <p className="text-slate-200">
              {new Date(user.dateOfBirth).toLocaleDateString("en-GB")}
            </p>
          </div>

          <div>
            <p className="text-slate-400 mb-1">Gender</p>
            <p className="text-slate-200 capitalize">{user.gender}</p>
          </div>

          <div>
            <p className="text-slate-400 mb-1">Member Since</p>
            <p className="text-slate-200">
              {new Date(user.createdAt).toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-white">My Posts</h2>

        {myPosts.length > 0 ? (
          myPosts.map((post) => (
            <Post key={post._id} post={post} AllComment={false} />
          ))
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
            <p className="text-slate-300">لا توجد منشورات لعرضها حتى الآن.</p>
          </div>
        )}
      </div>
    </div>
  );
}
