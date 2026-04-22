import React from 'react'

type Props = {
    config: any;
    data: any;
}



const RatioList = ({ config, data }: Props) => {
    const renderRows = config.map((row: any) => {
        return (
            <li className="py-3 sm:py-4" key={row.label}>
                <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-zinc-100">{row.label}</p>
                        <p className="text-sm text-gray-500 truncate dark:text-zinc-400">
                            {row.subtitle || row.subTitle}
                        </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-zinc-100">
                        {row.render(data)}
                    </div>
                </div>

            </li>

        )
    })
    return (
        <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full w-full dark:bg-zinc-950 dark:border dark:border-zinc-800 transition-colors duration-300">
            <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
                {renderRows}
            </ul>
        </div>
    )
}

export default RatioList