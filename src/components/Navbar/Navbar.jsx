import './Navbar.css'
import { Link, Outlet } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const NavBar = () => {
  const [UID, setUID] = useState(nanoid(12))

  const [theme, setTheme] = useState('n25')

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div className="nav-bar-container">
        <nav className={`nav-bar ${theme}-bg`}>
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
            <Icon className='settings-icon' icon="fluent:text-grammar-settings-24-filled" onClick={handleClick} />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
                disablePadding: true,
              }}
              sx={{borderRadius: '1rem', marginTop: '1.5rem'}}
            >
              <h3 className={`theme-settings-header ${theme}-bg`}>Theme</h3>
              <MenuItem onClick={() => {setTheme('vs'); handleClose()}} selected={theme === 'vs'}><img src="/src/assets/vs-logo.jpg" alt="virtual singer logo" height={50} width={'auto'} /></MenuItem>
              <MenuItem onClick={() => {setTheme('ln'); handleClose()}} selected={theme === 'ln'}><img src="/src/assets/ln-logo.jpg" alt="leo/need logo" height={50} width={'auto'} /></MenuItem>
              <MenuItem onClick={() => {setTheme('mmj'); handleClose()}} selected={theme === 'mmj'}><img src="/src/assets/mmj-logo.jpg" alt="more more jump logo" height={50} width={'auto'} /></MenuItem>
              <MenuItem onClick={() => {setTheme('vbs'); handleClose()}} selected={theme === 'vbs'}><img src="/src/assets/vbs-logo.jpg" alt="vivid bad squad logo" height={50} width={'auto'} /></MenuItem>
              <MenuItem onClick={() => {setTheme('wxs'); handleClose()}} selected={theme === 'wxs'}><img src="/src/assets/wxs-logo-jp.jpg" alt="wonderlands x showtime logo" height={50} width={'auto'} /></MenuItem>
              <MenuItem onClick={() => {setTheme('n25'); handleClose()}} selected={theme === 'n25'}><img src="/src/assets/n25-logo-jp.jpg" alt="nightcord logo" height={50} width={'auto'} /></MenuItem>
            </Menu>
          </div>
        </nav>
      </div>
      <div className="page">
        {/* <img src="/src/assets/vs-logo.jpg" alt="group logo" height={60} width={'auto'} /> */}
        <Outlet context={[UID, theme]} />
      </div>
    </div>
  )
}

export default NavBar