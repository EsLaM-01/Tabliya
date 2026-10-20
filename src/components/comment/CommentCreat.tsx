import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaPaperPlane } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";
import { LiaSpinnerSolid } from "react-icons/lia";

type CommentFormValues = {
  content: string;
  image: FileList;
};

export default function CommentCreat({
  postId,
  queryKey,
}: {
  postId: string;
  queryKey: string[];
}) {
  const query = useQueryClient();

  const { register, handleSubmit, reset } = useForm<CommentFormValues>({
    defaultValues: {
      content: "",
    },
  });

  function creatComment(formData: FormData) {
    const content = formData.get("content");
    const image = formData.get("image");

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    };

    if (image instanceof File) {
      return axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        formData,
        { headers },
      );
    }

    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      { content },
      { headers },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: creatComment,

    onSuccess(data) {
      console.log("Comment created:", data.data);
      reset();
      query.invalidateQueries({
        queryKey: queryKey,
      });
    },

    onError(error) {
      if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);
        console.log("Response data:", error.response?.data);
        console.log("Request URL:", error.config?.url);
        console.log("Request data:", error.config?.data);
      } else {
        console.error(error);
      }
    },
  });

  const handleComment: SubmitHandler<CommentFormValues> = (values) => {
    const content = values.content.trim();
    const image = values.image?.[0];

    if (!content && !image) return;

    const formData = new FormData();

    if (content) {
      formData.append("content", content);
    }

    if (image) {
      formData.append("image", image);
    }

    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleComment)} className="w-full pt-2">
      <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-2.5 focus-within:border-indigo-500 transition space-y-2">
        <input
          {...register("content")}
          type="text"
          placeholder="اكتب تعليقاً..."
          disabled={isPending}
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />

        <div className="flex items-center justify-between">
          <label
            htmlFor="image"
            className="cursor-pointer text-slate-400/50 hover:text-indigo-400 transition flex items-center p-1"
            title="إضافة صورة"
          >
            <FaCamera className="text-sm" />

            <input
              {...register("image")}
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
              disabled={isPending}
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="text-slate-400 hover:text-indigo-600 disabled:opacity-50 p-1 transition"
            title="إرسال"
          >
            {isPending ? (
              <LiaSpinnerSolid className="text-sm text-indigo-600" />
            ) : (
              <FaPaperPlane className="text-sm" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
