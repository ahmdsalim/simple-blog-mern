import { useState } from 'react'
import axios from 'axios'
import { LOGIN_POST } from '../../services/api'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import store from '../../store.js'
import { loginUser } from '../../features/userSlice.js'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await axios.post(LOGIN_POST, { us_email: email, us_password: password })
            if(response) {
                store.dispatch(loginUser(response.data))
                toast.success("Login berhasil")
                return navigate("/")
            }
        } catch (error) {
            const errMsg = error?.response?.data?.message || error?.message
            toast.error(errMsg)
            console.log(error)
        }
        setLoading(false)
    }
  return (
    <div className='flex flex-col items-center justify-center min-w-[400px] mx-auto'>
        <div className="w-full p-6 rounded-lg shadow-md">
            <Link to="/">
                <h1 className='text-3xl text-gray-500 text-center font-medium font-custom mb-2'>
                    Login
                </h1>
            </Link>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='label py-2'>
                        <span className='text-base label-text'>Email</span>
                    </label>
                    <input type="email" className='w-full input input-bordered h-10' onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className='mt-2'>
                    <label className='label py-2'>
                        <span className='text-base label-text'>Password</span>
                    </label>
                    <input type="password" className='w-full input input-bordered h-10' onChange={e => setPassword(e.target.value)}/>
                </div>
                <Link to="/sign-up" className='text-sm hover:underline hover:text-blue-500 mt-2 inline-block'>
                    {"Don't"} have an account?
                </Link>

                <div>
                    <button className='font-custom btn btn-block mt-2' disabled={loading}>{ loading ? (<span className="loading loading-spinner loading-md"></span>) : 'Login' }</button>
                </div>
            </form>
        </div>
    </div>
  )
}
