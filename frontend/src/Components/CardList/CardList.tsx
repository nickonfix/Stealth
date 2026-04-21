import React, { SyntheticEvent } from 'react'
import Card from '../Card/Card'
import { CompanySearch } from '../../companyd';
import { v4 as uuidv4 } from 'uuid';
interface Props {
    searchResults: CompanySearch[]
    onPortfolioCreate: (e: SyntheticEvent) => void;
    dark?: boolean;
}

const CardList: React.FC<Props> = ({ searchResults, onPortfolioCreate, dark = false }: Props): React.JSX.Element => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {searchResults.length > 0 ? (
                searchResults.map((result) => (
                    <Card id={result.symbol} key={uuidv4()} searchResult={result} onPortfolioCreate={onPortfolioCreate} dark={dark} />
                ))
            ) : (
                <p className={`mb-3 mt-3 text-xl font-semibold text-center md:text-xl ${dark ? "text-gray-400" : "text-gray-900"}`}>
                    No results!
                </p>
            )}
        </div>
    )
}

export default CardList