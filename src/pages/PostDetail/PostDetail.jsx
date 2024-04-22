import { useParams } from 'react-router-dom'
import './PostDetail.css'
import { useEffect, useState } from 'react'
import { supabase } from '../../config/Client'
import { useOutletContext } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import { useNavigate } from 'react-router-dom';
import Comment from '../../components/Comment/Comment';

const PostDetail = () => {
  const {id} = useParams()
  const [UID, theme] = useOutletContext()
  const navigate = useNavigate();

  const [post, setPost] = useState(null)

  const [comments, setComments] = useState([])

  const [userComment, setUserComment] = useState('')

  const posts = [
    {
      "id": 65,
      "created_at": "2023-04-10 04:45:54.471979+00",
      "title": "Who is your favorite character?",
      "content": "Mine is Kohane!",
      "url": "https://static.miraheze.org/projectsekaiwiki/c/c6/Kohane_22_art.png",
      "upvotes": 3,
      "comments": [{"user_id": "tw-dl3nCe_6t", "comment": "Mizuki!!!"}],
      "flair": "Discussion",
      "uid": "8YF1ziS3PUPW"
    },
    {
      "id": 73,
      "created_at": "2023-04-10 09:20:57.187388+00",
      "title": "FC",
      "content": "This took forever",
      "url": "",
      "upvotes": 23,
      "comments": [{"user_id": "8YF1ziS3PUPW", "comment": "Congrats!"}, {"user_id": "kOdN4Ns53PP9", "comment": "Good job!"}],
      "flair": "Achievements",
      "uid": "tw-dl3nCe_6t"
    },
    {
      "id": 87,
      "created_at": "2023-04-14 23:53:31.127016+00",
      "title": "Broken Game UI",
      "content": "UI suddenly got messed up. How can I fix it?",
      "url": "https://i.imgur.com/0QpthJU.jpg",
      "upvotes": 3,
      "comments": [{"user_id": "8YF1ziS3PUPW", "comment": "Just restart the game and it should be fine"}, {"user_id": "tw-dl3nCe_6t", "comment": "I hate when it does that"}],
      "flair": "Question",
      "uid": "kOdN4Ns53PP9"
    },
    {
      "id": 59,
      "created_at": "2023-04-08 01:19:55.739826+00",
      "title": "I hate this game",
      "content": ":D",
      "url": "https://i.imgur.com/wzk9rEB.jpg",
      "upvotes": 2,
      "comments": [{"user_id": "kOdN4Ns53PP9", "comment": "oof"}],
      "flair": "Gameplay",
      "uid": "mwlNu_9-TGK0"
    }
  ]

  useEffect(() => {
    const res = posts.filter((post) => post.id === parseInt(id))
    if(res.length !== 0) {
      setPost(res[0])
      setComments(res[0].comments)
    }
    // const fetchPost = () => {
    //   const {data} = await supabase
    //                         .from('posts')
    //                         .select()
    //                         .eq('id', id)
    //   setPost(data)
    // }
    // const fetchPostComments = () => {
    //   const {data} = await supabase
    //                         .from('comments')
    //                         .select()
    //                         .eq('post_id', id)
    //   setComments(data)
    // }
  }, [])

  const handleSubmit = (event) => {
    if(event.key === 'Enter') {
      if(userComment.replace(/\s/g, '') !== '') {
        setComments([...comments, {"user_id": UID, "comment": userComment}])
        // const {data} = await supabase
        //                       .from('comments')
        //                       .insert({'post_id': id, 'comment': userComment, 'user_id': UID })
        //                       .select()
        setUserComment('')
      }
    }
  }

  const handleUpvote = () => {
    // await supabase
    //         .from('posts')
    //         .update({'upvotes': posts.upvotes + 1})
    //         .eq('id', id)
    setPost((prev)=>({...prev, 'upvotes': post.upvotes + 1}))
  }

  const handleUpdate = () => {
    //TODO
    console.log('prompt for secret key')
    console.log('redirect to update page')
    navigate(`/update/${id}`)
  }

  const handleDelete = () => {
    //TODO
    console.log('prompt for secret key')
    console.log('delete post')
  }

  return (
    <>
      {post !== null ? (
        <div className='post-detail'>
          <h4 className='timestamp'>Posted by <span className={theme}>@{post.uid}</span> on {post.created_at}</h4>
          <h3 className='post-detail-title'>{post.title} <span className={`flair ${theme}-bg ${post.flair.toLowerCase()}`}>{post.flair}</span></h3>
          <p className='post-content'>{post.content}</p>
          {post.url !== "" ? <img src={post.url} alt="post image" width={'55%'} height={'auto'} /> : ""}
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