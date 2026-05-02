import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'
import { CompanySearch } from '../../companyd';
import { searchCompaines } from '../../api';
import Search from '../../Components/Search/Search';
import ListPortfolio from '../../Components/Portfolio/ListPortfolio/ListPortfolio';
import CardList from '../../Components/CardList/CardList';
import { PortfolioGet } from '../../Models/Portfolio';
import { portfolioAddAPI, portfolioDeleteAPI, portfolioGetAPI } from '../../Services/PortfolioService';
import { toast } from 'react-toastify';

interface Props { }

const SearchPage = (props: Props) => {
    const [search, setsearch] = useState<string>("");
    const [portfolioValues, setPortfolioValues] = useState<PortfolioGet[] | null>(null);

    const [searchResult, setSearchResult] = useState<CompanySearch[]>([]);
    const [serverError, setServerError] = useState<string>("");

    const dark = true;

    // Enforce dark mode globally
    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setsearch(e.target.value);
        console.log(e);
    };

    useEffect(()=>{
        getPortfolio();
    },[])

    const getPortfolio = () => {
        portfolioGetAPI().then((res) => {
            if(res){
                setPortfolioValues(res?.data);
            }
        }).catch(e => toast.warning("Coundn't get portfolio values!"))
    }

    const onSearchSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        const result = await searchCompaines(search)
        if (typeof result == "string") {
            setServerError(result);
        }
        else if (Array.isArray(result)) {
            setSearchResult(result);
        }
        console.log(result);
    };

    const onPortfolioCreate = (e: any) => {
        e.preventDefault();
        portfolioAddAPI(e.target[0].value).then((res) => {
            if(res?.status ===204){
                toast.success("stock  added to Portfolio successfully!");
                getPortfolio();
            }
        }).catch(e => toast.warning("Coundn't add stock to portfolio!"))
    };

    const onPortfolioDelete = (e: any) => {
        e.preventDefault();
        portfolioDeleteAPI(e.target[0].value).then((res) => {
            if(res?.status ===200){
                toast.success("stock  deleted from Portfolio successfully!");
                getPortfolio();
            }
        }).catch(e => toast.warning("Coundn't delete stock from portfolio!"))
    };
    return (
        <div style={{ background: "#1f2228", minHeight: "100vh" }}>
            <Search onSearchSubmit={onSearchSubmit} search={search} handleSearchChange={handleSearchChange} />
            
            <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-24 -mt-12 relative z-10">
                {/* Watchlist Section */}
                <div className="mb-12">
                    <ListPortfolio portfolioValues={portfolioValues || []} onPortfolioDelete={onPortfolioDelete} dark={true} />
                </div>

                {/* Search Results Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <h2 className="text-xl font-mono font-light text-white uppercase tracking-tight">
                            {searchResult.length > 0 ? "Search Results" : ""}
                        </h2>
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em]">
                            {searchResult.length > 0 ? `${searchResult.length} Companies Found` : ""}
                        </span>
                    </div>
                    <CardList searchResults={searchResult} onPortfolioCreate={onPortfolioCreate} dark={true} />
                </div>

                {serverError && (
                    <div className="mt-12 p-6 bg-red-500/5 border border-red-500/20 text-center">
                        <h1 className="text-red-500 font-mono text-sm uppercase tracking-wider">{serverError}</h1>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchPage