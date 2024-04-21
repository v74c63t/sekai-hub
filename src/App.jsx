import { useState, useEffect } from 'react'
import './App.css'
import { Link } from 'react-router-dom'
import PostCondensed from './components/PostCondensed/PostCondensed'
import { useOutletContext, useNavigate } from "react-router-dom";
import { supabase } from './config/Client';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

function App() {

  const [UID, theme] = useOutletContext()
  
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])

  const [sortByFilter, setSortByFilter] = useState('newest')

  const [filterByFilter, setFilterByFilter] = useState(null)

  var initial = [
    {
      "id": 65,
      "created_at": "2023-04-10 04:45:54.471979+00",
      "title": "Which is better? American Revolution or French Revolution?",
      "content": "",
      "url": "",
      "upvotes": 3,
      "comments": ["America!!!"],
      "flair": "Discussion",
      "uid": "8YF1ziS3PUPW"
    },
    {
      "id": 73,
      "created_at": "2023-04-10 09:20:57.187388+00",
      "title": "I'm obsessed with the Holy Roman Empire",
      "content": "It's holy, Roman, and an empire",
      "url": "",
      "upvotes": 23,
      "comments": ["Very true", "Haha!"],
      "flair": "Achievements",
      "uid": "tw-dl3nCe_6t"
    },
    {
      "id": 87,
      "created_at": "2023-04-14 23:53:31.127016+00",
      "title": "Who is your favorite Founding Father?",
      "content": "Mine is Thomas Jefferson! What about you?",
      "url": "https://i.imgur.com/0QpthJU.jpg",
      "upvotes": 3,
      "comments": ["It's gotta be George Washington!", "Did you forget about Ben Franklin?"],
      "flair": "Question",
      "uid": "kOdN4Ns53PP9"
    },
    {
      "id": 59,
      "created_at": "2023-04-08 01:19:55.739826+00",
      "title": "I love history!",
      "content": "",
      "url": "https://i.imgur.com/wzk9rEB.jpg",
      "upvotes": 2,
      "comments": [],
      "flair": "Gameplay",
      "uid": "mwlNu_9-TGK0"
    }
  ]

  useEffect(() => {
    setPosts(initial)
    // const fetchPosts = async() => {
    //   const {data} = await supabase
                          // .from('posts')
                          // .select()
                          // .order('created_at', {ascending: false})
    //   setPosts(data)
    // }
  }, [])

  const handleSort = (event) => {
    if(sortByFilter !== event.target.id) {
      setSortByFilter(event.target.id)
      if(event.target.id === 'newest') {
        initial.sort((a, b) => a.created_at > b.created_at ? -1 : 1)
        setPosts(initial)
        // const {data} = await supabase
        //                       .from('posts')
        //                       .select()
        //                       .order('created_at', {ascending: false})
        // setPosts(data)

      }
      else if(event.target.id === 'most-popular') {
        initial.sort((a, b) => a.upvotes > b.upvotes ? -1 : 1)
        setPosts(initial)
        // const {data} = await supabase
        //                       .from('posts')
        //                       .select()
        //                       .order('upvotes', {ascending: false})
        // setPosts(data)
      }
    }
  }

  const handleFilter = (event) => {
    // const order = sortByFilter === 'newest' ? 'created_at' : 'upvotes'
    if(filterByFilter !== event.target.id) {
      setFilterByFilter(event.target.id)
      setPosts(initial.filter((post) => post.flair.toLowerCase() === event.target.id))
      // const {data} = await supabase
      //                       .from('posts')
      //                       .select()
      //                       .eq('flair', (event.target.id.charAt(0).toUpperCase() + event.target.id.slice(1)))
      //                       .order(order, {ascending: false})
      // setPosts(data)
    }
    else {
      setFilterByFilter(null)
      setPosts(initial)
      // const {data} = await supabase
      //                       .from('posts')
      //                       .select()
      //                       .order(order, {ascending: false})
      // setPosts(data)
    }
  }

  return (
    <>
      <div className='sort-filter'>
        <div className='sort-container'>
          <h3 className='sort'>Sort By:</h3>
          <h4 id='newest' className={sortByFilter === 'newest' ? `sort-flair ${theme}-bg active` : `sort-flair ${theme}-bg`} onClick={handleSort}>Newest</h4>
          <h4 id='most-popular' className={sortByFilter === 'most-popular' ? `sort-flair ${theme}-bg active` : `sort-flair ${theme}-bg`} onClick={handleSort}>Most Popular</h4>
        </div>
        <div className='filter-container'>
          <h3 className='filter'>Filter By:</h3>
          <h4 id='discussion' className={filterByFilter !== null && filterByFilter === 'discussion' ? `filter-flair ${theme}-bg discussion active` : `filter-flair ${theme}-bg discussion`} onClick={handleFilter}>Discussion</h4>
          <h4 id='achievements' className={filterByFilter !== null && filterByFilter === 'achievements' ? `filter-flair ${theme}-bg achievements active` : `filter-flair ${theme}-bg achievements`} onClick={handleFilter}>Achievements</h4>
          <h4 id='question' className={filterByFilter !== null && filterByFilter === 'question' ? `filter-flair ${theme}-bg question active` : `filter-flair ${theme}-bg question`} onClick={handleFilter}>Question</h4>
          <h4 id='gameplay' className={filterByFilter !== null && filterByFilter === 'gameplay' ? `filter-flair ${theme}-bg gameplay active` : `filter-flair ${theme}-bg gameplay`} onClick={handleFilter}>Gameplay</h4>
        </div>
      </div>
      {posts.length !== 0 ? (
        <div className='posts-container'>
          {posts.map((post, i) => {
            return (
              <PostCondensed key={i} post={post} />
            )
          })}
        </div>
      ) :
      <div className='no-posts'>
        <p>There are no posts currently.</p>
        <p>Get started on contributing by <Link className="create-link" to="/create">creating a new post</Link>!</p>
      </div>
      }
      <div className='fab-container'>
        <button className={`${theme}-bg fab`} onClick={()=>navigate('/create')}>
          <AddIcon sx={{ fontSize: 30 }} className='fab-icon' />
        </button>
      </div>
    </>
  )
}

export default App
