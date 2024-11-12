import "./PostCondensed.css";
import { Link, useOutletContext } from "react-router-dom";

const PostCondensed = ({ post }) => {
	const [_, theme] = useOutletContext();

	const date = new Date(post.created_at);

	const dateString = date.toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});

	return (
		<div className="post">
			<Link className="post-link" to={`/post/${post.id}`}>
				<h5 className="posted-time">
					Posted by{" "}
					<span className={`${theme}`}>@{post.user_id}</span> on{" "}
					{dateString}
				</h5>
				<h4 className="post-title">
					{post.title}{" "}
					<span
						className={`flair ${theme}-bg ${post.flair.toLowerCase()}`}
					>
						{post.flair}
					</span>
				</h4>
				<p className="upvotes">Upvotes: {post.upvotes}</p>
			</Link>
		</div>
	);
};

export default PostCondensed;
