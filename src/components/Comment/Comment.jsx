import { useOutletContext } from 'react-router-dom'
import './Comment.css'

const Comment = ({comment}) => {
  const [_, theme] = useOutletContext()
  return (
    <div><strong className={theme}>@{comment.user_id}</strong><strong>:</strong> {comment.comment}</div>
  )
}

export default Comment