using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Stock;
using api.Migrations;
using api.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace api.Mappers
{
    public static class StockMapper
    {
        public static StockDto ToStockDto(this Stock stockModel)
        {
            return new StockDto
            {
                Id = stockModel.Id,
                Symbol = stockModel.Symbol,
                CompanyName = stockModel.CompanyName,
                Industry = stockModel.Industry,
                LastDiv = stockModel.LastDiv,
                MarketCap = stockModel.MarketCap,
                Purchase = stockModel.Purchase,
                AnnualDiv = stockModel.AnnualDiv,
                Yield = stockModel.Yield,
                Comments = stockModel.Comments.Select(c => c.ToCommentDto()).ToList()
            };
        }
        //CREATE POST METHOD
        public static Stock ToStockFromCreateDTO(this CreateStockRequestDto StockDto)
        {
            return new Stock
            {
                Symbol = StockDto.Symbol,
                CompanyName = StockDto.CompanyName,
                Industry = StockDto.Industry,
                LastDiv = StockDto.LastDiv,
                MarketCap = StockDto.MarketCap,
                Purchase = StockDto.Purchase,
                AnnualDiv = StockDto.AnnualDiv,
                Yield = StockDto.Yield,

            };
        }
    }
}