import { useParams } from 'react-router-dom'
import './PostDetail.css'
import { useEffect, useState } from 'react'
import { supabase } from '../../config/Client'
import { useOutletContext } from "react-router-dom";

const PostDetail = () => {
  const {id} = useParams()
  const [UID] = useOutletContext()

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
      "comments": ["America!!!"],
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
      "comments": ["Very true", "Haha!"],
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
      "comments": ["It's gotta be George Washington!", "Did you forget about Ben Franklin?"],
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
        setComments([...comments, userComment])
        // const {data} = await supabase
        //                       .from('comments')
        //                       .insert({'post_id': id, 'comment': userComment, 'user_id': UID })
        //                       .select()
        setUserComment('')
      }
    }
  }

  return (
    <>
      {post !== null ? (
        <div className='post-detail'>
          <div>Posted by <span>@{post.uid}</span> on {post.created_at}</div>
          <div>{post.title} <span>{post.flair}</span></div>
          <div>{post.content}</div>
          {post.url !== "" ? <img src={post.url} alt="" /> : ""}
          <div>Upvotes: {post.upvotes}</div>
          <div>Comments</div>
          {
            comments.map((comment, i) => {
              return (
                <div key={i}>{comment}</div>
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