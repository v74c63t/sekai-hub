import './Navbar.css'
import { Link, Outlet } from 'react-router-dom'

const NavBar = () => {
  return (
    <div>
      <div className="container">
        <nav className='nav-bar'>
          <Link className='header-link' to="/">
            <h2 className='header'>Sekai Hub</h2>
          </Link>
          <input className='search' type="text" placeholder="Search.." />
          <div className="nav-bar-list">
            <Link className='link' to="/">
              Home
            </Link>
            <Link className='link' to="/create">
              Create New Post
            </Link>
          </div>
        </nav>
      </div>
      <div className="page">
        <Outlet />
      </div>
    </div>
  )
}

export default NavBar