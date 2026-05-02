import React from 'react'

type Props = {
    config: any;
    data: any;
}

const Table = ({ config, data }: Props) => {
    const renderrows = data.map((company: any) => {
        return (
            <tr key={company.cik} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                {config.map((val: any, idx: number) => {
                    return (
                        <td key={idx} className="p-6 whitespace-nowrap font-mono text-[13px] font-light text-white/80 tracking-tight">
                            {val.render(company)}
                        </td>
                    )
                })}
            </tr>
        )
    })

    const renderedHeaders = config.map((config: any) => {
        return (
            <th className="p-6 text-left text-[10px] font-mono font-medium text-white/30 uppercase tracking-[0.2em]" key={config.label} >
                {config.label}
            </th>
        )
    })

    return (
        <div className="bg-white/[0.02] border border-white/10 w-full mb-8">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            {renderedHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        {renderrows}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Table