// export interface PostType {
//   _id: string;
//   body: string;
//   image: string;
//   privacy: "public" | "private" | "friends" | string;
//   user: {
//     _id: string;
//     name: string;
//     username: string;
//     photo: string;
//   };
//   sharedPost: PostType | null;
//   likes: string[];
//   createdAt: string;
//   commentsCount: number;
//   topComment: Comment | null;
//   sharesCount: number;
//   likesCount: number;
//   isShare: boolean;
//   id: string;
//   bookmarked: boolean;
// }

// export interface user {
//   _id?: string;
//   body?: string;
//   user?: {
//     _id: string;
//     name: string;
//     username: string;
//     photo: string;
//   };
//   createdAt?: string;
// }

// تعريف واجهة المنشور (PostType)
export interface PostType {
  _id: string;
  body: string;
  image: string;
  privacy: "public" | "private" | "friends" | string;
  user: {
    _id: string;
    name: string;
    username: string;
    photo: string;
  };
  sharedPost: PostType | null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: Comment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}
