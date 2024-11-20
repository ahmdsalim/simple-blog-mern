import React from 'react'

const Footer = () => {
  return (
    <div className='w-full flex pt-5 pb-10 sm:pt-10 sm:pb-16 max-w-5xl'>
      <div className='w-full flex justify-between px-3 text-xs font-sans text-gray-400/75'>
        <div>
          <footer>
            <div>&copy; 2024 Ahmad Salim</div>
          </footer>
        </div>
        <div>
          <footer>
            <div>
            Built with Sovel.
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Footer