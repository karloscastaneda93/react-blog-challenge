import React from "react";
import Skeleton from "react-loading-skeleton";

interface PostItemSkeletonProps {
	cards: number;
}

const PostItemSkeleton: React.FC<PostItemSkeletonProps> = ({ cards }) => {
	return (
		<div className="columns is-multiline">
			{Array(cards)
				.fill(0)
				.map((_, i) => (
					<div key={i} className="column is-half">
						<div className="card">
							<div className="card-content">
								<Skeleton height={30} />
								<div className="is-flex is-align-items-start">
									<Skeleton
										height={30}
										width={80}
										className="mr-2"
									/>
									<Skeleton height={30} width={80} />
								</div>
								<Skeleton count={2} />
								<div className="is-flex is-align-items-center is-justify-content-space-between">
									<Skeleton circle height={20} width={20} />
									<Skeleton
										className="reactions ml-1"
										width={30}
									/>
								</div>
							</div>
						</div>
					</div>
				))}
		</div>
	);
};

export default PostItemSkeleton;
