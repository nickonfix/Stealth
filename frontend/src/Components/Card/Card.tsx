import React, { SyntheticEvent } from 'react'
import "./Card.css"
import { CompanySearch } from '../../companyd';
import AddPortfolio from '../Portfolio/AddPortfolio/AddPortfolio';
import { Link } from 'react-router-dom';

interface Props {
    id: string;
    searchResult: CompanySearch;
    onPortfolioCreate: (e: SyntheticEvent) => void;
    dark?: boolean;
}

const Card: React.FC<Props> = ({ id, searchResult, onPortfolioCreate, dark = false }: Props): React.JSX.Element => {
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-12 items-center w-full p-4 mb-3 rounded-xl transition-all duration-200 border ${
                dark 
                ? "bg-[#0f172a] border-gray-800 hover:border-emerald-500/40 hover:bg-[#131c2c]" 
                : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200"
            }`}
            key={id}
            id={id}
        >
            {/* Column 1: Symbol & Name */}
            <div className="md:col-span-5 flex items-center gap-4">
                <div className={`flex flex-col`}>
                    <Link 
                        to={`/company/${searchResult.symbol}/company-profile`} 
                        className={`font-bold text-lg leading-tight transition-colors ${dark ? "text-white hover:text-emerald-400" : "text-gray-900 hover:text-emerald-600"}`}
                    >
                        {searchResult.symbol}
                    </Link>
                    <span className={`text-xs truncate max-w-[240px] ${dark ? "text-gray-500" : "text-gray-500"}`}>
                        {searchResult.name}
                    </span>
                </div>
            </div>

            {/* Column 2: Currency */}
            <div className="md:col-span-2 hidden md:flex items-center">
                <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${
                    dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                }`}>
                    {searchResult.currency}
                </span>
            </div>

            {/* Column 3: Exchange */}
            <div className="md:col-span-3 hidden md:flex flex-col">
                <span className={`text-xs font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>
                    {searchResult.exchange}
                </span>
                <span className={`text-[10px] uppercase tracking-tighter ${dark ? "text-gray-500" : "text-gray-400"}`}>
                    {searchResult.exchangeFullName}
                </span>
            </div>

            {/* Column 4: Add Button */}
            <div className="md:col-span-2 flex justify-end mt-4 md:mt-0">
                <AddPortfolio
                    onPortfolioCreate={onPortfolioCreate}
                    symbol={searchResult.symbol}
                    dark={dark}
                />
            </div>
        </div>
    )
}

export default Card