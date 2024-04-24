import './Navbar.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { supabase } from '../../config/Client'

const NavBar = () => {
  const [UID, setUID] = useState(nanoid(12))

  const [theme, setTheme] = useState('n25')

  const [anchorEl, setAnchorEl] = useState(null);

  const [query, setQuery] = useState('')

  const navigate = useNavigate()

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event) => {
    if(event.key === 'Enter') {
      if(query.replace(/\s/g, '') !== '') {
        navigate(`/search/${query}`)
        setQuery('')
      }
      
      // setSearch(true)
      // if(window.location.pathname !== '/') {
      //   navigate('/')
      // }
      // setPosts(posts.filter((post) => post.title.includes(query.toLowerCase())))
      // setQuery('')
    }
  }

  // const handleSearch = async (event) => {
  //   if(event.key === 'Enter') {
  //     if(query.replace(/\s/g, '') !== '') {
  //       setLoading(true)
  //       if(window.location.pathname !== '/') {
  //         navigate('/')
  //       }
  //       const order = sortByFilter === 'newest' ? 'created_at' : 'upvotes'
  //       console.log(order)
  //       console.log(filterByFilter)
  //       if(filterByFilter !== null) {
  //         const {data} = await supabase
  //                             .from('posts')
  //                             .select('id, created_at, title, upvotes, user_id, flair')
  //                             .eq('flair', (filterByFilter.charAt(0).toUpperCase() + filterByFilter.slice(1)))
  //                             .ilike('title', `%${query}%`)
  //                             .order(order, {ascending: false})
  //         // console.log(data)
  //         setPosts(data)
  //         setLoading(false)
  //       }
  //       else {
  //         const {data} = await supabase
  //                             .from('posts')
  //                             .select('id, created_at, title, upvotes, user_id, flair')
  //                             .ilike('title', `%${query}%`)
  //                             .order(order, {ascending: false})
  //         // console.log(data)
  //         setPosts(data)
  //         setLoading(false)
  //       }
  //       // const {data, error} = await supabase
  //       //                 .from('posts')
  //       //                 .select('id, created_at, title, upvotes, user_id, flair')
  //       //                 .ilike('title', `%${query}%`)
  //       // setPosts(data)
  //     }
  //   }
  // }

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
          <input className='search' type="text" placeholder="Search..." value={query} onChange={(event)=>setQuery(event.target.value)} onKeyDown={handleSearch} />
          <div className="user-info">
            <p className='navbar-uid'>@{UID}</p>
            <Icon className='settings-icon' icon="fluent:text-grammar-settings-24-filled" onClick={handleClick} />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              keepMounted
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
                disablePadding: true,
              }}
              sx={{borderRadius: '1rem', marginTop: '1.5rem'}}
            >
              <h3 className={`theme-settings-header ${theme}-bg`}>Theme</h3>
              <MenuItem onClick={() => {setTheme('vs'); handleClose()}} selected={theme === 'vs'}><img src="/assets/vs-logo.jpg" alt="virtual singer logo" height={50} width={'auto'} /></MenuItem>
              <MenuItem onClick={() => {setTheme('ln'); handleClose()}} selected={theme === 'ln'}><img src="/assets/ln-logo.jpg" alt="leo/need logo" height={50} width={'auto'} /></MenuItem>
              <MenuItem onClick={() => {setTheme('mmj'); handleClose()}} selected={theme === 'mmj'}><img src="/assets/mmj-logo.jpg" alt="more more jump logo" height={50} width={'auto'} /></MenuItem>
              <MenuItem onClick={() => {setTheme('vbs'); handleClose()}} selected={theme === 'vbs'}><img src="/assets/vbs-logo.jpg" alt="vivid bad squad logo" height={50} width={'auto'} /></MenuItem>
              <MenuItem onClick={() => {setTheme('wxs'); handleClose()}} selected={theme === 'wxs'}><img src="/assets/wxs-logo-jp.jpg" alt="wonderlands x showtime logo" height={50} width={'auto'} /></MenuItem>
              <MenuItem onClick={() => {setTheme('n25'); handleClose()}} selected={theme === 'n25'}><img src="/assets/n25-logo-jp.jpg" alt="nightcord logo" height={50} width={'auto'} /></MenuItem>
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