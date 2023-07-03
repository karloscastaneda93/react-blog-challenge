interface User {
    id: number;
    username: string;
}
export interface Comment {
    user: User;
    id: number;
    body: string;
    postId: number;
}

export interface CommentListTypes {
    comments: Comment[];
    total: number;
    skip: number;
    limit: number;
}
