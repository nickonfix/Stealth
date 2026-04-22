import React from 'react'
import { Outlet } from 'react-router'

type Props = {
    children: React.ReactNode;
    ticker: string;
}

const CompanyDashboard = ({ children, ticker }: Props) => {
    return (
        <div className="relative md:ml-64 bg-gray-100 w-full min-h-screen dark:bg-black transition-colors duration-300">

            <div className="relative pt-20 pb-32 bg-white dark:bg-zinc-950/50 dark:border-b dark:border-zinc-800 shadow-sm">

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