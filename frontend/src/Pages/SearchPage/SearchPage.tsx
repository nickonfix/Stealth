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

    const [dark, setDark] = useState<boolean>(() =>
        typeof window !== "undefined"
            ? localStorage.getItem("finarc-theme") === "dark" ||
              document.documentElement.classList.contains("dark")
            : false
    );

    useEffect(() => {
        const handler = (e: Event) => setDark((e as CustomEvent).detail.dark);
        window.addEventListener("finarc-theme-change", handler);
        return () => window.removeEventListener("finarc-theme-change", handler);
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
        <div style={{ background: dark ? "#070b0f" : "#f8fafc", minHeight: "100vh", transition: "background 0.3s" }}>
            <Search onSearchSubmit={onSearchSubmit} search={search} handleSearchChange={handleSearchChange} />
            <div className="max-w-[1280px] mx-auto px-10 pb-20">
                <ListPortfolio portfolioValues={portfolioValues || []} onPortfolioDelete={onPortfolioDelete} dark={dark} />
                <CardList searchResults={searchResult} onPortfolioCreate={onPortfolioCreate} dark={dark} />
                {serverError && <h1 className="text-red-500 text-center mt-4">{serverError}</h1>}
            </div>
        </div>
    )
}

export default SearchPage