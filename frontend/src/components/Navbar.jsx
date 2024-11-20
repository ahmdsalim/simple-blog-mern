import { useState, useEffect } from "react";
import { LuLogOut, LuPencil, LuSearch } from "react-icons/lu"
import { Pencil2Icon } from "@radix-ui/react-icons"
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logoutUser } from "../features/userSlice";
import toast from "react-hot-toast";
import formatDate from "../utils/formateDate";
import SearchModal from "./SearchModal";

const Navbar = () => {
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearchFocus, setIsSearchFocus] = useState(false)

  const user = useSelector((state) => state.userState.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(`/posts?search=${debouncedSearch}&limit=5`)
      setSearchResults(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleOpenSearch = () => {
    document.getElementById("searchModal").showModal()
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const clearSearch = () => {
    setSearch("")
    setSearchResults([])
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [search])

  useEffect(() => {
    if (debouncedSearch) {
      fetchSearchResults()
    } else {
      setSearchResults([])
    }
  }, [debouncedSearch])

  const handleLogout = async () => {
    if (loading) return

    try {
      setLoading(true)
      await axios.post('/auth/logout')
      dispatch(logoutUser())
      navigate("/")
    } catch (error) {
      const errMsg =  error?.response?.data?.message || error?.message
      toast.error(errMsg)
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <div className="w-full flex flex-col sticky top-0 z-10 items-center justify-center">
      { !user && (
        <div className="w-full flex md:hidden items-center justify-end bg-white py-2 px-5 border-b-[1px]">
          <div className="flex items-center justify-center gap-4">
            <Link to="/sign-up" className="btn rounded-3xl btn-xs text-white font-normal font-custom border-[#1a8917] bg-[#1a8917] hover:bg-[#156D12] hover:border-[#156D12]">
              Sign Up
            </Link>
            <Link
              to="/login"
              className="text-sm text-gray-500 font-custom hover:text-black"
            >
              Login
            </Link>
          </div>
        </div>
      )}
      <div className="w-full flex items-center bg-white z-10 justify-between py-2 px-5 border-b-[1px]">
        <div className="flex items-center gap-4">
          <Link to="/"><h1 className="text-[28px] font-bold font-post-body tracking-tighter">Meowdium</h1></Link>
          <div className="hidden md:flex items-center bg-gray-100/55 rounded-3xl font-custom p-1 relative">
            <div className="flex-1 mx-3">
              <LuSearch className="text-xl text-gray-400"/>
            </div>
            <input type="text" className="w-full bg-transparent border-none input input-sm ps-0 focus:outline-none" placeholder="Search" value={search} onChange={handleSearch} onFocus={() => setIsSearchFocus(true)} onBlur={() => setIsSearchFocus(false)} />
              <div className={`absolute bg-white w-[135%] top-[45px] rounded-md py-5 px-5 shadow-md drop-shadow-md transition-all duration-100 transform ${ 
                isSearchFocus && searchResults.length > 0 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
               }`} onMouseDown={(e) => e.preventDefault()}>
                <p className="text-xs  font-custom tracking-wider text-gray-500 pb-2 border-b-[1px] border-gray-400/15">SEARCH RESULT:</p>
                { searchResults.map((result, index) => (
                  <div className="text-xs font-custom py-2" key={index}>
                  <Link to={`/${result._id}`} onClick={clearSearch}>
                    <p className="mb-1">{ result.ps_title.length > 35 ? result.ps_title.slice(0, 35) + "..." : result.ps_title }</p>
                    <p className="text-gray-600">{ formatDate(result.createdAt) }</p>
                  </Link>
                </div>)
                )}
              </div>
          </div>
        </div>
        <div className="flex items-center gap-7">
          <Link
            to={ user ? "/my-posts/create" : "/login" }
            className="hidden text-sm text-gray-500 font-custom hover:text-black md:flex gap-2 items-center justify-center"
          >
            <Pencil2Icon width={"20px"} height={"20px"} />
            Write
          </Link>
          { !user && (
          <div className="md:flex items-center justify-center gap-4 hidden">
            <Link to="/sign-up" className="btn rounded-3xl btn-sm text-white font-normal font-custom border-[#1a8917] bg-[#1a8917] hover:bg-[#156D12] hover:border-[#156D12]">
              Sign Up
            </Link>
            <Link
              to="/login"
              className="text-sm text-gray-500 font-custom hover:text-black"
            >
              Login
            </Link>
          </div>

          ) }
          <button onClick={handleOpenSearch} className="text-xl text-gray-400 md:hidden"><LuSearch/></button>
          <SearchModal search={search} handleSearch={handleSearch} searchResult={searchResults} clearSearch={clearSearch} />

          { user && (
            <details className="dropdown dropdown-end">
              <summary className="avatar placeholder cursor-pointer select-none">
                <div className="bg-neutral text-neutral-content w-10 rounded-full">
                  <span className="text-lg font-custom text-gray-400">{ user.us_name.charAt(0).toUpperCase() }</span>
                </div>
              </summary>
              <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow font-custom">
                <li>
                  <div className="hover:bg-inherit">Hello, { user.us_name }</div>
                </li>
                <li>
                  <Link to="/my-posts" className="text-gray-500"><LuPencil/>My Posts</Link>
                </li>
                <li>
                  <a className="text-gray-500" onClick={handleLogout}><LuLogOut/>Logout</a>
                </li>
              </ul>
            </details>
          ) }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
