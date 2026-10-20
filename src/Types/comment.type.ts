// تعريف بيانات صانع التعليق/المستخدم
export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

// تعريف واجهة التعليق (Comment)
export interface CommentType {
  _id: string;
  image: string;
  commentCreator: CommentCreator;
  content: string;
  createdAt: string;
  likes?: string[];
  parentComment?: string | null;
  post?: string;
}
