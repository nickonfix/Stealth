using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Comment;

namespace api.Dtos.Stock
{
    public class StockDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [MaxLength(10, ErrorMessage = "Symbol cannot exceed 10 characters")]
        public string Symbol { get; set; }
        [Required]
        [MaxLength(100, ErrorMessage = "Company name cannot exceed 100 characters")]
        public string CompanyName { get; set; }
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Purchase cannot be negative")]
        public decimal Purchase { get; set; }
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "LastDiv cannot be negative")]
        public decimal LastDiv { get; set; }
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "AnnualDiv cannot be negative")]
        public decimal AnnualDiv { get; set; }
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Yield cannot be negative")]
        public decimal Yield { get; set; }
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "MarketCap cannot be negative")]
        public decimal MarketCap { get; set; }
        [Required]
        [MaxLength(10, ErrorMessage = "Industry cannot exceed 10 characters")]
        public string Industry { get; set; }

        //comments
        [Required]
        public List<CommentDto> Comments { get; set; }


    }
}