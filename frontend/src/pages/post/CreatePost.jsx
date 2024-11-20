import Editor from "react-simple-wysiwyg";
import { LuSave } from "react-icons/lu"
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { GET_CATEGORIES, POST_STORE } from "../../services/api";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const loader = async ({ request }) => {
  const response = await axios.get(GET_CATEGORIES)

  const categories = response.data.data

  return { categories }
}

const CreatePost = () => {
  const navigate = useNavigate()
  const { categories } = useLoaderData()
  const [form, setForm] = useState({
    ps_title: "",
    category: "",
    ps_body: ""
  })
  const [thumbnail, setThumbnail] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)

  const handleForm = (e) => {
    let { name, value } = e.target
    if (name === "ps_body" && value == "<br>") value = "";
    
    setForm({ ...form, [name]: value })
  }

  const checkForm = () => {
    return form.ps_title && form.category && form.ps_body && thumbnail;
  }

  useEffect(() => {
    const status = checkForm()
    setIsFormValid(status)
  }, [form, thumbnail])

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.post(POST_STORE, {...form, ps_thumbnail: thumbnail})
      toast.success("Post created successfully")
      navigate("/my-posts")
    } catch (error) {
      toast.error("Failed to create post")
      console.log(error)
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-3xl">
      <div className="w-full flex-col font-custom px-3">
        <div className="breadcrumbs text-sm my-[1.19em]">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/my-posts">Posts</Link>
            </li>
            <li>Create Post</li>
          </ul>
        </div>

        <form className="mb-3" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Create Post</h1>
            <button type="submit" className="btn btn-sm text-white border-[#1a8917] bg-[#1a8917] hover:bg-[#156D12] hover:border-[#156D12]" disabled={ !isFormValid }><LuSave/>Save</button>
          </div>
          <div className="mt-4 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              name="ps_title"
              value={form.ps_title}
              onChange={handleForm}
              className="w-full input input-bordered h-10"
              placeholder="Post title"
              required
            />
            <select name="category" className="select select-bordered w-full md:w-1/3 mt-2 md:mt-0 min-h-10 h-10" onChange={handleForm} value={form.category} required>
                <option value="">Category</option>
                { categories.map((category) => (
                  <option value={category._id} key={category._id}>{ category.cat_name }</option>
                )) }
            </select>
          </div>
          <div className="flex gap-2 items-center mt-4">
            <div className="avatar cursor-pointer" onClick={() => setThumbnail("technology.webp") }>
              <div className={`w-20 rounded ${ thumbnail === "technology.webp" ? "border-blue-500 border-2" : ""}`}>
                <img src={window.location.origin + '/thumbnails/technology.webp'} alt="Thumbnail 1" />
              </div>
            </div>
            <div className="avatar cursor-pointer" onClick={() => setThumbnail("marketing.webp") }>
              <div className={`w-20 rounded ${ thumbnail === "marketing.webp" ? "border-blue-500 border-2" : ""}`}>
                <img src={window.location.origin + '/thumbnails/marketing.webp'} alt="Thumbnail 2" />
              </div>
            </div>
            <div className="avatar cursor-pointer" onClick={() => setThumbnail("transportation.webp") }>
              <div className={`w-20 rounded ${ thumbnail === "transportation.webp" ? "border-blue-500 border-2" : ""}`}>
                <img src={window.location.origin + '/thumbnails/transportation.webp'} alt="Thumbnail 3" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Editor name="ps_body" value={form.ps_body} onChange={handleForm} containerProps={{ style: { height: "500px" } }}/>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
