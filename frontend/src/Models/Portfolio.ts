export type PortfolioGet = {
    id: number;
    symbol: string;
    companyName: string;
    purchase:number;
    lastDiv: number;
    Industry: string;
    marketcap: number;
    comment: any;
    quantity: number;
    purchasePrice: number;
}

export type portfolioPost = {
    symbol: string;
    companyName: string;
    purchase:number;
    lastDiv: number;
    Industry: string;
    marketcap: number;
    comment: any;
    quantity?: number;
    purchasePrice?: number;
}