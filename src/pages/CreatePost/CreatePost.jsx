import { useOutletContext } from "react-router-dom";

const CreatePost = () => {
  const [UID] = useOutletContext()

  return (
    <div>
      <div>Create Post</div>
      <div>UID: @{UID}</div>
    </div>
  )
}

export default CreatePost