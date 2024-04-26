import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PostCondensed from '../../components/PostCondensed/PostCondensed'
import { useOutletContext, useNavigate } from "react-router-dom";
import { supabase } from '../../config/SupabaseClient';
import AddIcon from '@mui/icons-material/Add';
import './Search.css'
import { ring2 } from 'ldrs'

function Search() {

  const [UID, theme] = useOutletContext()
  const navigate = useNavigate()

  const {query} = useParams()

  const [posts, setPosts] = useState([])

  const [sortByFilter, setSortByFilter] = useState('newest')

  const [filterByFilter, setFilterByFilter] = useState(null)

  const [loading, setLoading] = useState(true)

  ring2.register()

  useEffect(() => {
    setLoading(true)
    const fetchPosts = async() => {
      const {data} = await supabase
                          .from('posts')
                          .select('id, created_at, title, upvotes, user_id, flair')
                          .ilike('title', `%${query}%`)
                          .order('created_at', {ascending: false})
      setPosts(data)
      setLoading(false)
    }
    fetchPosts()
  }, [query])

  const handleSort = async (event) => {
    if(sortByFilter !== event.target.id) {
      setLoading(true)
      setSortByFilter(event.target.id)
      if(event.target.id === 'newest') {
        if(filterByFilter !== null) {
          const {data} = await supabase
                              .from('posts')
                              .select('id, created_at, title, upvotes, user_id, flair')
                              .eq('flair', (filterByFilter.charAt(0).toUpperCase() + filterByFilter.slice(1)))
                              .ilike('title', `%${query}%`)
                              .order('created_at', {ascending: false})
          setPosts(data)
        }
        else {
          const {data} = await supabase
                              .from('posts')
                              .select('id, created_at, title, upvotes, user_id, flair')
                              .ilike('title', `%${query}%`)
                              .order('created_at', {ascending: false})
          setPosts(data)
        }
      }
      else if(event.target.id === 'most-popular') {
        if(filterByFilter !== null) {
          const {data} = await supabase
                              .from('posts')
                              .select('id, created_at, title, upvotes, user_id, flair')
                              .eq('flair', (filterByFilter.charAt(0).toUpperCase() + filterByFilter.slice(1)))
                              .ilike('title', `%${query}%`)
                              .order('upvotes', {ascending: false})
          setPosts(data)
        }
        else {
          const {data} = await supabase
                              .from('posts')
                              .select('id, created_at, title, upvotes, user_id, flair')
                              .ilike('title', `%${query}%`)
                              .order('upvotes', {ascending: false})
          setPosts(data)
        }
      }
      setLoading(false)
    }
  }

  const handleFilter = async(event) => {
    setLoading(true)
    const order = sortByFilter === 'newest' ? 'created_at' : 'upvotes'
    if(filterByFilter !== event.target.id) {
      setFilterByFilter(event.target.id)
      const {data} = await supabase
                            .from('posts')
                            .select('id, created_at, title, upvotes, user_id, flair')
                            .eq('flair', (event.target.id.charAt(0).toUpperCase() + event.target.id.slice(1)))
                            .ilike('title', `%${query}%`)
                            .order(order, {ascending: false})
      setPosts(data)
    }
    else {
      setFilterByFilter(null)
      const {data} = await supabase
                            .from('posts')
                            .select('id, created_at, title, upvotes, user_id, flair')
                            .ilike('title', `%${query}%`)
                            .order(order, {ascending: false})
      setPosts(data)
    }
    setLoading(false)
  }

  return (
    <>
      {/* <h2>Search Results for '{query}'</h2> */}
      <div className='sort-filter'>
        <div className='search-container'>
          <h3 className='search-header'>Search Query: </h3>
          <h4 className={`${theme}-bg query`}>{query}</h4>
        </div>
        <div className='sort-container'>
          <h3 className='sort'>Sort By:</h3>
          <h4 id='newest' className={sortByFilter === 'newest' ? `sort-flair ${theme}-bg active` : `sort-flair ${theme}-bg ${theme}-bg-hover`} onClick={handleSort}>Newest</h4>
          <h4 id='most-popular' className={sortByFilter === 'most-popular' ? `sort-flair ${theme}-bg active` : `sort-flair ${theme}-bg ${theme}-bg-hover`} onClick={handleSort}>Most Popular</h4>
        </div>
        <div className='filter-container'>
          <h3 className='filter'>Filter By:</h3>
          <h4 id='discussion' className={filterByFilter !== null && filterByFilter === 'discussion' ? `filter-flair ${theme}-bg discussion active` : `filter-flair ${theme}-bg discussion ${theme}-bg-hover`} onClick={handleFilter}>Discussion</h4>
          <h4 id='achievements' className={filterByFilter !== null && filterByFilter === 'achievements' ? `filter-flair ${theme}-bg achievements active` : `filter-flair ${theme}-bg achievements ${theme}-bg-hover`} onClick={handleFilter}>Achievements</h4>
          <h4 id='question' className={filterByFilter !== null && filterByFilter === 'question' ? `filter-flair ${theme}-bg question active` : `filter-flair ${theme}-bg question ${theme}-bg-hover`} onClick={handleFilter}>Question</h4>
          <h4 id='gameplay' className={filterByFilter !== null && filterByFilter === 'gameplay' ? `filter-flair ${theme}-bg gameplay active` : `filter-flair ${theme}-bg gameplay ${theme}-bg-hover`} onClick={handleFilter}>Gameplay</h4>
        </div>
        {/* <div className='search-container'>
          <h3 className='search-header'>Search: </h3>
          <h4 className={`${theme}-bg query`}>{query}</h4>
        </div> */}
      </div>
      {
        loading ? (
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
        posts.length !== 0 ? (
          <div className='posts-container'>
            {posts.map((post, i) => {
              return (
                <PostCondensed key={i} post={post} />
              )
            })}
          </div>
        ) :
        <div className='no-posts'>
          <p>There are no posts that can be found for the query "{query}".</p>
          {/* <p>Get started on contributing by <Link className={`${theme} create-link`} to="/create">creating a new post</Link>!</p> */}
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

export default Search
