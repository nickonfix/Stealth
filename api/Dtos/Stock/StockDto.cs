using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Comment;

namespace api.Dtos.Stock
{
    public class StockDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public string CompanyName { get; set; }
        public decimal Purchase { get; set; }
        public decimal LastDiv { get; set; }
        public decimal AnnualDiv { get; set; }
        public decimal Yield { get; set; }
        public decimal MarketCap { get; set; }
        public string Industry { get; set; }

        //comments
        public List<CommentDto> Comments { get; set; }


    }
}