'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User
    return (
        <nav className='p-4 md:p-6 bg-gray-100 dark:bg-gray-800 flex justify-between items-center'>
            <div className='flex items-center space-x-4 container mx-auto flex-col md:flex-row justify-between'>
                <Link href="#" className="text-2xl font-bold mb-4 md:mb-0">
                    Mystery Message
                </Link>
                {
                    session ? (
                        <>
                            <span className=' mr-4'>Welcome, {user?.username || user?.email}</span>
                            <Button className=' w-full md:w-auto' onClick={() => signOut()}>Sign Out</Button>
                        </>
                    ) : (
                        <Link href="/sign-in" className="text-blue-500">
                            <Button className=' w-full md:w-auto'>Sign In</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar