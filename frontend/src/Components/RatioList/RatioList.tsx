import React from 'react'

type Props = {
    config: any;
    data: any;
}



const RatioList = ({ config, data }: Props) => {
    const renderRows = config.map((row: any) => {
        return (
            <li className="py-6" key={row.label}>
                <div className="flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-[11px] font-mono font-medium text-white/40 uppercase tracking-[0.1em] mb-1">{row.label}</p>
                        <p className="text-xs text-white/20 font-sans">
                            {row.subtitle || row.subTitle}
                        </p>
                    </div>
                    <div className="font-mono text-lg font-light text-white tracking-tight">
                        {row.render(data)}
                    </div>
                </div>
            </li>

        )
    })
    return (
        <div className="bg-white/[0.02] border border-white/10 mb-6 p-6 h-full w-full">
            <ul className="divide-y divide-white/5">
                {renderRows}
            </ul>
        </div>
    )
}

export default RatioList