import { useOutletContext, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './CreatePost.css'
import { useState, useEffect } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import 'ldrs/dotSpinner'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const CreatePost = () => {
  const [UID, theme] = useOutletContext()
  const navigate = useNavigate()
  const [postTitle, setPostTitle] = useState('')
  const [postFlair, setPostFlair] = useState(null)
  const [postContent, setPostContent] = useState('')
  const [postURL, setPostURL] = useState('')
  const [postID, setPostID] = useState(0)

  const [loading, setLoading] = useState(false)

  const [open, setOpen] = useState(false)

  const [tabVal, setTabVal] = useState('1')

  const handleChange = (event, newValue) => {
    setTabVal(newValue);
  };

  const handleCreatePost = (event) => {
    event.preventDefault()
    setLoading(true)
    setOpen(true)
    console.log(postFlair)
    console.log(postTitle)
    console.log(postContent)
    console.log(postURL)
    console.log('create')
    setLoading(false)
  }

  const handleClose = () => {
    setOpen(false)
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
          <h4 id='discussion' className={postFlair !== null && postFlair === 'discussion' ? `filter-flair ${theme}-bg discussion active` : `filter-flair ${theme}-bg discussion`} onClick={() => setPostFlair('discussion')}>Discussion</h4>
          <h4 id='achievements' className={postFlair !== null && postFlair === 'achievements' ? `filter-flair ${theme}-bg achievements active` : `filter-flair ${theme}-bg achievements`} onClick={() => setPostFlair('achievements')}>Achievements</h4>
          <h4 id='question' className={postFlair !== null && postFlair === 'question' ? `filter-flair ${theme}-bg question active` : `filter-flair ${theme}-bg question`} onClick={() => setPostFlair('question')}>Question</h4>
          <h4 id='gameplay' className={postFlair !== null && postFlair === 'gameplay' ? `filter-flair ${theme}-bg gameplay active` : `filter-flair ${theme}-bg gameplay`} onClick={() => setPostFlair('gameplay')}>Gameplay</h4>
        </div>
        <TextField className="form-text-field" placeholder={'Title'} value={postTitle} onChange={(event)=>setPostTitle(event.target.value)} />
        <TextField 
          className="form-text-field" 
          multiline
          rows={15}
          placeholder={'Content (Optional)'}
          value={postContent}
          onChange={(event)=>setPostContent(event.target.value)} />
        {/* <TextField className="form-text-field" placeholder={'Image URL (Optional)'} value={postURL} onChange={(event)=>setPostURL(event.target.value)} /> */}
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={tabVal}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                <Tab label="Image" value="1" />
                <Tab label="Video" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <TextField className="form-text-field" placeholder={'URL (Optional)'} value={postURL} onChange={(event)=>setPostURL(event.target.value)} />
            </TabPanel>
            <TabPanel value="2">
              <TextField className="form-text-field" placeholder={'YouTube URL (Optional)'} value={postURL} onChange={(event)=>setPostURL(event.target.value)} />
            </TabPanel>
          </TabContext>
        </Box>
        <button className={`${theme}-bg create-post-btn`} type="submit" onClick={handleCreatePost}>Create Post</button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth='xs'
        >
          {loading ? (
            <>
              <DialogTitle id="alert-dialog-title" className="dialog-title-loading">
                Loading
              </DialogTitle>
              <DialogContent>
                <div className="spinner-container">
                  <l-dot-spinner
                    size="50"
                    speed="0.9"
                    color={'gray'}
                  ></l-dot-spinner>
                </div>
              </DialogContent>
              {/* <DialogActions className="dialog-actions">
                <div className="dialog-btns-container">
                  <div className="dialog-btns" onClick={()=>navigate('/')}>Back to Home</div>
                  <div className="dialog-btns" onClick={()=>navigate(`/post/${postID}`)}>View Post</div>
                </div>
              </DialogActions> */}
            </>
          ):
          (
            <>
              <DialogTitle id="alert-dialog-title" className="dialog-title">
                Success!
              </DialogTitle>
              <DialogContent dividers>
                <DialogContentText id="alert-dialog-description" className="dialog-content">
                  Post was created successfully! View the newly created post or return home.
                </DialogContentText>
              </DialogContent>
              <DialogActions className="dialog-actions">
                <div className="dialog-btns-container">
                  <div className={`${theme}-bg dialog-btns`} onClick={()=>navigate('/')}>Back to Home</div>
                  <div className={`${theme}-bg dialog-btns`} onClick={()=>navigate(`/post/${postID}`)}>View Post</div>
                </div>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </div>
  )
}

export default CreatePost