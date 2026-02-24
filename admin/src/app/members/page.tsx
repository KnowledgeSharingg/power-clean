"use client";

import AdminLayout from "@/components/AdminLayout";
import Header from "@/components/Header";

export default function MembersPage() {
  return (
    <AdminLayout>
      <Header title="회원관리" />
      <div className="p-8 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center py-12">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              회원 목록
            </h3>
            <p className="text-gray-500 mb-4">
              회원 목록 API 연동 예정
            </p>
            <p className="text-sm text-gray-400">
              현재 서버에 관리자용 회원 목록 조회 API가 준비되지 않았습니다.
              <br />
              API가 추가되면 이 페이지에서 회원 목록을 확인할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Placeholder table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">
                  이메일
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">
                  닉네임
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">
                  가입일
                </th>
                <th className="text-center px-4 py-3 text-gray-600 font-medium">
                  작업
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  데이터 없음 — API 연동 후 표시됩니다
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
