import { useState, useEffect } from "react";
import Article from "../../components/Article";
import { Link } from "react-router-dom";
import axios from "axios";
import { GET_CATEGORIES, GET_POSTS } from "../../services/api";
import toast from "react-hot-toast";

const Landing = () => {
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const fetchCategories = axios.get(GET_CATEGORIES)
      const fetchPosts = axios.get(GET_POSTS, {
        params: { page, limit: 10 }
      })

      const responses = await axios.all([fetchCategories, fetchPosts])
      const [categoriesResponse, postsResponse] = responses

      if(categoriesResponse.data.success && postsResponse.data.success) {
        setCategories(categoriesResponse.data.data)

        setPosts(prevPosts => (page === 1 ? postsResponse.data.data : [...prevPosts, ...postsResponse.data.data]))
        setHasMore(postsResponse.data.data.length >= 10)
      }
    } catch (error) {
      error.response.status === 404 && setHasMore(false)
      error.response.status !== 404 && console.error(error) && toast.error("Failed to load posts")
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [page])

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1)
  }

  return (
    <div className="w-full grid md:grid-cols-3 gap-x-5 max-w-5xl">
      <div className="md:col-span-2 flex w-full flex-col items-center py-4">
        { posts.length === 0 && !loading && (
          <div className="w-full flex items-center justify-center p-4 mt-2 border-b-[1px]">
            <p className="font-custom">No posts found</p>
          </div>
        )}

        { posts.length > 0 && (
          <>
          { posts.map((post, index) => (
            <Article post={post} index={index} key={post._id} />
          )) }
          { hasMore && (
            <button onClick={handleLoadMore} className="btn btn-sm text-white font-normal font-custom rounded-md border-[#1a8917] bg-[#1a8917] hover:bg-[#156D12] hover:border-[#156D12] mt-4">Load More</button>
          ) }
          </>
        )}

        { loading && (
          <div className="flex justify-center">
            <div className="loading loading-bars text-gray-500 loading-lg"></div>
          </div>
        )}
      </div>
      <div className="py-4 px-4 md:px-0">
        <h2 className="mb-[20px] md:my-[20px] font-custom text-xl font-semibold">Categories</h2>
        <div className="flex flex-wrap justify-center md:justify-start gap-3 font-custom">
          { categories.map((category) => (
            <Link to={`/posts/${category._id}/category`} key={category._id} className="flex-grow badge badge-outline border-gray-400 rounded-2xl p-4">{category.cat_name}</Link>
          )) }
        </div>
      </div>
    </div>
  );
};

export default Landing;
