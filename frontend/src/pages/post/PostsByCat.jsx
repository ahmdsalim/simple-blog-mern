import axios from "axios"
import Article from "../../components/Article.jsx"
import { GET_CATEGORIES, GET_POSTS_BY_CAT } from "../../services/api.js"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

const PostsByCat = () => {
    const [posts, setPosts] = useState([])
    const [category, setCategory] = useState({})
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const params = useParams()

    const loadPosts = async () => {
      try {
        setLoading(true)
        const catResponse = await axios.get(GET_CATEGORIES + `/${params.catId}`)
        const response = await axios.get(GET_POSTS_BY_CAT(params.catId), {
          params: {
            page,
            limit: 10
          }
        })

        if(catResponse.data.success && response.data.success) {
          setCategory(catResponse.data.data)
          setPosts(prevPosts => (page === 1 ? response.data.data : [...prevPosts, ...response.data.data]))
          setHasMore(response.data.data.length >= 15)
        }
      } catch (error) {
        error.response.status === 404 && hasMore(false)
        error.response.status !== 404 && toast.error("Failed to fetch posts") && console.error(error);
      }
      setLoading(false)
    }

    useEffect(() => {
      loadPosts()
    }, [page])

    const handleLoadMore = () => {
      setPage(prevPage => prevPage + 1)
    }

    return (
    <div className="w-full flex justify-center max-w-2xl">
      <div className="flex w-full flex-col items-center justify-center py-4">
        <div className="w-full px-4 py-2 sm:py-4">
            <h1 className="text-start font-custom">Posts by category "{category.cat_name}"</h1>
        </div>
        { posts.length === 0 && !loading && (
          <div className="w-full flex items-center justify-center bg-gray-100/55 p-4 mt-4 rounded-sm">
          <p className="text-base font-custom">No post available</p>
          </div>
        ) }

        { posts.length > 0 && (
          <>
            { posts.map((post, index) => (
            <Article post={post} index={index} key={post._id} />
            )) }

            { hasMore && (
              <button onClick={handleLoadMore} className="btn btn-sm text-white font-custom rounded-md border-[#1a8917] bg-[#1a8917] hover:bg-[#156D12] hover:border-[#156D12] mt-4">Load More</button>
            ) }
          </>
        ) }

        { loading && (
          <div className="flex justify-center">
            <div className="loading loading-bars text-gray-500 loading-lg"></div>
          </div>
        ) }
      </div>
    </div>
  )
}

export default PostsByCat