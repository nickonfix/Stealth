
type Props = {
    config: any;
    data: any;
}


const Table = ({ config, data }: Props) => {
    const renderrows = data.map((company: any) => {
        return (
            <tr key={company.cik}>
                {config.map((val: any) => {
                    return (
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100">
                            {val.render(company)}
                        </td>
                    )
                })}


            </tr>
        )
    }
    )

    const renderedHeaders = config.map((config: any) => {
        return (
            <th className="px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400" key={config.label} >
                {config.label}
            </th>
        )
    })
    return (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 w-full dark:bg-[#0f172a] dark:border dark:border-gray-800 transition-colors duration-300" >
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            {renderedHeaders}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {renderrows}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default Table