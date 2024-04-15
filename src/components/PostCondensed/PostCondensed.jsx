import './PostCondensed.css'
import { Link } from 'react-router-dom'

const PostCondensed = ({post, uid}) => {

  return (
    <div className='post'>
      <Link className='post-link' to={`/post/${post.id}`}>
        <h5 className='posted-time'>Posted by @{post.uid} on {post.created_at}</h5>
        <h4 className='post-title'>{post.title} <span className={`flair ${post.flair}`}>{post.flair}</span></h4>
        <p className='upvotes'>Upvotes: {post.upvotes}</p>
      </Link>
    </div>
  )
}

export default PostCondensed