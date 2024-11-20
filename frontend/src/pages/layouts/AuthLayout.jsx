import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = ({children}) => {
  return (
    <div className="p-4 h-screen flex items-center justify-center">
        <Outlet/>
    </div>
  )
}

export default AuthLayout