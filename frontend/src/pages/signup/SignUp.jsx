import { useState } from 'react'
import axios from 'axios'
import { SIGNUP_POST } from '../../services/api'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function SignUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
          setLoading(true)
            const response = await axios.post(SIGNUP_POST, { us_name: name, us_email: email, us_password: password })

            if(response) {
              toast.success("Berhasil mendaftar")
              navigate("/login")
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
      <div className='w-full p-6 rounded-lg shadow-md'>
        <Link to="/">
          <h1 className='text-3xl font-medium text-center text-gray-500 font-custom mb-2'>
          Sign Up
          </h1>
        </Link>

        <form onSubmit={handleSubmit}>
          <div>
            <label className='label py-2'>
              <span className='text-base label-text'>Name</span>
            </label>
            <input type="text" className='w-full input input-bordered h-10' onChange={e => setName(e.target.value)}/>
          </div>
          <div className="mt-2">
            <label className='label py-2'>
              <span className='text-base label-text'>Email</span>
            </label>
            <input type="email" className='w-full input input-bordered h-10' onChange={e => setEmail(e.target.value)}/>
          </div>
          <div className="mt-2">
            <label className='label py-2'>
              <span className='text-base label-text'>Password</span>
            </label>
            <input type="password" className='w-full input input-bordered h-10' onChange={e => setPassword(e.target.value)}/>
          </div>

          <Link to="/login" className="text-sm hover:underline hover:text-blue-400">
            Already have an account?
          </Link>

          <div>
            <button className="btn btn-block mt-2 font-custom" disabled={loading}>{ loading ? (<span className="loading loading-spinner loading-md"></span>) : 'Sign Up' }</button>
          </div>
        </form>
      </div>
    </div>
  )
}
