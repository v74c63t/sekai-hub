import { useParams } from 'react-router-dom'
import './PostDetail.css'
import { useEffect, useState } from 'react'
import { supabase } from '../../config/Client'
import { useOutletContext } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import { useNavigate } from 'react-router-dom';
import Comment from '../../components/Comment/Comment';
import ReactPlayer from 'react-player'
import data from '../../data/data.json'

const PostDetail = () => {
  const {id} = useParams()
  const [UID, theme] = useOutletContext()
  const navigate = useNavigate();

  const [post, setPost] = useState(null)

  const [comments, setComments] = useState([])

  const [userComment, setUserComment] = useState('')

  // const posts = data.posts

  useEffect(() => {
    // const res = posts.filter((post) => post.id === parseInt(id))
    // if(res.length !== 0) {
    //   setPost(res[0])
    //   setComments(res[0].comments)
    // }
    const fetchPost = async () => {
      const {data} = await supabase
                            .from('posts')
                            .select()
                            .eq('id', id)
                            .single()
      setPost(data)
    }
    const fetchPostComments = async () => {
      const {data} = await supabase
                            .from('comments')
                            .select()
                            .eq('post_id', id)
      setComments(data)
    }
    fetchPost()
    fetchPostComments()
  }, [])

  const handleSubmit = async (event) => {
    if(event.key === 'Enter') {
      if(userComment.replace(/\s/g, '') !== '') {
        setComments([...comments, {"user_id": UID, "comment": userComment}])
        await supabase
                .from('comments')
                .insert({'post_id': id, 'comment': userComment, 'user_id': UID })
                .select()
        setUserComment('')
      }
    }
  }

  const handleUpvote = async () => {
    await supabase
            .from('posts')
            .update({'upvotes': post.upvotes + 1})
            .eq('id', id)
    setPost((prev)=>({...prev, 'upvotes': post.upvotes + 1}))
  }

  const handleUpdate = () => {
    //TODO
    console.log('prompt for secret key')
    console.log('redirect to update page')
    navigate(`/update/${id}`)
  }

  const handleDelete = async() => {
    //TODO
    await supabase
            .from('posts')
            .delete()
            .eq('id', id)
    navigate('/')
    console.log('prompt for secret key')
    console.log('delete post')
  }

  return (
    <>
      {post !== null ? (
        <div className='post-detail'>
          <h4 className='timestamp'>Posted by <span className={theme}>@{post.user_id}</span> on {post.created_at}</h4>
          <h3 className='post-detail-title'>{post.title} <span className={`flair ${theme}-bg ${post.flair.toLowerCase()}`}>{post.flair}</span></h3>
          <p className='post-content'>{post.content}</p>
          {
            post.url !== "" && post.video === false ? (
              <img src={post.url} alt="post image" width={'60%'} height={'auto'} />
            )
            :
            post.url !== "" & post.video ? (
              <ReactPlayer url={post.url} controls width={'60%'} />
            ): ""
          }
          <div className='post-btns'>
            <div className="upvote-container">
              <Icon className={`${theme} upvotes-icon`} icon={"bxs:upvote"} width={'1.5rem'} height={'1.5rem'} onClick={handleUpvote}></Icon>
              <p className='post-detail-upvotes'><strong>Upvotes:</strong> {post.upvotes}</p>
            </div>
            <div className="post-update-container">
              <Icon className={`${theme} edit-icon`} icon="bxs:edit" width="1.7rem" height="1.7rem" onClick={handleUpdate} />
              <Icon className='delete-icon' icon="material-symbols:delete-outline" width="1.8rem" height="1.8rem" onClick={handleDelete} />
            </div>
          </div>
          <div className='comments-container'>
            <h4 className='comment-header'>Comments</h4>
            {
              comments.map((comment, i) => {
                return (
                  <Comment key={i} comment={comment} />
                )
              })
            }
            <input className='add-comment' type="text" placeholder='Comment...' value={userComment} onChange={(event)=>setUserComment(event.target.value)} onKeyDown={handleSubmit} />
          </div>
        </div>
      ) : ""}
    </>
  )
}

export default PostDetail