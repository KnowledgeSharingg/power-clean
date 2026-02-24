"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/useAuth";
import { updateNickname } from "@/lib/api";
import MaterialIcon from "@/app/components/MaterialIcon";

export default function MyPage() {
  const router = useRouter();
  const { me, loading, logout, isLoggedIn } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isLoggedIn || !me) {
    router.push("/auth?redirect=/mypage");
    return null;
  }

  const handleEditStart = () => {
    setNewNickname(me.nickname);
    setIsEditing(true);
    setMessage(null);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setNewNickname("");
    setMessage(null);
  };

  const handleSave = async () => {
    const trimmed = newNickname.trim();
    if (!trimmed) {
      setMessage({ type: "error", text: "닉네임을 입력해주세요." });
      return;
    }
    if (trimmed === me.nickname) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    setMessage(null);
    const success = await updateNickname(trimmed);
    setSaving(false);

    if (success) {
      setMessage({ type: "success", text: "닉네임이 변경되었습니다." });
      setIsEditing(false);
      // useAuth가 window focus 시 자동 refetch하므로, 강제로 focus 이벤트 발생
      window.dispatchEvent(new Event("focus"));
    } else {
      setMessage({ type: "error", text: "닉네임 변경에 실패했습니다." });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleEditCancel();
  };

  const joinDate = me.createdAt
    ? new Date(me.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="site-container py-8">
        <h1 className="text-2xl font-bold text-primary mb-8">My Page</h1>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="card-padded">
            {/* Avatar + Name */}
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                {(me.nickname || "U").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold truncate">{me.nickname}</h2>
                <p className="text-sm text-text-secondary">{me.email}</p>
              </div>
            </div>

            {/* Info Fields */}
            <div className="space-y-4">
              {/* Nickname */}
              <div className="flex items-start justify-between gap-4 py-3 border-t border-border">
                <div className="min-w-0 flex-1">
                  <label className="block text-xs font-medium uppercase tracking-wider text-text-secondary mb-1">
                    Nickname
                  </label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="flex-1 h-10 px-3 text-sm"
                        placeholder="새 닉네임 입력"
                        maxLength={20}
                      />
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary text-xs px-4 py-2 disabled:opacity-50"
                      >
                        {saving ? "저장 중..." : "저장"}
                      </button>
                      <button
                        onClick={handleEditCancel}
                        disabled={saving}
                        className="btn text-xs px-4 py-2"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-base">{me.nickname}</span>
                      <button
                        onClick={handleEditStart}
                        className="text-text-secondary hover:text-primary transition-colors"
                        title="닉네임 수정"
                      >
                        <MaterialIcon name="edit" size="sm" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="py-3 border-t border-border">
                <label className="block text-xs font-medium uppercase tracking-wider text-text-secondary mb-1">
                  Email
                </label>
                <span className="text-base">{me.email}</span>
              </div>

              {/* Join Date */}
              {joinDate && (
                <div className="py-3 border-t border-border">
                  <label className="block text-xs font-medium uppercase tracking-wider text-text-secondary mb-1">
                    Joined
                  </label>
                  <span className="text-base">{joinDate}</span>
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div
                className={`mt-4 text-sm px-4 py-2.5 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="card-padded">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
              Account
            </h3>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="btn text-sm text-red-500 border-red-200 hover:bg-red-50 gap-2"
            >
              <MaterialIcon name="logout" size="sm" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
