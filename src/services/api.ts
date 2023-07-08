import axios from "axios";
import { useQuery } from "react-query";

import { Post, PostListTypes, User, CommentListTypes } from "../types";
import { POSTS_NUMBER } from "../constants";

const API_BASE_URL = "https://dummyjson.com";

const staleTime = 1000 * 60; // 1 minute

export function useCommentsByPostId(
	id: string,
	page: number,
	pageSize: number,
) {
	return useQuery<CommentListTypes>(
		["comment", id, page],
		() => fetchCommentById(id, page, pageSize),
		{ staleTime },
	);
}

export function usePosts(page: number, searchValue = "") {
	return useQuery<PostListTypes>(
		["post", page, searchValue],
		() => fetchPosts(page, searchValue),
		{
			staleTime,
		},
	);
}

export function usePostById(id: string) {
	return useQuery<Post>(["post", id], () => fetchPostById(id), { staleTime });
}

export function useUserById(id: string) {
	return useQuery<User>(["user", id], () => fetchUserById(id), { staleTime });
}

async function fetchPosts(
	page: number,
	searchValue: string,
): Promise<PostListTypes> {
	const skip = page > 1 ? (page - 1) * POSTS_NUMBER : 0;
	let url = `${API_BASE_URL}/posts?limit=${POSTS_NUMBER}&skip=${skip}`;

	if (searchValue) {
		url = `${API_BASE_URL}/posts/search?q=${encodeURIComponent(
			searchValue,
		)}&limit=${POSTS_NUMBER}&skip=${skip}`;
	}

	const response = await axios.get(url);
	return response.data;
}
async function fetchPostById(id: string): Promise<Post> {
	const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
	return response.data;
}

async function fetchUserById(id: string): Promise<User> {
	const response = await axios.get(`${API_BASE_URL}/users/${id}`);
	return response.data;
}

async function fetchCommentById(id: string, page: number, pageSize: number) {
	const skip = page > 1 ? (page - 1) * pageSize : 0;
	const response = await axios.get(
		`${API_BASE_URL}/comments/post/${id}?limit=${pageSize}&skip=${skip}`,
	);
	return response.data;
}

export async function addComment(body: string, postId: number, userId: number) {
	const response = await axios.post(`${API_BASE_URL}/comments/add`, {
		body,
		postId,
		userId,
	});
	return response.data;
}
