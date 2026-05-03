using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using api.Dtos.Portfolio;

namespace api.Interfaces
{
    public interface IPortfolioRepository
    {
        Task<List<PortfolioDto>> GetUserPortfolio(AppUser user);
        Task<Portfolio> CreateAsync(Portfolio portfolio);
        Task<Portfolio?> DeletePortfolio(AppUser appUser, string symbol);
        Task<Portfolio?> UpdateAsync(AppUser appUser, string symbol, int quantity, decimal purchasePrice);
    }
}