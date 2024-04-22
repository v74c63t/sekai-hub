import './UpdatePost.css'
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReactPlayer from 'react-player'


const UpdatePost = () => {
  const {id} = useParams()
  const [UID, theme] = useOutletContext()
  const navigate = useNavigate()
  const [postTitle, setPostTitle] = useState('')
  const [postFlair, setPostFlair] = useState(null)
  const [postContent, setPostContent] = useState('')
  const [postURL, setPostURL] = useState('')

  const [loading, setLoading] = useState(false)

  const [open, setOpen] = useState(false)

  const [tabVal, setTabVal] = useState('1')

  const handleChange = (event, newValue) => {
    setTabVal(newValue);
  };

  const [urlType, setURLType] = useState('image');
  
  const handleSelectChange = (event) => {
    setURLType(event.target.value);
  };

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
    setLoading(true)
    setOpen(true)
    console.log(postFlair)
    console.log(postTitle)
    console.log(postContent)
    console.log(postURL)
    console.log('update')
    setLoading(false)
  }

  const handleClose = () => {
    setOpen(false)
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
          <h4 id='discussion' className={postFlair !== null && postFlair === 'discussion' ? `filter-flair ${theme}-bg discussion active` : `filter-flair ${theme}-bg discussion`} onClick={() => setPostFlair('discussion')}>Discussion</h4>
          <h4 id='achievements' className={postFlair !== null && postFlair === 'achievements' ? `filter-flair ${theme}-bg achievements active` : `filter-flair ${theme}-bg achievements`} onClick={() => setPostFlair('achievements')}>Achievements</h4>
          <h4 id='question' className={postFlair !== null && postFlair === 'question' ? `filter-flair ${theme}-bg question active` : `filter-flair ${theme}-bg question`} onClick={() => setPostFlair('question')}>Question</h4>
          <h4 id='gameplay' className={postFlair !== null && postFlair === 'gameplay' ? `filter-flair ${theme}-bg gameplay active` : `filter-flair ${theme}-bg gameplay`} onClick={() => setPostFlair('gameplay')}>Gameplay</h4>
        </div>
        <TextField className="form-text-field" placeholder={'Title'} value={postTitle} onChange={(event)=>setPostTitle(event.target.value)} />
        <TextField 
          className="form-text-field" 
          multiline
          rows={10}
          placeholder={'Content (Optional)'}
          value={postContent}
          onChange={(event)=>setPostContent(event.target.value)} />
        {/* <TextField className="form-text-field" placeholder={'Image URL (Optional)'} value={postURL} onChange={(event)=>setPostURL(event.target.value)} /> */}
        <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={tabVal}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                <Tab label="URL" value="1" />
                <Tab label="Preview" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ p: 0.5 }}>
              <div className="url-tab-container">
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <Select
                    value={urlType}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value={'image'}>Image</MenuItem>
                    <MenuItem value={'video'}>Video</MenuItem>
                  </Select>
                </FormControl>
                <TextField 
                  className="form-text-field" 
                  placeholder={'Image or Video URL (Optional)'} 
                  value={postURL} 
                  onChange={(event)=>setPostURL(event.target.value)} />
              </div>
            </TabPanel>
            <TabPanel value="2" sx={{ p: 1.5 }}>
              {
                postURL.replace(/\s/g, '') === '' ? (
                  <p className="no-url-message">There is nothing to be previewed currently. Please input a url in the previous tab.</p>
                )
                :
                urlType === 'image' ? (
                  <img 
                    src={postURL}
                    alt="There was an issue with displaying the previewed image. Please input a different URL if this problem persists." 
                    width={'100%'} 
                    height={'auto'}
                     />
                ) 
                : 
                urlType === 'video' ? (
                  <ReactPlayer url={postURL} controls width={'100%'} />
                )
                : ""
              }
              {/* <TextField className="form-text-field" placeholder={'YouTube URL (Optional)'} value={postURL} onChange={(event)=>setPostURL(event.target.value)} /> */}
            </TabPanel>
          </TabContext>
        </Box>
        <button className={`${theme}-bg update-post-btn`} type="submit" onClick={handleUpdatePost}>Update Post</button>
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
            </>
          ):
          (
            <>
              <DialogTitle id="alert-dialog-title" className="dialog-title">
                Success!
              </DialogTitle>
              <DialogContent dividers>
                <DialogContentText id="alert-dialog-description" className="dialog-content">
                  Post was updated successfully! View the updated post or return home.
                </DialogContentText>
              </DialogContent>
              <DialogActions className="dialog-actions">
                <div className="dialog-btns-container">
                  <div className={`${theme}-bg dialog-btns`} onClick={()=>navigate('/')}>Back to Home</div>
                  <div className={`${theme}-bg dialog-btns`} onClick={()=>navigate(`/post/${id}`)}>View Post</div>
                </div>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </div>
  )
}

export default UpdatePost