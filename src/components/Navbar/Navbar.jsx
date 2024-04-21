import './Navbar.css'
import { Link, Outlet } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'

const NavBar = () => {
  const [UID, setUID] = useState(nanoid(12))

  return (
    <div>
      <div className="nav-bar-container">
        <nav className='nav-bar'>
          <div className="nav-bar-list">
            <Link className='header-link' to="/">
              <h2 className='header'>Sekai Hub</h2>
            </Link>
            <Link className='link' to="/">
              Home
            </Link>
            <Link className='link' to="/create">
              Create New Post
            </Link>
          </div>
          <input className='search' type="text" placeholder="Search.." />
          <div className="user-info">
            <p className='navbar-uid'>@{UID}</p>
            <Icon className='settings-icon' icon="fluent:text-grammar-settings-24-filled" />
          </div>
        </nav>
      </div>
      <div className="page">
        {/* <img src="/src/assets/vs-logo.jpg" alt="group logo" height={60} width={'auto'} /> */}
        <Outlet context={[UID]} />
      </div>
    </div>
  )
}

export default NavBar