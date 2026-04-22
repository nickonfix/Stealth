import React from 'react'
import { Outlet } from 'react-router'

type Props = {
    children: React.ReactNode;
    ticker: string;
}

const CompanyDashboard = ({ children, ticker }: Props) => {
    return (
        <div className="relative md:ml-64 bg-gray-50 w-full min-h-screen dark:bg-[#070b0f] transition-colors duration-300">

            <div className="relative pt-20 pb-32 bg-white dark:bg-[#0b0f1a] dark:border-b dark:border-white/5 shadow-sm">

                <div className="px-4 md:px-6 mx-auto w-full">

                    <div>
                        <div className="flex flex-wrap"> {children}</div>

                        <div className="flex flex-wrap mt-8"> {<Outlet context={ticker} />}</div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default CompanyDashboard