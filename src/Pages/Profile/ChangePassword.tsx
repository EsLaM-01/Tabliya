import { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
  const [showForm, setShowForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (newPassword !== rePassword) {
      setIsSuccess(false);
      setMessage("كلمتا المرور الجديدتان غير متطابقتين.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        {
          password: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        },
      );

      setIsSuccess(true);
      setMessage(response.data.message || "تم تغيير كلمة المرور بنجاح.");

      setCurrentPassword("");
      setNewPassword("");
      setRePassword("");
      setShowForm(false);
    } catch (err: unknown) {
      setIsSuccess(false);

      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "تعذر تغيير كلمة المرور.");
      } else {
        setMessage("حدث خطأ غير متوقع.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">كلمة المرور</h2>
          <p className="text-sm text-slate-400 mt-1">تغيير كلمة السر</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm(!showForm);
            setMessage("");
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition"
        >
          {showForm ? "إلغاء" : "تغيير"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
          <input
            type="password"
            autoComplete="current-password"
            placeholder="كلمة المرور الحالية"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            autoComplete="new-password"
            placeholder="كلمة المرور الجديدة"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            autoComplete="new-password"
            placeholder="تأكيد كلمة المرور الجديدة"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl p-3 transition"
          >
            {isLoading ? "جارٍ التغيير..." : "حفظ كلمة المرور الجديدة"}
          </button>
        </form>
      )}

      {message && (
        <p
          role="status"
          className={`mt-4 text-sm ${
            isSuccess ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
