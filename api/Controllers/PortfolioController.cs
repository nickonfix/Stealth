using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Extensions;
using api.Interfaces;
using api.Models;
using api.Repository;
using api.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/portfolio")]
    [ApiController]

    public class PortfolioController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IStockRepository _stockRepository;

        private readonly IPortfolioRepository _portfolioRepository;
        private readonly IFMPService _fMPService;
        public PortfolioController(UserManager<AppUser> userManager,
        IStockRepository stockRepository, IPortfolioRepository portfolioRepository, IFMPService fMPService)
        {
            _userManager = userManager;
            _stockRepository = stockRepository;
            _portfolioRepository = portfolioRepository;
            _fMPService = fMPService;
        }


        [HttpGet]
        [Authorize]


        public async Task<IActionResult> GetUserPortfolio()
        {
            var username = User.GetUsername();
            Console.WriteLine($">>> USERNAME: [{username}]");

            var appUser = await _userManager.FindByNameAsync(username);
            Console.WriteLine($">>> APP USER: [{appUser?.UserName}] ID: [{appUser?.Id}]");

            if (appUser == null) return NotFound("User not found in DB");

            var userPortfolio = await _portfolioRepository.GetUserPortfolio(appUser);
            Console.WriteLine($">>> PORTFOLIO COUNT: [{userPortfolio.Count}]");

            return Ok(userPortfolio);
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddPortfolio(string symbol)
        {
            var username = User.GetUsername();
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var appUser = await _userManager.FindByNameAsync(username);
            if (appUser == null) return NotFound("User not found");

            var stock = await _stockRepository.GetBySymbolAsync(symbol);

            if (stock == null)
            {
                stock = await _fMPService.FindStockBySymbolAsync(symbol);
                if (stock == null)
                {
                    return BadRequest("Stock does not exist");
                }
                else
                {
                    await _stockRepository.CreateAsync(stock);
                }
            }

            var userPortfolio = await _portfolioRepository.GetUserPortfolio(appUser);

            if (userPortfolio.Any(e => e.Symbol.ToLower() == symbol.ToLower())) return BadRequest("Cannot add same stock to portfolio");

            var portfolioModel = new Portfolio
            {
                StockId = stock.Id,
                AppUserId = appUser.Id
            };

            await _portfolioRepository.CreateAsync(portfolioModel);

            if (portfolioModel == null)
            {
                return StatusCode(500, "Could not create");
            }
            else
            {
                return Created();
            }
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeletePortfolio(string symbol)
        {
            var username = User.GetUsername();
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var appUser = await _userManager.FindByNameAsync(username);
            if (appUser == null) return NotFound("User not found");

            var userPortfolio = await _portfolioRepository.GetUserPortfolio(appUser);
            var filteredStock = userPortfolio.Where(s => s.Symbol.ToLower() == symbol.ToLower()).ToList();

            if (filteredStock.Count() == 1)
            {
                await _portfolioRepository.DeletePortfolio(appUser, symbol);
            }
            else
            {
                return BadRequest("Stock not in your portfolio");
            }

            return Ok();
        }

    }
}