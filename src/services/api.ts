import axios from 'axios';
import { useQuery } from 'react-query';
import { Post, PostListTypes, User, CommentListTypes } from '../types';

const API_BASE_URL = 'https://dummyjson.com';

const staleTime = 1000 * 60; // 1 minute

export function useCommentsByPostId(id: string) {
    return useQuery<CommentListTypes>(
        ['comment', id],
        () => fetchCommentById(id),
        { staleTime }
    );
}

export function usePosts(page: number, searchValue: string = '') {
    return useQuery<PostListTypes>(
        ['post', page, searchValue],
        () => fetchPosts(page, searchValue),
        {
            staleTime,
        }
    );
}

export function usePostById(id: string) {
    return useQuery<Post>(['post', id], () => fetchPostById(id), { staleTime });
}

export function useUserById(id: string) {
    return useQuery<User>(['user', id], () => fetchUserById(id), { staleTime });
}

async function fetchPosts(
    page: number,
    searchValue: string
): Promise<PostListTypes> {
    try {
        const limit = 30; // Number of items per page
        const skip = page > 1 ? (page - 1) * limit : 0;
        let url = `${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`;

        if (searchValue) {
            url = `${API_BASE_URL}/posts/search?q=${encodeURIComponent(
                searchValue
            )}&limit=${limit}&skip=${skip}`;
        }

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function fetchPostById(id: string): Promise<Post> {
    try {
        const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function fetchUserById(id: string): Promise<User> {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function fetchCommentById(id: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/comments/post/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// export async function createComment(comment: Comment): Promise<Comment> {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/comments`, comment);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// }
