import { Link, useOutletContext } from "react-router-dom";
import './NotFound.css'
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const [uid, theme] = useOutletContext()
  const navigate = useNavigate()

  return (
    <div className="not-found-container">
      <h2 className="header-404">404</h2>
      <h3 className="page-not-found">Page Not Found</h3>
      <img src="/assets/404.png" alt="404 image" width={'auto'} height={250} />
      <p className="page-not-found-message">Sorry, the page you're looking for could not be found. It may have been moved or deleted.</p>
      <button className={`${theme}-bg home-btn`} onClick={() => navigate('/')}>Back to Home</button>
    </div>
)
}

export default NotFound;