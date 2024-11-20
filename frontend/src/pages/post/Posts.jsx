import { useState, useEffect } from "react";
import Post from "../../components/Post.jsx"
import axios from "axios";
import { useLoaderData, Link } from "react-router-dom";
import { GET_MY_POSTS } from "../../services/api.js";
import toast from "react-hot-toast";

// export const loader = async ({request}) => {
//   const response = await axios.get(GET_MY_POSTS + "?limit=10")
//   const myposts = response.data.data

//   return { myposts }
// }

const Posts = () => {
  // const { myposts } = useLoaderData()
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [deleteId, setDeleteId] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const paramsObj = { page, limit: 10 }
      if(debouncedSearch) paramsObj.search = debouncedSearch
      const response = await axios.get(GET_MY_POSTS, {
        params: paramsObj
      })
      if(response.data.success) {
        setPosts(prevPosts => (page === 1 ? response.data.data : [...prevPosts, ...response.data.data]))
        setHasMore(response.data.data.length >= 10)
      }
    } catch (error) {
      error.response.status === 404 && setHasMore(false)
      error.response.status !== 404 && console.error(error) && toast.error("Failed to load posts")
    }
    setLoading(false)
  }

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1)
  }

  useEffect(() => {
    loadPosts()
  }, [page, debouncedSearch])

  const confirmDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/posts/${deleteId}`)
      setPosts(posts.filter(post => post._id !== deleteId))
      setDeleteId("")
      document.getElementById("deleteModal").close()
      toast.success("Post deleted successfully")
    } catch (error) {
      toast.error("Failed to delete post")
      console.error(error)
    }
    setLoading(false)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleChangeDelete = (id) => {
    setDeleteId(id)
  }

  return (
    <div className="w-full flex items-center justify-center max-w-3xl">
      <div className="w-full justify-center font-custom px-4 sm:px-3 pb-4">
        <div className="breadcrumbs text-sm my-[1.19em]">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>Posts</li>
          </ul>
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl sm:text-2xl font-semibold">List Post</h1>
          <Link to="/my-posts/create" className="btn btn-sm text-white font-medium border-[#1a8917] bg-[#1a8917] hover:bg-[#156D12] hover:border-[#156D12]">
            Add
          </Link>
        </div>

        <input type="text" value={searchQuery} onChange={handleSearch} className="w-full sm:w-1/3 bg-gray-100/55 border-none input input-sm focus:outline-none h-10 rounded-3xl" placeholder="Search..."/>

        { !loading && posts.length === 0 && (
          <div className="w-full flex items-center justify-center bg-gray-100/55 p-4 mt-4 rounded-sm">
            <p className="text-base text-gray-500">No post available</p>
          </div>
        )}

        { posts.length > 0 && (
          <>
            { posts.map((post, index) => (
              <Post data={post} index={index} handleConfirmDelete={confirmDelete} handleDeleteId={handleChangeDelete} key={post._id} loading={loading}/>
            )) }
            { hasMore && (
              <div className="w-full flex items-center justify-center">
                <button onClick={handleLoadMore} className="btn btn-sm text-white rounded-md border-[#1a8917] bg-[#1a8917] hover:bg-[#156D12] hover:border-[#156D12] mt-5">
                  Load More
                </button>
              </div>
            )}
          </>
        )}

        { loading && (<div className="w-full flex items-center justify-center p-4 mt-4">
            <span className="loading loading-bars text-gray-500 loading-lg"></span>
          </div>) }
      </div>
    </div>
  );
};

export default Posts;
