import React, { SyntheticEvent } from 'react'
import "./Card.css"
import { CompanySearch } from '../../companyd';
import AddPortfolio from '../Portfolio/AddPortfolio/AddPortfolio';
import { Link } from 'react-router-dom';

interface Props {
    id: string;
    searchResult: CompanySearch;
    onPortfolioCreate: (e: SyntheticEvent) => void;
}

const Card: React.FC<Props> = ({ id, searchResult, onPortfolioCreate }: Props): React.JSX.Element => {
    return (
        <div
            className="grid grid-cols-1 md:grid-cols-12 items-center w-full p-6 mb-4 transition-all duration-200 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] group"
            key={id}
            id={id}
            style={{ borderRadius: 0 }}
        >
            {/* Column 1: Symbol & Name */}
            <div className="md:col-span-5 flex items-center gap-4">
                <div className="flex flex-col">
                    <Link 
                        to={`/company/${searchResult.symbol}/company-profile`} 
                        className="font-mono text-xl font-light text-white hover:text-white/70 transition-colors uppercase tracking-tight"
                    >
                        {searchResult.symbol}
                    </Link>
                    <span className="text-[11px] text-white/40 font-sans uppercase tracking-wider truncate max-w-[240px]">
                        {searchResult.name}
                    </span>
                </div>
            </div>

            {/* Column 2: Currency */}
            <div className="md:col-span-2 hidden md:flex items-center">
                <span className="px-2 py-0.5 border border-white/20 text-[10px] font-mono text-white/50 uppercase tracking-widest">
                    {searchResult.currency}
                </span>
            </div>

            {/* Column 3: Exchange */}
            <div className="md:col-span-3 hidden md:flex flex-col">
                <span className="text-[11px] font-mono text-white/60 uppercase">
                    {searchResult.exchange}
                </span>
                <span className="text-[9px] text-white/30 uppercase tracking-[0.1em]">
                    {searchResult.exchangeFullName}
                </span>
            </div>

            {/* Column 4: Add Button */}
            <div className="md:col-span-2 flex justify-end mt-4 md:mt-0">
                <AddPortfolio
                    onPortfolioCreate={onPortfolioCreate}
                    symbol={searchResult.symbol}
                />
            </div>
        </div>
    )
}

export default Card