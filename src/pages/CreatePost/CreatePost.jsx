import { useOutletContext } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './CreatePost.css'
import { useState } from "react";

const CreatePost = () => {
  const [UID] = useOutletContext()
  const [postTitle, setPostTitle] = useState('')
  const [postFlair, setPostFlair] = useState(null)
  const [postContent, setPostContent] = useState('')
  const [postURL, setPostURL] = useState('')

  const handleCreatePost = (event) => {
    event.preventDefault()
    console.log(postTitle)
    console.log(postContent)
    console.log(postURL)
    console.log('create')
  }

  return (
    <div className="create-post-form">
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
        <button className="create-post-btn" type="submit" onClick={handleCreatePost}>Create Post</button>
      </Box>
    </div>
  )
}

export default CreatePost