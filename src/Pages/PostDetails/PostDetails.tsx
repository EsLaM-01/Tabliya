import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import IsLoding from "../../components/Loding/IsLoding";
import { useQuery } from "@tanstack/react-query";
import Post from "../../components/post/Post";

export default function PostDetails() {
  const { _id } = useParams();
  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["getSinglePosts"],
    queryFn: getPostDetails,
  });
  console.log(data?.data.data.post);
  if (isLoading) {
    return <IsLoding />;
  }
  if (isError) {
    return <h1>`{error.message}`</h1>;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 pt-6">
          <aside className="hidden md:block lg:col-span-3 space-y-4"></aside>
          <main className="col-span-1 md:col-span-3 lg:col-span-6 space-y-6">
            {data?.data.data.post && (
              <Post post={data?.data.data.post} AllComment={true} />
            )}
          </main>
          <aside className="hidden lg:block lg:col-span-3 space-y-4"></aside>
        </div>
      </div>
    </>
  );
}
