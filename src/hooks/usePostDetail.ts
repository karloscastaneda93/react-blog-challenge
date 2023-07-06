import { Post } from "../types/Post";
import { User } from "../types/User";
import { usePostById, useUserById } from "../services/api";

interface PostDetail {
	postData?: Post;
	postLoading: boolean;
	postError?: Error;
	userData?: User;
	userLoading: boolean;
	userError?: Error;
}

export const usePostDetail = (postId: string): PostDetail => {
	const {
		data: postData,
		isLoading: postLoading,
		error: postErrorUnkown,
	} = usePostById(postId || "");

	const postError =
		postErrorUnkown instanceof Error ? postErrorUnkown : undefined;

	const userId = postData?.userId.toString();

	const {
		data: userData,
		isLoading: userLoading,
		error: userErrorUnknown,
	} = useUserById(userId || "");

	const userError =
		userErrorUnknown instanceof Error ? userErrorUnknown : undefined;

	return {
		postData,
		postLoading,
		postError,
		userData,
		userLoading,
		userError,
	};
};
