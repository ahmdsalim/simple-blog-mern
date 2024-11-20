import React from 'react'
import Navbar from '../../components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer'

const AppLayout = ({ children }) => {
  return (
    <div className='flex flex-col justify-center items-center'>
        <Navbar/>
        <Outlet/>
        <div className='w-full container items-center'>
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-span-12 px-4 my-[20px] sm:my-0 md:col-start-1 md:col-span-12 md:px-5 xl:col-start-3 xl:col-span-8 xl:px-3">
              <hr />
            </div>
          </div>
        </div>
        <Footer/>
    </div>
  )
}

export default AppLayout