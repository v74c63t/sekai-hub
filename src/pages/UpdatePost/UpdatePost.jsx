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
import { Icon } from "@iconify/react/dist/iconify.js";
import data from '../../data/data.json'
import { supabase } from '../../config/Client';
import { storage } from "../../config/Firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { v4 } from 'uuid'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';


const UpdatePost = () => {
  const {id} = useParams()
  const [UID, theme] = useOutletContext()
  const navigate = useNavigate()
  
  const [secretKeyValidated, setSecretKeyValidated] = useState(false)
  const [secretKeyPrompt, setSecretKeyPrompt] = useState(true)
  const [secretKeyInput, setSecretKeyInput] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [secretKeyErr, setSecretKeyErr] = useState(false)
  const [secretKeyLoading, setSecretKeyLoading] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)

  const handleCloseSecretKeyPrompt = () => {
    setSecretKeyPrompt(false)
  }

  const [postTitle, setPostTitle] = useState('')
  const [postFlair, setPostFlair] = useState(null)
  const [postContent, setPostContent] = useState('')
  const [postURL, setPostURL] = useState('')
  const [oldPostURL, setOldPostURL] = useState('')
  const [uploadURL, setUploadURL] = useState('')
  const [uploaded, setUploaded] = useState(false)
  // const [postID, setPostID] = useState(0)
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

  // const posts = data.posts

  // useEffect(() => {
  //   // const res = posts.filter((post) => post.id === parseInt(id))
  //   // if(res.length !== 0) {
  //   //   setPostTitle(res[0].title)
  //   //   setPostFlair(res[0].flair.toLowerCase())
  //   //   setPostContent(res[0].content)
  //   //   setPostURL(res[0].url)
  //   // }
  //   const fetchPost = async () => {
  //     const {data} = await supabase
  //                           .from('posts')
  //                           .select()
  //                           .eq('id', id)
  //                           .single()
  //     setPostTitle(data.title)
  //     setPostFlair(data.flair.toLowerCase())
  //     setPostContent(data.content)
  //     setPostURL(data.url)
  //     setOldPostURL(data.url)
  //     setUploaded(data.uploaded)
  //     if(data.video) {
  //       setURLType('video')
  //     }
  //   }
  //   fetchPost()
  // }, [])

  const checkSecretKey = async () => {
    setSecretKeyLoading(true)
    const {data} = await supabase 
                          .from('posts')
                          .select('secret_key')
                          .eq('id', id)
                          .single()
    if(secretKeyInput === data.secret_key) {
      setSecretKeyValidated(true)
      setSecretKeyPrompt(false)
      fetchPost()
      setSecretKeyLoading(false)
      setSecretKeyErr(false)
    }
    else {
      setSecretKeyErr(true)
      setSecretKeyLoading(false)
    }
  }

  const fetchPost = async () => {
    const {data} = await supabase
                          .from('posts')
                          .select()
                          .eq('id', id)
                          .single()
    setPostTitle(data.title)
    setPostFlair(data.flair.toLowerCase())
    setPostContent(data.content)
    setPostURL(data.url)
    setOldPostURL(data.url)
    setUploaded(data.uploaded)
    setSecretKey(data.secret_key)
    if(data.video) {
      setURLType('video')
    }
  }

  const handleUpdatePost = async (event) => {
    event.preventDefault()
    setLoading(true)
    setOpen(true)
    if(postTitle === '') {
      var errorMessage = 'Please enter a title for the post'
      if(postFlair === null) {
        errorMessage += ' and assign a flair to the post'
      }
      errorMessage += '.'
      if(secretKey === '') {
        errorMessage += ' Make sure to also input a secret key for the post.'
      }
      setMessage(errorMessage)
      setError(true)
      setLoading(false)
    }
    else if(postFlair === null) {
      setMessage('Please assign a flair to the post.')
      if(secretKey === '') {
        errorMessage += ' Make sure to also input a secret key for the post.'
      }
      setError(true)
      setLoading(false)
    }
    else if(secretKey === '') {
      errorMessage += 'Please a secret key for the post.'
    }
    else {
      if(urlType === 'upload') {
        if(uploadFile === null) {
          const {data, error} = await supabase
                                    .from('posts')
                                    .update({'title': postTitle, 
                                            'content': postContent, 
                                            'user_id': UID, 
                                            'flair': (postFlair.charAt(0).toUpperCase() + postFlair.slice(1)),
                                            'secret_key': post.secretKey})
                                    .select()
                                    .eq('id', id)
                                    .single()
          if(error) {
            setError(true)
            setMessage('There was an error with updating the post. Please try again.')
            setLoading(false)
          }
          else {
            setPostID(data.id)
            setSuccess(true)
            setLoading(false)
          }
        }
        else {
          if(uploaded) {
            const storageRef = ref(storage, postURL)
            deleteObject(storageRef).then(() => {
              const imgRef = ref(storage, `sekai-hub-images/${v4() + uploadFile.name}`)
              uploadBytes(imgRef, uploadFile).then((res) => {
                getDownloadURL(res.ref).then(async (url) => {
                  const {data, error} = await supabase
                                            .from('posts')
                                            .update({'title': postTitle, 
                                                    'content': postContent, 
                                                    'url': url, 
                                                    'video': false, 
                                                    'flair': (postFlair.charAt(0).toUpperCase() + postFlair.slice(1)),
                                                    'secret_key': secretKey,
                                                    'uploaded': true})
                                            .select()
                                            .eq('id', id)
                                            .single()
                  if(error) {
                    setError(true)
                    setMessage('There was an error with updating the post. Please try again.')
                    setLoading(false)
                  }
                  else {
                    setSuccess(true)
                    setLoading(false)
                  }
                })
              })
              .catch((error) => {
                setError(true)
                setMessage('There was an error with uploading your image. Please try again.')
                setLoading(false)
                return
              })
            })
            .catch((error) => {
              console.error(error)
            })
          }
          else {
            const imgRef = ref(storage, `sekai-hub-images/${v4() + uploadFile.name}`)
            uploadBytes(imgRef, uploadFile).then((res) => {
              console.log(res)
              getDownloadURL(res.ref).then(async (url) => {
                console.log(url)
                const {data, error} = await supabase
                                          .from('posts')
                                          .update({'title': postTitle, 
                                                  'content': postContent, 
                                                  'url': url, 
                                                  'video': false, 
                                                  'flair': (postFlair.charAt(0).toUpperCase() + postFlair.slice(1)),
                                                  'secret_key': secretKey,
                                                  'uploaded': true})
                                          .select()
                                          .eq('id', id)
                                          .single()
                if(error) {
                  setError(true)
                  setMessage('There was an error with updating the post. Please try again.')
                  setLoading(false)
                }
                else {
                  setSuccess(true)
                  setLoading(false)
                }
              })
            })
            .catch((error) => {
              setError(true)
              setMessage('There was an error with uploading your image. Please try again.')
              setLoading(false)
              return
            })
          }
        }
      }
      else {
        if(uploaded && (oldPostURL !== postURL)) {
          const storageRef = ref(storage, oldPostURL)
          deleteObject(storageRef).then(async () => {
            const {data, error} = await supabase
                                    .from('posts')
                                    .update({'title': postTitle, 
                                            'content': postContent, 
                                            'url': postURL, 
                                            'video': urlType === 'video', 
                                            'flair': (postFlair.charAt(0).toUpperCase() + postFlair.slice(1)),
                                            'secret_key': secretKey,
                                            'uploaded': false})
                                    .select()
                                    .eq('id', id)
                                    .single()
            if(error) {
              setError(true)
              setMessage('There was an error with updating the post. Please try again.')
              setLoading(false)
            }
            else {
              setSuccess(true)
              setLoading(false)
            }
})
        }
        else {
          const {data, error} = await supabase
                                    .from('posts')
                                    .update({'title': postTitle, 
                                            'content': postContent, 
                                            'url': postURL, 
                                            'video': urlType === 'video', 
                                            'flair': (postFlair.charAt(0).toUpperCase() + postFlair.slice(1)),
                                            'secret_key': secretKey})
                                    .select()
                                    .eq('id', id)
                                    .single()
          if(error) {
            setError(true)
            setMessage('There was an error with updating the post. Please try again.')
            setLoading(false)
          }
          else {
            setSuccess(true)
            setLoading(false)
          }
        }
      }
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
    <>
      {
        secretKeyValidated ? (
          (
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
                <TextField 
                  className="form-text-field"
                  placeholder={'Title'} 
                  value={postTitle} 
                  onChange={(event)=>setPostTitle(event.target.value)}
                  />
                <TextField 
                  className="form-text-field" 
                  multiline
                  rows={10}
                  placeholder={'Content (Optional)'}
                  value={postContent}
                  onChange={(event)=>setPostContent(event.target.value)} />
                <OutlinedInput 
                  type={showSecretKey ? 'text' : 'password'} 
                  className="form-text-field" 
                  placeholder={'Secret Key'} 
                  value={secretKey} 
                  variant={'outlined'}
                  onChange={(event)=>setSecretKey(event.target.value)} 
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {setShowSecretKey(!showSecretKey)}}
                        edge="end"
                      >
                        {showSecretKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  />
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
                  ): ""}
                </Dialog>
              </Box>
            </div>
          )
        )
        :
        (
          <Dialog
            open={secretKeyPrompt}
            onClose={handleCloseSecretKeyPrompt}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth='xs'
          >
            {secretKeyLoading ? (
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
            )
            :
            (
              <>
                <DialogTitle id="alert-dialog-title" className="secret-key-title">
                  Enter Secret Key
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description" className="secret-key-content">
                    In order to update the post, please enter the secret key associated with the post.
                  </DialogContentText>
                  <TextField
                    FormHelperTextProps={{ style: { backgroundColor: 'white', padding: 0, margin: 0 }}}
                    className="secret-key-input" 
                    placeholder={'Secret Key'} 
                    value={secretKeyInput} 
                    onChange={(event)=>setSecretKeyInput(event.target.value)}
                    type='password'
                    error={secretKeyErr}
                    helperText={secretKeyErr ? 'The secret key inputted is incorrect. Please try again.': ''}
                      />
                  {/* </DialogContentText> */}
                </DialogContent>
                <DialogActions className="dialog-actions">
                  <div className="dialog-btns-container">
                    <div className={`${theme}-bg secret-key-dialog-btns`} onClick={()=>navigate('/')}>Back to Home</div>
                    <div className={`${theme}-bg secret-key-dialog-btns`} onClick={checkSecretKey}>Confirm</div>
                  </div>
                </DialogActions>
              </>
            )}
          </Dialog>
        )
      }
    </>
  )
}

export default UpdatePost