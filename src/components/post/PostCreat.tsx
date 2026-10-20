import { CiImageOn } from "react-icons/ci";
import { FaPaperPlane, FaWindowClose } from "react-icons/fa";
import { LiaSpinnerSolid } from "react-icons/lia";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function PostCreat() {
  const { userData } = useContext(AuthContext);
  const [isUploaded, setIsUploaded] = useState("");

  const query = useQueryClient();

  const textInput = useRef<HTMLTextAreaElement>(null);
  const imgInput = useRef<HTMLInputElement>(null);

  function creatPost(formData: FormData) {
    return axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { isPending, mutate } = useMutation({
    mutationFn: creatPost,

    onSuccess(data) {
      if (textInput.current) {
        textInput.current.value = "";
      }

      if (imgInput.current) {
        imgInput.current.value = "";
      }

      setIsUploaded("");

      query.invalidateQueries({
        queryKey: ["getAllPosts"],
      });
      toast.success(data.data.message);
    },

    onError(error) {
      console.error("Error creating post:", error);
    },
  });

  function handelCreatPost() {
    const body = textInput.current?.value.trim() ?? "";
    const image = imgInput.current?.files?.[0];

    if (!body && !image) return;

    const formData = new FormData();

    if (body) {
      formData.append("body", body);
    }

    if (image) {
      formData.append("image", image);
    }

    mutate(formData);
  }

  function handelPrevewImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setIsUploaded("");
      return;
    }

    const path = URL.createObjectURL(file);
    setIsUploaded(path);
  }

  useEffect(() => {
    return () => {
      if (isUploaded) {
        URL.revokeObjectURL(isUploaded);
      }
    };
  }, [isUploaded]);

  function removeImage() {
    if (imgInput.current) {
      imgInput.current.value = "";
    }

    setIsUploaded("");
  }

  return (
    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
      <div className="flex gap-3">
        <div className="flex items-center gap-2 shrink-0">
          {userData?.photo ? (
            <img
              title={userData?.name}
              src={userData.photo}
              alt={userData.name || "User"}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-semibold">
              {userData?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>

        <textarea
          ref={textInput}
          rows={3}
          placeholder="عايز تحكيلنا حاجه؟"
          disabled={isPending}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 resize-none"
        />
      </div>

      {isUploaded && (
        <div className="relative w-fit">
          <button
            type="button"
            onClick={removeImage}
            disabled={isPending}
            className="absolute top-1 start-1 text-indigo-600"
            title="حذف الصورة"
          >
            <FaWindowClose />
          </button>

          <img
            src={isUploaded}
            alt="معاينة الصورة"
            className="w-25 h-25 mt-2 rounded shadow-fuchsia-900"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700/50">
        <label
          htmlFor="imagee"
          className="cursor-pointer px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-xs text-slate-300 rounded-lg transition"
          title="إضافة صورة"
        >
          <CiImageOn className="text-sm" />

          <input
            ref={imgInput}
            type="file"
            id="imagee"
            accept="image/*"
            className="hidden"
            disabled={isPending}
            onChange={handelPrevewImage}
          />
        </label>

        <button
          type="button"
          disabled={isPending}
          onClick={handelCreatPost}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition flex items-center gap-1 disabled:opacity-50"
        >
          {isPending ? (
            <LiaSpinnerSolid className="text-sm animate-spin" />
          ) : (
            <FaPaperPlane className="text-sm" />
          )}

          <span>{isPending ? "Posting..." : "Post"}</span>
        </button>
      </div>
    </div>
  );
}
