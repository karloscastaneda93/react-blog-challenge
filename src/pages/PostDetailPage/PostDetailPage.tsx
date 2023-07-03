import React, { Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    usePostById,
    useUserById,
    useCommentsByPostId,
} from '../../services/api';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

import './PostDetailPage.css';

const PostDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        data: postData,
        isLoading: postLoading,
        error: postError,
    } = usePostById(id || '');
    const {
        data: userData,
        isLoading: userLoading,
        error: userError,
    } = useUserById(
        postData && postData.userId ? postData.userId.toString() : ''
    );
    const { data: commentsData } = useCommentsByPostId(id || '');

    return (
        <section className="section">
            <div className="btn container">
                <button className="button go-back" onClick={() => navigate(-1)}>
                    <span className="icon">
                        <i className="fas fa-arrow-left"></i>
                    </span>
                    <span>Go Back</span>
                </button>
            </div>
            <div className="container">
                {postLoading || userLoading ? (
                    <Loading />
                ) : postError || userError ? (
                    <Error error={postError || userError} />
                ) : (
                    <>
                        <h1 className="title">{postData && postData.title}</h1>
                        <p className="mb-3">
                            Author:{' '}
                            {userData &&
                                `${userData.firstName} ${userData.lastName}`}
                        </p>
                        <div className="content">
                            {postData && postData.body}
                        </div>
                        {commentsData && commentsData.comments.length ? (
                            commentsData.comments.map((comment) => (
                                <Fragment key={comment.id}>
                                    <h2 className="mb-3">Comments:</h2>
                                    <article className="message">
                                        <div className="message-body">
                                            <div className="is-flex is-align-items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="icon is-medium"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                                    />
                                                </svg>

                                                {comment.user.username}
                                            </div>
                                            <br />
                                            {comment.body}
                                        </div>
                                    </article>
                                </Fragment>
                            ))
                        ) : (
                            <div>There are no comments on this post.</div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default PostDetailPage;
