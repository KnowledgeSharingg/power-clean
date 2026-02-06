export const serverUrl = process.env.SERVER_URL || "http://localhost:8080";

export interface GetBookDetailResDto {
  id: number | null;
  title: string;
  content: string;
  link: string;
  coverImageUrl: string;
  authorInfo: string;
}

export interface GetCreatedPostByAIResDto {
  title: string;
  content: string;
  bookInfo: GetBookDetailResDto;
}

export async function getCreatedPostByAI(
  script: string
): Promise<GetCreatedPostByAIResDto> {
  const url = `${serverUrl}/post/ai?script=${encodeURIComponent(script)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: authHeadersNoContentType(),
    cache: "no-store",
  });
  await handleResponse(res);
  if (!res.ok) throw new Error("AI 자동 생성 실패");
  return await res.json();
}

export async function createPost(data: {
  title: string;
  content: string;
  creatorAccountId: string;
  bookInfo: {
    title: string;
    content: string;
    link: string;
    authorInfo: {
      name: string;
      dateOfBirth: string;
      phoneNumber: string;
      gender: string;
      history: string;
    };
  };
}) {
  try {
    const response = await fetch(`${serverUrl}/post`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    await handleResponse(response);
    return response.ok;
  } catch (error) {
    console.error("게시글 생성 오류:", error);
    return false;
  }
}

export async function getPostList(page: number = 1, size: number = 10) {
  const res = await fetch(`${serverUrl}/post/list?page=${page}&size=${size}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPostDetail(postId: string) {
  const response = await fetch(`${serverUrl}/post/${postId}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("게시글 조회 실패");
  return await response.json();
}

export async function updatePost(data: {
  id: string;
  title: string;
  content: string;
  bookInfo: {
    title: string;
    content: string;
    link: string;
    coverImageUrl: string;
    authorInfo?: {
      name: string;
      dateOfBirth: string;
      phoneNumber: string;
      gender: string;
      history: string;
    };
  };
}) {
  try {
    const response = await fetch(`${serverUrl}/post`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await handleResponse(response);
    return response.ok;
  } catch (error) {
    console.error("게시글 수정 오류:", error);
    return false;
  }
}

export async function createReview(data: {
  content: string;
  rating: number;
  postId: string;
  creatorAccountId: string;
}) {
  try {
    const response = await fetch(`${serverUrl}/review`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    await handleResponse(response);
    return response.ok;
  } catch (error) {
    console.error("리뷰 생성 오류:", error);
    return false;
  }
}

export async function getReviewsByPostId(
  postId: string,
  page: number = 0,
  size: number = 10
) {
  const res = await fetch(
    `${serverUrl}/review/list/post/${postId}?page=${page}&size=${size}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("리뷰 조회 실패");
  return await res.json();
}

export async function updateReview({
  content,
  rating,
  reviewId,
}: {
  content: string;
  rating: number;
  reviewId: string;
}) {
  const res = await fetch(`${serverUrl}/review`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ content, rating, reviewId }),
  });
  await handleResponse(res);
  return res.ok;
}

export async function deleteReview(reviewId: string) {
  const res = await fetch(`${serverUrl}/review/${reviewId}`, {
    headers: authHeaders(),
    method: "DELETE",
  });
  await handleResponse(res);
  return res.ok;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${serverUrl}/upload`, {
      method: "POST",
      // Important: do NOT set Content-Type for FormData; browser will set the correct boundary.
      headers: authHeadersNoContentType(),
      body: formData,
    });

    await handleResponse(response);
    if (!response.ok) throw new Error("이미지 업로드 실패");

    const imageUrl = await response.text(); // 서버가 String 반환 시
    return imageUrl;
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    throw error;
  }
}

// =========================
// Auth helpers & APIs
// =========================
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
}

function authHeaders(): HeadersInit {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

// Use this when sending FormData to avoid overriding Content-Type with JSON.
function authHeadersNoContentType(): HeadersInit {
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

// 중앙 응답 처리기: 401이면 로그인 페이지로 이동
async function handleResponse(res: Response) {
  if (res.status === 401) {
    try {
      setToken(null);
    } catch {}
    if (typeof window !== "undefined") {
      const current =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      const redirect = encodeURIComponent(current);
      window.location.href = `/auth?redirect=${redirect}`;
    }
    throw new Error("Unauthorized");
  }
  return res;
}

export async function signUp(data: {
  email: string;
  password: string;
  nickname: string;
}) {
  try {
    const res = await fetch(`${serverUrl}/account/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const ok = res.ok;
    if (!ok) {
      let bodyText = "";
      try {
        bodyText = await res.text();
      } catch {}
      console.error(`회원가입 실패: status=${res.status}, body=${bodyText}`);
    }
    return ok;
  } catch (e) {
    console.error("회원가입 네트워크 오류:", e);
    return false;
  }
}

export async function login(data: { email: string; password: string }) {
  try {
    const res = await fetch(`${serverUrl}/account/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      let bodyText = "";
      try {
        bodyText = await res.text();
      } catch {}
      console.error(`로그인 실패 응답: status=${res.status}, body=${bodyText}`);
      return null;
    }
    const contentType = res.headers.get("content-type") || "";
    let token: string | null = null;
    if (contentType.includes("application/json")) {
      const json = await res.json();
      token = json.accessToken || json.token || null;
    } else {
      token = await res.text();
    }
    if (token) setToken(token);
    return token;
  } catch (e) {
    console.error("로그인 네트워크 오류:", e);
    return null;
  }
}

export function logout() {
  setToken(null);
}

export async function getMyInfo() {
  try {
    const res = await fetch(`${serverUrl}/account/info`, {
      method: "GET",
      headers: authHeaders(),
      cache: "no-store",
    });
    await handleResponse(res);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("내 정보 조회 실패:", e);
    return null;
  }
}

export async function updateNickname(nickname: string) {
  try {
    const res = await fetch(`${serverUrl}/account/nickname/${nickname}`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    await handleResponse(res);
    return res.ok;
  } catch (e) {
    console.error("닉네임 수정 실패:", e);
    return false;
  }
}

// =========================
// Like APIs
// =========================
export async function likePost(postId: string): Promise<boolean> {
  try {
    const res = await fetch(`${serverUrl}/post/${postId}/like`, {
      method: "POST",
      headers: authHeaders(),
    });
    await handleResponse(res);
    return res.ok;
  } catch (e) {
    console.error("좋아요 추가 실패:", e);
    return false;
  }
}

export async function unlikePost(postId: string): Promise<boolean> {
  try {
    const res = await fetch(`${serverUrl}/post/${postId}/like`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await handleResponse(res);
    return res.ok;
  } catch (e) {
    console.error("좋아요 제거 실패:", e);
    return false;
  }
}

export async function toggleLike(
  postId: string,
  currentlyLiked: boolean
): Promise<boolean> {
  return currentlyLiked ? unlikePost(postId) : likePost(postId);
}

// =========================
// Bookmark APIs
// =========================
export async function bookmarkPost(postId: string): Promise<boolean> {
  try {
    const res = await fetch(`${serverUrl}/post/${postId}/bookmark`, {
      method: "POST",
      headers: authHeaders(),
    });
    await handleResponse(res);
    return res.ok;
  } catch (e) {
    console.error("북마크 추가 실패:", e);
    return false;
  }
}

export async function unbookmarkPost(postId: string): Promise<boolean> {
  try {
    const res = await fetch(`${serverUrl}/post/${postId}/bookmark`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await handleResponse(res);
    return res.ok;
  } catch (e) {
    console.error("북마크 제거 실패:", e);
    return false;
  }
}

export async function toggleBookmark(
  postId: string,
  currentlyBookmarked: boolean
): Promise<boolean> {
  return currentlyBookmarked ? unbookmarkPost(postId) : bookmarkPost(postId);
}

export interface Post {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  bookmarkCount: number;
  likedByMe?: boolean;
  bookmarkedByMe?: boolean;
  createdAt: string;
  bookInfo?: {
    coverImageUrl: string;
  };
}

export async function getMyBookmarks(): Promise<{ postList: Post[] }> {
  try {
    const res = await fetch(`${serverUrl}/post/bookmark/list`, {
      method: "GET",
      headers: authHeaders(),
      cache: "no-store",
    });
    await handleResponse(res);
    if (!res.ok) return { postList: [] };
    return await res.json();
  } catch (e) {
    console.error("북마크 목록 조회 실패:", e);
    return { postList: [] };
  }
}
