import { useContext, useState } from "react";
import type { ChangeEvent } from "react";
import type { CommentType } from "../../Types/comment.type";
import { AuthContext } from "../../context/AuthContext";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { FaRegSave } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CommentProps = {
  comment: CommentType;
  postId: string;
  queryKey: string[];
};

export default function Comment({ comment, postId, queryKey }: CommentProps) {
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const isOwner = userData?._id === comment.commentCreator?._id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content ?? "");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const token = localStorage.getItem("userToken");

  // Update comment
  const updateCommentMutation = useMutation({
    mutationFn: async () => {
      const content = editContent.trim();
      const formData = new FormData();

      if (content) {
        formData.append("content", content);
      }

      if (editImage) {
        formData.append("image", editImage);
      }

      return axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: () => {
      toast.success("Comment updated successfully");
      setIsEditing(false);
      setEditImage(null);
      setPreviewImage(null);
      queryClient.invalidateQueries({ queryKey });
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update comment",
        );
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  // Delete comment
  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      return axios.delete(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: () => {
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey });
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete comment",
        );
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setEditImage(file);
    setPreviewImage(URL.createObjectURL(file));
  }

  function handleCancelEdit() {
    setEditContent(comment.content ?? "");
    setEditImage(null);
    setPreviewImage(null);
    setIsEditing(false);
  }

  function handleUpdate() {
    if (!editContent.trim() && !editImage && !comment.image) {
      toast.error("Please enter a comment or choose an image");
      return;
    }

    if (!editContent.trim() && !comment.image && editImage) {
      // Image-only comment is allowed by this frontend.
      updateCommentMutation.mutate();
      return;
    }

    if (editContent.trim().length === 1) {
      toast.error("Comment must contain at least 2 characters");
      return;
    }

    updateCommentMutation.mutate();
  }

  return (
    <div className="border-t border-slate-700/60 pt-3 mt-3">
      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 space-y-2">
        {/* Comment owner and date */}
        <div className="flex items-center gap-2.5">
          {comment.commentCreator?.photo ? (
            <img
              src={comment.commentCreator.photo}
              alt={comment.commentCreator.name}
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">
              {comment.commentCreator?.name?.[0] || "U"}
            </div>
          )}

          <div className="flex-1 flex items-center justify-between gap-2">
            <h4 className="text-xs font-semibold text-slate-200">
              {comment.commentCreator?.name}
            </h4>

            <span className="text-[10px] text-slate-400">
              {new Date(comment.createdAt).toLocaleDateString("ar-EG", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Edit form or comment text */}
        {isEditing ? (
          <div className="pr-10 space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Write your comment..."
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-sm text-white outline-none focus:border-indigo-500"
            />

            {/* Current image or new image preview */}
            {(previewImage || comment.image) && (
              <img
                src={previewImage || comment.image}
                alt="Comment preview"
                className="max-h-48 w-auto rounded-lg object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-xs text-slate-300 file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white"
            />

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={updateCommentMutation.isPending}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                <FaRegSave />
                {updateCommentMutation.isPending ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={updateCommentMutation.isPending}
                className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs text-white transition hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {comment.content && (
              <p className="text-xs text-slate-300 pr-10 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            )}

            {comment.image && (
              <img
                src={comment.image}
                alt="Comment attachment"
                className="max-h-64 w-auto rounded-lg object-cover"
              />
            )}
          </>
        )}

        {/* Edit and delete buttons: comment owner only */}
        {isOwner && !isEditing && (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={deleteCommentMutation.isPending}
              className="text-indigo-400 transition hover:text-indigo-300 disabled:opacity-50"
              aria-label="Edit comment"
              title="Edit comment"
            >
              <FaRegEdit />
            </button>

            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this comment?",
                  )
                ) {
                  deleteCommentMutation.mutate();
                }
              }}
              disabled={deleteCommentMutation.isPending}
              className="text-red-400 transition hover:text-red-300 disabled:opacity-50"
              aria-label="Delete comment"
              title="Delete comment"
            >
              <FaRegTrashAlt />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
