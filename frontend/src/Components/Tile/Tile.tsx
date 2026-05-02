import React from 'react'

type Props = {
    title: string;
    subtitle: string | number;
}

const Tile = ({ title, subtitle }: Props) => {
    return (
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
            <div className="relative flex flex-col min-w-0 bg-white/[0.02] border border-white/10 p-6 transition-all duration-300 hover:bg-white/[0.04]">
                <h5 className="text-white/30 uppercase font-mono text-[10px] tracking-[0.2em] mb-4">
                    {title}
                </h5>
                <span className="font-mono text-lg font-light text-white tracking-tight">
                    {subtitle}
                </span>
            </div>
        </div>
    )
}

export default Tile