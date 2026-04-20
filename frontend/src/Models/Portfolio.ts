export type PortfolioGet = {
    id: number;
    symbol: string;
    companyName: string;
    purchase:number;
    lastDiv: number;
    Industry: string;
    marketcap: number;
    comment: any;
}

export type portfolioPost = {
    symbol: string;
    companyName: string;
    purchase:number;
    lastDiv: number;
    Industry: string;
    marketcap: number;
    comment: any;
}