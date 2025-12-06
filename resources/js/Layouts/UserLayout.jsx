import Navbar from '@/Components/ui/Navbar'
import React from 'react'

export default function userLayout({ children, auth}) {
  return (
    <div>
        <Navbar auth={auth} />
        {children}
    </div>
  )
}
