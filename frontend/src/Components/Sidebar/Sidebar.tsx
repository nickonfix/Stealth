import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa';

interface Props { }

const Sidebar = (props: Props) => {
    return (
        <nav className="w-full md:w-64 bg-white border-b border-gray-200 dark:bg-black dark:border-zinc-800 md:fixed md:top-0 md:bottom-0 md:left-0 md:shadow-xl md:border-r md:border-b-0 z-20">
            <div className="w-full md:h-full md:pt-20 px-3 md:px-6 py-3 md:py-4 overflow-x-auto md:overflow-x-hidden">
                <div className="flex md:flex-col items-stretch gap-2 min-w-max md:min-w-0">
                    <Link
                        to="company-profile"
                        className="flex items-center whitespace-nowrap text-blueGray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/50 px-3 py-2 rounded-md text-xs uppercase font-bold no-underline transition-all">
                        <FaHome />
                        <h6 className='ml-3'> Company Profile</h6>
                    </Link>

                    <Link
                        to="income-statement"
                        className="flex items-center whitespace-nowrap text-blueGray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/50 px-3 py-2 rounded-md text-xs uppercase font-bold no-underline transition-all">
                        <FaHome />
                        <h6 className='ml-3'> Income Statement</h6>
                    </Link>

                    <Link
                        to="balance-sheet"
                        className="flex items-center whitespace-nowrap text-blueGray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/50 px-3 py-2 rounded-md text-xs uppercase font-bold no-underline transition-all">
                        <FaHome />
                        <h6 className='ml-3'> Balance Sheet</h6>
                    </Link>

                    <Link
                        to="cashflow-statement"
                        className="flex items-center whitespace-nowrap text-blueGray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/50 px-3 py-2 rounded-md text-xs uppercase font-bold no-underline transition-all">
                        <FaHome />
                        <h6 className='ml-3'> Cash Flow Statement</h6>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Sidebar