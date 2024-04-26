import { useParams } from 'react-router-dom'
import './PostDetail.css'
import { useEffect, useState } from 'react'
import { supabase } from '../../config/SupabaseClient'
import { useOutletContext } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import { useNavigate } from 'react-router-dom';
import Comment from '../../components/Comment/Comment';
import ReactPlayer from 'react-player'
import { storage } from "../../config/FirebaseClient";
import { ref, deleteObject } from 'firebase/storage'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import 'ldrs/ring2'
import 'ldrs/dotSpinner'
import TextField from '@mui/material/TextField';

const PostDetail = () => {
  const {id} = useParams()
  const [UID, theme] = useOutletContext()
  const navigate = useNavigate();

  const [post, setPost] = useState(null)

  const [comments, setComments] = useState([])

  const [userComment, setUserComment] = useState('')
  
  const [loading, setLoading] = useState(true)

  const [dialogPrompt, setDialogPrompt] = useState(false)

  const [secretKey, setSecretKey] = useState('')
  const [secretKeyErr, setSecretKeyErr] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchPostInfo = async () => {
      const post = await supabase
                            .from('posts')
                            .select('id, created_at, title, content, url, upvotes, user_id, video, flair, uploaded')
                            .eq('id', id)
                            .single()
      const comments = await supabase
                            .from('comments')
                            .select()
                            .eq('post_id', id)
      setPost(post.data)
      setComments(comments.data)
      setLoading(false)
    }
    fetchPostInfo()
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
    navigate(`/update/${id}`)
  }

  const handleDelete = async() => {
    if(post.uploaded) {
      const storageRef = ref(storage, post.url)
      deleteObject(storageRef).then(async () => {
        await supabase
                .from('posts')
                .delete()
                .eq('id', id)
        setDeleteLoading(false)
        setDeleteSuccess(true)
      })
      .catch((error) => {
        setDeleteLoading(false)
        setDeleteSuccess(false)
        console.error(error)
      })
    }
    else {
      await supabase
              .from('posts')
              .delete()
              .eq('id', id)
      setDeleteLoading(false)
      setDeleteSuccess(true)
    }
  }

  const handleCloseDialog = () => {
    setDialogPrompt(false)
    setSecretKeyErr(false)
  }

  const checkSecretKey = async () => {
    setDeleteLoading(true)
    const { data } = await supabase
                          .from('posts')
                          .select('secret_key')
                          .eq('id', id)
                          .single()
    if(secretKey === data.secret_key) {
      setSecretKeyErr(false)
      handleDelete()
    }
    else {
      console.log('correct behavior for now')
      setSecretKeyErr(true)
      setDeleteLoading(false)
    }
  }

  return (
    <>
      {loading ? (
        <div className='loading'>
          <h1>Loading</h1>
          <l-ring-2
            size="40"
            speed="0.8"
            bg-opacity={0.3}
            stroke={5}
            stroke-length={0.25}
            color={'gray'}
          ></l-ring-2>
        </div>
      ) 
      : 
      post !== null ? (
        <div className='post-detail'>
          <h4 className='timestamp'>Posted by <span className={theme}>@{post.user_id}</span> on {post.created_at}</h4>
          <h3 className='post-detail-title'>{post.title} <span className={`flair ${theme}-bg ${post.flair.toLowerCase()}`}>{post.flair}</span></h3>
          {
            post.content !== "" ? <p className='post-content'>{post.content}</p> : ""
          }
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
              <Icon className='delete-icon' icon="material-symbols:delete-outline" width="1.8rem" height="1.8rem" onClick={()=> {setDialogPrompt(true)}} />
            </div>
          </div>
          <div className='comments-container'>
            <h4 className='comment-header'>Comments</h4>
            {
              comments.length !== 0 ? (
                comments.map((comment, i) => {
                  return (
                    <Comment key={i} comment={comment} />
                  )
                })
              ) : <p className='no-comments'>No comments</p>
            }
            <input className='add-comment' type="text" placeholder='Comment...' value={userComment} onChange={(event)=>setUserComment(event.target.value)} onKeyDown={handleSubmit} />
          </div>
          <Dialog
            open={dialogPrompt}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth='xs'>
            {
              deleteLoading ? (
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
              deleteSuccess === true ? (
                <>
                  <DialogTitle id="alert-dialog-title" className="dialog-title">
                    Success
                  </DialogTitle>
                  <DialogContent dividers>
                    <DialogContentText id="alert-dialog-description" className="dialog-content">
                      The post was successfully deleted. Click on the button below to return to the home page.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions className="delete-dialog-actions">
                    <div className="delete-dialog-btns-container">
                      <div className={`${theme}-bg delete-dialog-btns`} onClick={()=>navigate('/')}>Back to Home</div>
                    </div>
                  </DialogActions>
                </>
              )
              :
              deleteSuccess === false ? (
                <>
                  <DialogTitle id="alert-dialog-title" className="dialog-title">
                    Error!
                    <Icon className={`${theme} close-icon`} icon="mdi:close" width={'2rem'} height={'2rem'} onClick={handleCloseDialog} />
                  </DialogTitle>
                  <DialogContent dividers>
                    <DialogContentText id="alert-dialog-description" className="dialog-content">
                      There was an issue with deleting the post. Please try again.
                    </DialogContentText>
                  </DialogContent>
                </>
              )
              :
              (
                <>
                  <DialogTitle id="alert-dialog-title" className="secret-key-title">
                    Are you sure you want to delete this post?
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description" className="secret-key-content">
                      This process cannot be undone. Please enter the post's secret key to confirm.
                    </DialogContentText>
                    <TextField
                      FormHelperTextProps={{ style: { backgroundColor: 'white', padding: 0, margin: 0 }}}
                      className="secret-key-input" 
                      placeholder={'Secret Key'} 
                      value={secretKey} 
                      onChange={(event)=>setSecretKey(event.target.value)}
                      type='password'
                      error={secretKeyErr}
                      helperText={secretKeyErr ? 'The secret key inputted is incorrect. Please try again.': ''}
                        />
                  </DialogContent>
                  <DialogActions className="dialog-actions">
                    <div className="dialog-btns-container">
                      <div className={`${theme}-bg secret-key-dialog-btns ${theme}-bg-hover`} onClick={handleCloseDialog}>Cancel</div>
                      <div className={`${theme}-bg secret-key-dialog-btns ${theme}-bg-hover`} onClick={checkSecretKey}>Delete</div>
                    </div>
                  </DialogActions>
                </>
              )
            }
          </Dialog>
        </div>
      ) : ""}
    </>
  )
}

export default PostDetail