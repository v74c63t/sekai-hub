import './PostCondensed.css'
import { Link, useOutletContext } from 'react-router-dom'

const PostCondensed = ({post}) => {

  const [_, theme] = useOutletContext()

  return (
    <div className='post'>
      <Link className='post-link' to={`/post/${post.id}`}>
        <h5 className='posted-time'>Posted by <span className={`${theme}`}>@{post.uid}</span> on {post.created_at}</h5>
        <h4 className='post-title'>{post.title} <span className={`flair ${theme}-bg ${post.flair.toLowerCase()}`}>{post.flair}</span></h4>
        <p className='upvotes'>Upvotes: {post.upvotes}</p>
      </Link>
    </div>
  )
}

export default PostCondensed