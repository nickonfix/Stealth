import React from 'react'

type Props = {
    config: any;
    data: any;
}



const RatioList = ({ config, data }: Props) => {
    const renderRows = config.map((row: any) => {
        return (
            <li className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">{row.label}</p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">{row.subtitle && row.subtitle}</p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-gray-100">
                        {row.render(data)}
                    </div>
                </div>

            </li>

        )
    })
    return (
        <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full w-full dark:bg-[#0f172a] dark:border dark:border-gray-800 transition-colors">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {renderRows}
            </ul>
        </div>
    )
}

export default RatioList