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
      "title": "Which is better? American Revolution or French Revolution?",
      "content": "",
      "url": "",
      "upvotes": 3,
      "comments": [{"user_id": "tw-dl3nCe_6t", "comment": "America!!!"}],
      "flair": "Discussion",
      "uid": "8YF1ziS3PUPW"
    },
    {
      "id": 73,
      "created_at": "2023-04-10 09:20:57.187388+00",
      "title": "I'm obsessed with the Holy Roman Empire",
      "content": "It's holy, Roman, and an empire",
      "url": "",
      "upvotes": 23,
      "comments": [{"user_id": "8YF1ziS3PUPW", "comment": "Very true"}, {"user_id": "kOdN4Ns53PP9", "comment": "Haha!"}],
      "flair": "Achievements",
      "uid": "tw-dl3nCe_6t"
    },
    {
      "id": 87,
      "created_at": "2023-04-14 23:53:31.127016+00",
      "title": "Who is your favorite Founding Father?",
      "content": "Mine is Thomas Jefferson! What about you?",
      "url": "https://i.imgur.com/0QpthJU.jpg",
      "upvotes": 3,
      "comments": [{"user_id": "8YF1ziS3PUPW", "comment": "It's gotta be George Washington!"}, {"user_id": "tw-dl3nCe_6t", "comment": "Did you forget about Ben Franklin?"}],
      "flair": "Question",
      "uid": "kOdN4Ns53PP9"
    },
    {
      "id": 59,
      "created_at": "2023-04-08 01:19:55.739826+00",
      "title": "I love history!",
      "content": "",
      "url": "https://i.imgur.com/wzk9rEB.jpg",
      "upvotes": 2,
      "comments": [],
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
          <div>Posted by <span>@{post.uid}</span> on {post.created_at}</div>
          <div>{post.title} <span>{post.flair}</span></div>
          <div>{post.content}</div>
          {post.url !== "" ? <img src={post.url} alt="" /> : ""}
          <div className='post-btns'>
            <div className="upvote-container">
              <Icon className={`${theme} upvotes-icon`} icon={"bxs:upvote"} width={'1.5rem'} height={'1.5rem'} onClick={handleUpvote}></Icon>
              <div><strong>Upvotes:</strong> {post.upvotes}</div>
            </div>
            <div className="post-update-container">
              <Icon className={theme} icon="bxs:edit" width="1.7rem" height="1.7rem" onClick={handleUpdate} />
              <Icon className='delete-icon' icon="material-symbols:delete-outline" width="1.8rem" height="1.8rem" onClick={handleDelete} />
            </div>
          </div>
          <div>Comments</div>
          {
            comments.map((comment, i) => {
              return (
                <Comment key={i} comment={comment} />
              )
            })
          }
          <input type="text" placeholder='Comment...' value={userComment} onChange={(event)=>setUserComment(event.target.value)} onKeyDown={handleSubmit} />
        </div>
      ) : ""}
    </>
  )
}

export default PostDetail