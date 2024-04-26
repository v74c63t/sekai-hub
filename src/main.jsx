import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar/Navbar.jsx';
import UpdatePost from './pages/UpdatePost/UpdatePost.jsx';
import PostDetail from './pages/PostDetail/PostDetail.jsx';
import CreatePost from './pages/CreatePost/CreatePost.jsx';
import Search from './pages/Search/Search.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navbar/>}>
        <Route index={true} element={<App />} />
        <Route index={false} path="/update/:id"  element={<UpdatePost />} />
        <Route index={false} path="/post/:id"  element={<PostDetail />} />
        <Route index={false} path="/create"  element={<CreatePost />} />
        <Route index={false} path="/search/:query"  element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </React.StrictMode>,
)
