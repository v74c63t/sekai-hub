import './UpdatePost.css'
import { useOutletContext, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from "react";

const UpdatePost = () => {
  const {id} = useParams()
  const [UID] = useOutletContext()
  const [postTitle, setPostTitle] = useState('')
  const [postFlair, setPostFlair] = useState(null)
  const [postContent, setPostContent] = useState('')
  const [postURL, setPostURL] = useState('')

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
      setPostTitle(res[0].title)
      setPostFlair(res[0].flair.toLowerCase())
      setPostContent(res[0].content)
      setPostURL(res[0].url)
    }
    // const fetchPost = () => {
    //   const {data} = await supabase
    //                         .from('posts')
    //                         .select()
    //                         .eq('id', id)
    //   setPost(data)
    // }
  }, [])

  const handleUpdatePost = (event) => {
    event.preventDefault()
    console.log(postFlair)
    console.log(postTitle)
    console.log(postContent)
    console.log(postURL)
    console.log('update')
  }

  return (
    <div className="update-post-form">
      <Box
        className="form-container"
        component="form"
        // sx={{
        //   '& .MuiTextField-root': { m: 1, width: '25ch' },
        // }}
        // noValidate
        // autoComplete="off"
      >
        <div className='flair-container'>
          <h3 className='flair-header'>Post Flair:</h3>
          <h4 id='discussion' className={postFlair !== null && postFlair === 'discussion' ? 'filter-flair discussion active' : 'filter-flair discussion'} onClick={() => setPostFlair('discussion')}>Discussion</h4>
          <h4 id='achievements' className={postFlair !== null && postFlair === 'achievements' ? 'filter-flair achievements active' : 'filter-flair achievements'} onClick={() => setPostFlair('achievements')}>Achievements</h4>
          <h4 id='question' className={postFlair !== null && postFlair === 'question' ? 'filter-flair question active' : 'filter-flair question'} onClick={() => setPostFlair('question')}>Question</h4>
          <h4 id='gameplay' className={postFlair !== null && postFlair === 'gameplay' ? 'filter-flair gameplay active' : 'filter-flair gameplay'} onClick={() => setPostFlair('gameplay')}>Gameplay</h4>
        </div>
        <TextField className="form-text-field" placeholder={'Title'} value={postTitle} onChange={(event)=>setPostTitle(event.target.value)} />
        <TextField 
          className="form-text-field" 
          multiline
          rows={15}
          placeholder={'Content (Optional)'}
          value={postContent}
          onChange={(event)=>setPostContent(event.target.value)} />
        <TextField className="form-text-field" placeholder={'Image URL (Optional)'} value={postURL} onChange={(event)=>setPostURL(event.target.value)} />
        <button className="update-post-btn" type="submit" onClick={handleUpdatePost}>Update Post</button>
      </Box>
    </div>
  )
}

export default UpdatePost