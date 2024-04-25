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
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReactPlayer from 'react-player'
import { Icon } from "@iconify/react/dist/iconify.js";
import { supabase } from "../../config/Client";
import axios from 'axios'

const CreatePost = () => {
  const [UID, theme] = useOutletContext()
  const navigate = useNavigate()
  const [postTitle, setPostTitle] = useState('')
  const [postFlair, setPostFlair] = useState(null)
  const [postContent, setPostContent] = useState('')
  const [postURL, setPostURL] = useState('')
  const [uploadURL, setUploadURL] = useState('')
  const [postID, setPostID] = useState(0)
  const [message, setMessage] = useState('')
  const [uploadFile, setUploadFile] = useState(null)
  const [filename, setFilename] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const [open, setOpen] = useState(false)

  const [tabVal, setTabVal] = useState('1')

  const handleChange = (event, newValue) => {
    setTabVal(newValue);
  };

  const [urlType, setURLType] = useState('image');
  
  const handleSelectChange = (event) => {
    setURLType(event.target.value);
  };

  const handleCreatePost = async (event) => {
    event.preventDefault()
    setLoading(true)
    setOpen(true)
    if(postTitle === '') {
      var errorMessage = 'Please enter a title for the post'
      if(postFlair === null) {
        errorMessage += ' and assign a flair to the post'
      }
      errorMessage += '.'
      setMessage(errorMessage)
      setError(true)
      setLoading(false)
    }
    else if(postFlair === null) {
      setMessage('Please assign a flair to the post.')
      setError(true)
      setLoading(false)
    }
    else {
      if(urlType === 'upload') {
        if(uploadFile === null) {
          const {data, error} = await supabase
                                    .from('posts')
                                    .insert({'title': postTitle, 
                                            'content': postContent, 
                                            'user_id': UID, 
                                            'flair': (postFlair.charAt(0).toUpperCase() + postFlair.slice(1))})
                                    .select()
                                    .single()
          if(error) {
            setError(true)
            setMessage('There was an error with creating the post. Please try again.')
            setLoading(false)
          }
          else {
            setPostID(data.id)
            setSuccess(true)
            setLoading(false)
          }
        }
        else {
          const formData = new FormData()
          const url = import.meta.env.VITE_CLOUDINARY_URL
          const cloudname = import.meta.env.VITE_CLOUD_NAME
          // const fileType = uploadFile.type.includes('image') ? 'image' : 'video'
          formData.append('file', uploadFile)
          formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

          axios.post(`${url}/${cloudname}/image/upload`, formData)
              .then(async (res) => {
                const secureURL = res.data.secure_url
                const {data, error} = await supabase
                                      .from('posts')
                                      .insert({'title': postTitle, 
                                              'content': postContent, 
                                              'url': secureURL, 
                                              'user_id': UID, 
                                              'video': false, 
                                              'flair': (postFlair.charAt(0).toUpperCase() + postFlair.slice(1)),
                                              'uploaded': true})
                                      .select()
                                      .single()
                if(error) {
                  setError(true)
                  setMessage('There was an error with creating the post. Please try again.')
                  setLoading(false)
                }
                else {
                  setPostID(data.id)
                  setSuccess(true)
                  setLoading(false)
                }
              })
              .catch((error) => {
                setError(true)
                setMessage('There was an error with uploading your image. Please make sure the uploaded image is not over 10 MB.')
                setLoading(false)
                return
              })
        }
      }
      else {
        const {data, error} = await supabase
                                    .from('posts')
                                    .insert({'title': postTitle, 
                                            'content': postContent, 
                                            'url': postURL, 
                                            'user_id': UID, 
                                            'video': urlType === 'video', 
                                            'flair': (postFlair.charAt(0).toUpperCase() + postFlair.slice(1))})
                                    .select()
                                    .single()
        if(error) {
          setError(true)
          setMessage('There was an error with creating the post. Please try again.')
          setLoading(false)
        }
        else {
          setPostID(data.id)
          setSuccess(true)
          setLoading(false)
        }
      }
      
      // console.log(postFlair)
      // console.log(postTitle)
      // console.log(postContent)
      // console.log(postURL)
      // console.log('create')
      // setSuccess(true)
      // setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    if(error) {
      setError(false)
      setMessage('')
    }
    if(success) {
      setSuccess(false)
      setPostTitle('')
      setPostFlair(null)
      setPostContent('')
      setPostURL('')
      setURLType('image')
      setTabVal('1')
    }
  }

  const handleUpload = (event) => {
    const file = event.currentTarget.files[0]
    // console.log(file.type)
    // console.log(file.type.includes('image'))
    // console.log(file.type.includes('video'))
    setUploadFile(file)
    setFilename(file.name)
    const reader = new FileReader()
    reader.onloadend = () => {
      const buffer = reader.result

      // convert buffer to blob
      const blob = new Blob([new Uint8Array(buffer)], { type: file.type });

      // get url from blob
      const url = window.URL.createObjectURL(blob);
      setUploadURL(url)
      // setURLType('image')
    }
    reader.readAsArrayBuffer(file)

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
          rows={10}
          placeholder={'Content (Optional)'}
          value={postContent}
          onChange={(event)=>setPostContent(event.target.value)} />
        {/* <TextField className="form-text-field" placeholder={'Image URL (Optional)'} value={postURL} onChange={(event)=>setPostURL(event.target.value)} /> */}
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={tabVal}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                <Tab label="Image/Video (Optional)" value="1" />
                <Tab label="Preview" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ p: 0.5 }}>
              <div className="url-tab-container">
                <FormControl sx={{ m: 1, minWidth: 150 }}>
                  <Select
                    value={urlType}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value={'image'}>Image URL</MenuItem>
                    <MenuItem value={'video'}>Video URL</MenuItem>
                    <MenuItem value={'upload'}>Upload Image</MenuItem>
                  </Select>
                </FormControl>
                {
                  urlType === 'upload' ? (
                    <>
                      <p className="selected-file">Selected Image: {filename === '' ? 'No file chosen' : filename}</p>
                      <label htmlFor="file" className={`${theme}-bg upload-btn`}>Select Image</label>
                      <input className="file-input" type="file" id="file" onChange={handleUpload} accept="image/*" />
                    </>
                  )
                  :
                  <TextField 
                    className="form-text-field" 
                    placeholder={'Image or Video URL (Optional)'} 
                    value={postURL} 
                    onChange={(event)=>setPostURL(event.target.value)} />
                }
              </div>
            </TabPanel>
            <TabPanel value="2" sx={{ p: 1.5 }}>
              {
                postURL.replace(/\s/g, '') === '' && uploadURL.replace(/\s/g, '') === '' ? (
                  <p className="no-url-message">There is nothing to be previewed currently. Please input a url or upload an image in the previous tab.</p>
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
                : 
                urlType === 'upload' && uploadFile !== null && uploadFile.type.includes('image') ?  (
                  <img 
                  src={uploadURL}
                  alt="There was an issue with displaying the previewed image." 
                  width={'100%'} 
                  height={'auto'}
                    />
                )
                : ""
                // urlType === 'upload' && uploadFile !== null && uploadFile.type.includes('video') ? (
                //   <ReactPlayer url={uploadURL} controls width={'100%'} />
                // ) : ""
              }
              {/* <TextField className="form-text-field" placeholder={'YouTube URL (Optional)'} value={postURL} onChange={(event)=>setPostURL(event.target.value)} /> */}
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
          )
          :
          error ? (
            <>
              <DialogTitle id="alert-dialog-title" className="dialog-title">
                Error!
                <Icon className={`${theme} close-icon`} icon="mdi:close" width={'2rem'} height={'2rem'} onClick={handleClose} />
              </DialogTitle>
              <DialogContent dividers>
                <DialogContentText id="alert-dialog-description" className="dialog-content">
                  {message}
                </DialogContentText>
              </DialogContent>
              {/* <DialogActions className="dialog-actions">
                <div className="dialog-btns-container">
                  <div className={`${theme}-bg dialog-btns`} onClick={()=>navigate('/')}>Back to Home</div>
                  <div className={`${theme}-bg dialog-btns`} onClick={()=>navigate(`/post/${postID}`)}>View Post</div>
                </div>
              </DialogActions> */}
            </>
          )
          :
          success ? (
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
          ):""}
        </Dialog>
      </Box>
    </div>
  )
}

export default CreatePost