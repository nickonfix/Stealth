import React from 'react'
import { Outlet } from 'react-router'

type Props = {
    children: React.ReactNode;
    ticker: string;
}

const CompanyDashboard = ({ children, ticker }: Props) => {
    return (
        <div className="relative md:ml-64 bg-[#1f2228] w-full min-h-screen">
            <div className="relative pt-24 pb-32">
                <div className="px-4 md:px-10 mx-auto w-full">
                    <div>
                        <div className="flex flex-wrap -mx-4">
                            {children}
                        </div>
                        <div className="mt-12">
                            <Outlet context={ticker} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDashboard