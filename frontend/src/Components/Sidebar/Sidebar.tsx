import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
    const location = useLocation();
    
    const NAV_ITEMS = [
        { label: "Profile", path: "company-profile" },
        { label: "Income",  path: "income-statement" },
        { label: "Balance", path: "balance-sheet" },
        { label: "Cashflow", path: "cashflow-statement" },
    ];

    return (
        <nav className="w-full md:w-64 bg-transparent border-b md:border-b-0 md:border-r border-white/10 md:fixed md:top-0 md:bottom-0 md:left-0 z-20 pt-20">
            <div className="w-full h-full px-6 py-8">
                <div className="flex flex-col gap-1">
                    <h6 className="px-3 mb-4 text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Terminal / Navigation</h6>
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-3 py-3 font-mono text-[11px] uppercase tracking-[0.15em] transition-all duration-200 border-l-2 ${
                                    isActive 
                                    ? "text-white border-white bg-white/5" 
                                    : "text-white/40 border-transparent hover:text-white/70 hover:bg-white/[0.02]"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    )
}

export default Sidebar