import type { PostType } from "../../Types/Post.type";
import { FcLike } from "react-icons/fc";
import { FaShare, FaEllipsisV, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import Comment from "../comment/Comment";
import { Link } from "react-router-dom";
import axios from "axios";
import IsLoding from "../Loding/IsLoding";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CommentType } from "../../Types/comment.type";
import CommentCreat from "../comment/CommentCreat";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { CiImageOn } from "react-icons/ci";

export default function Post({
  post,
  AllComment = false,
}: {
  post: PostType;
  AllComment: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedBody, setUpdatedBody] = useState(post.body || "");
  const queryClient = useQueryClient();

  const {
    topComment,
    body,
    image,
    likesCount,
    sharesCount,
    commentsCount,
    _id,
  } = post;

  // معرف المستخدم الحالي (تأكد من مطابقته لطريقة تخزينك له، أو استخدم jwt-decode للتوكن)
  const currentUserId = localStorage.getItem("userId");
  const isOwner = currentUserId === post.user?._id;
  // console.log("Current User ID:", currentUserId);
  // console.log("Post Owner ID:", post.user?._id);
  // console.log("Is Owner:", isOwner);

  // 1. طلب الحذف (Delete Mutation)
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      return axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });

      toast.success("تم حذف المنشور بنجاح");
    },

    onError: (error: any) => {
      Swal.fire({
        title: "تعذر الحذف",
        text: error.response?.data?.message || "حدث خطأ أثناء حذف المنشور",
        icon: "error",
        confirmButtonText: "حسنًا",
      });
    },
  });

  // 2. طلب التعديل (Update Mutation)
  const updateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("body", updatedBody);

      if (selectedImage) {
        formData.append("image", selectedImage);
      } else if (removeImage) {
        formData.append("removeImage", "true");
      }

      return axios.put(
        `https://route-posts.routemisr.com/posts/${_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
    },

    onSuccess: () => {
      setIsEditing(false);
      setSelectedImage(null);
      setRemoveImage(false);

      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });

      toast.success("تم تعديل المنشور بنجاح");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التعديل");
    },
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    image || null,
  );

  const imageInputRef = useRef<HTMLInputElement>(null);
  function handleDelete() {
    Swal.fire({
      title: "حذف المنشور؟",
      text: "هل أنت متأكد أنك تريد حذف هذا المنشور؟",
      icon: "warning",
      background: "#0F162A",
      color: "#FFFFFF",
      showCancelButton: true,
      confirmButtonColor: "#F97316",
      cancelButtonColor: "#273449",
      confirmButtonText: "حذف",
      cancelButtonText: "إلغاء",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        title: "text-lg font-semibold",
        confirmButton: "rounded-lg px-5 py-2",
        cancelButton: "rounded-lg px-5 py-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(_id);
      }
    });

    setShowMenu(false);
  }

  function getPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPostComments", _id],
    queryFn: getPostComments,
    enabled: AllComment,
  });

  if (isLoading) {
    return <IsLoding />;
  }
  if (isError) {
    return <h1>`{error.message}`</h1>;
  }

  return (
    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4 relative">
      {/* هيدر المنشور */}
      <div className="flex items-center justify-between">
        <Link
          to={`/profile/${post.user?._id}`}
          className="flex items-center gap-3 min-w-0"
        >
          {post.user?.photo ? (
            <img
              src={post.user.photo}
              alt={post.user.name}
              className="w-10 h-10 rounded-full object-cover border border-indigo-500/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold">
              {post.user?.name?.[0] || "U"}
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-slate-100 hover:text-indigo-400 transition">
              {post.user?.name}
            </h3>

            <span className="text-xs text-slate-400">
              {new Date(post.createdAt).toLocaleDateString("ar-EG", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </Link>

        {/* زر الخيارات (تعديل / حذف) يظهر لصاحب المنشور فقط */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-slate-400 hover:text-slate-200 p-2 rounded-full transition"
            >
              <FaEllipsisV />
            </button>

            {/* القائمة المنسدلة */}
            {showMenu && (
              <div className="absolute left-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setIsEditing(true);
                  }}
                  className="w-full text-right px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition"
                >
                  <FaEdit className="text-indigo-400" /> تعديل
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="w-full text-right px-4 py-2.5 text-xs text-red-400 hover:bg-slate-800 flex items-center gap-2 transition disabled:opacity-50"
                >
                  <FaTrash className="text-red-400" />
                  {deleteMutation.isPending ? "جاري الحذف..." : "حذف"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* محتوى المنشور أو نافذة التعديل */}

      {isEditing ? (
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 shrink-0 flex items-center justify-center text-slate-300 font-bold">
              {post.user?.name?.[0] || "U"}
            </div>

            <textarea
              value={updatedBody}
              onChange={(e) => setUpdatedBody(e.target.value)}
              rows={3}
              placeholder="عايز تحكيلنا حاجه؟"
              disabled={updateMutation.isPending}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 resize-none"
            />
          </div>

          {imagePreview && (
            <div className="relative w-fit">
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setSelectedImage(null);
                  setRemoveImage(true);

                  if (imageInputRef.current) {
                    imageInputRef.current.value = "";
                  }
                }}
                disabled={updateMutation.isPending}
                className="absolute top-1 start-1 z-10 text-white bg-slate-900/80 rounded hover:text-red-400"
                title="حذف الصورة"
              >
                <FaTimes size={20} />
              </button>

              <img
                src={imagePreview}
                alt="معاينة الصورة"
                className="w-25 h-25 mt-2 rounded object-cover"
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700/50">
            <label
              htmlFor={`edit-image-${_id}`}
              className="cursor-pointer px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-xs text-slate-300 rounded-lg transition"
              title="إضافة صورة"
            >
              <CiImageOn className="text-sm" />

              <input
                ref={imageInputRef}
                type="file"
                id={`edit-image-${_id}`}
                accept="image/*"
                className="hidden"
                disabled={updateMutation.isPending}
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setSelectedImage(file);
                    setImagePreview(URL.createObjectURL(file));
                    setRemoveImage(false);
                  }
                }}
              />
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setUpdatedBody(post.body || "");
                  setSelectedImage(null);
                  setImagePreview(image || null);
                  setRemoveImage(false);

                  if (imageInputRef.current) {
                    imageInputRef.current.value = "";
                  }
                }}
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs transition"
              >
                إلغاء
              </button>

              <button
                type="button"
                disabled={updateMutation.isPending}
                onClick={() => updateMutation.mutate()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition disabled:opacity-50"
              >
                {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التعديل"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {body}
        </p>
      )}

      {image && !isEditing && (
        <img
          src={image}
          alt="Post attachment"
          className="w-full rounded-2xl object-cover max-h-96"
        />
      )}

      {/* أزرار التفاعل والإحصائيات */}
      <div className="flex items-center justify-between border-t border-slate-700/60 pt-3 text-slate-400 text-xs">
        <button className="flex items-center gap-1.5 hover:text-red-400 transition">
          <FcLike /> {likesCount} إعجاب
        </button>
        <Link to={`/PostDetails/${_id}`}>
          <div className="flex items-center gap-1.5 hover:text-indigo-400 transition">
            <FaCommentAlt /> {commentsCount} تعليقات
          </div>
        </Link>
        <button className="flex items-center gap-1.5 hover:text-slate-200 transition">
          <FaShare /> {sharesCount} مشاركة
        </button>
      </div>

      {!AllComment && topComment && (
        <Comment comment={topComment} postId={_id} queryKey={["getAllPosts"]} />
      )}

      {AllComment &&
        data?.data.data.comments &&
        data.data.data.comments.map((comment: CommentType) => (
          <Comment
            key={comment._id}
            comment={comment}
            postId={_id}
            queryKey={["getPostComments", _id]}
          />
        ))}

      <CommentCreat
        postId={_id}
        queryKey={AllComment ? ["getPostComments", _id] : ["getAllPosts"]}
      />
    </div>
  );
}
