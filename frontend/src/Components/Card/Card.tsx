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
            className={`flex flex-col items-center justify-between w-full p-6 rounded-lg md:flex-row ${dark ? "bg-[#0f172a] border border-gray-800" : "bg-slate-100"}`}
            key={id}
            id={id}
        >
            <Link to={`/company/${searchResult.symbol}/company-profile`} className={`font-bold text-center md:text-left ${dark ? "text-gray-100 hover:text-emerald-400" : "text-black hover:text-emerald-600"}`}>
                {searchResult.name} ({searchResult.symbol})
            </Link>
            <p className={`${dark ? "text-gray-400" : "text-black"}`}>{searchResult.currency}</p>
            <p className={`font-bold ${dark ? "text-gray-300" : "text-black"}`}>
                {searchResult.exchange} - {searchResult.exchangeFullName}
            </p>
            <AddPortfolio
                onPortfolioCreate={onPortfolioCreate}
                symbol={searchResult.symbol}
            />
        </div>


    )
}

export default Card