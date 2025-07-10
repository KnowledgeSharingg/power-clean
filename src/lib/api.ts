export const serverUrl = process.env.SERVER_URL || "http://localhost:8080";

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (error) {
    console.error("게시글 생성 오류:", error);
    return false;
  }
}

export async function getPostList(page: number = 1, size: number = 10) {
  const res = await fetch(`${serverUrl}/post/list?page=${page}&size=${size}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPostDetail(postId: string) {
  const response = await fetch(`${serverUrl}/post/${postId}`);
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, rating, reviewId }),
  });
  return res.ok;
}

export async function deleteReview(reviewId: string) {
  const res = await fetch(`${serverUrl}/review/${reviewId}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${serverUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("이미지 업로드 실패");

    const imageUrl = await response.text(); // 서버가 String 반환 시
    return imageUrl;
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    throw error;
  }
}
