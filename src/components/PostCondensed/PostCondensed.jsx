import './PostCondensed.css'

const PostCondensed = ({post}) => {
  return (
    <div className='post'>
      <h5 className='posted-time'>Posted on {post.created_at}</h5>
      <h4 className='post-title'>{post.title}</h4>
      <p className='upvotes'>Upvotes: {post.upvotes}</p>
    </div>
  )
}

export default PostCondensed