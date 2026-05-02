import React, { SyntheticEvent } from 'react'
import Card from '../Card/Card'
import { CompanySearch } from '../../companyd';
import { v4 as uuidv4 } from 'uuid';
interface Props {
    searchResults: CompanySearch[]
    onPortfolioCreate: (e: SyntheticEvent) => void;
}

const CardList: React.FC<Props> = ({ searchResults, onPortfolioCreate }: Props): React.JSX.Element => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {searchResults.length > 0 ? (
                searchResults.map((result) => (
                    <Card id={result.symbol} key={uuidv4()} searchResult={result} onPortfolioCreate={onPortfolioCreate} />
                ))
            ) : (
                <p className="mb-3 mt-3 text-xl font-mono text-white/30 text-center uppercase tracking-widest">
                    No results!
                </p>
            )}
        </div>
    )
}

export default CardList