import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'
import PostCondensed from './components/PostCondensed/PostCondensed'
import { useOutletContext } from "react-router-dom";

function App() {

  const [UID] = useOutletContext()

  const posts = [
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

  return (
    <>
      {posts.length !== 0 ? (
        posts.map((post, i) => {
          return (
            <PostCondensed key={i} post={post} />
          )
        })
      ) :
      <div className='no-posts'>
        <p>There are no posts currently.</p>
        <p>Get started on contributing by <Link className="create-link" to="/create">creating a new post</Link>!</p>
      </div>
      }
    </>
  )
}

export default App
