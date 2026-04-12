using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace api.Dtos.Stock
{
    public class CreateStockRequestDto
    {
        [Required]
        [MaxLength(10, ErrorMessage = "Symbol cannot exceed 10 characters")]
        public string Symbol { get; set; }
        [Required]
        [MaxLength(10, ErrorMessage = "Company name cannot exceed 10 characters")]
        public string CompanyName { get; set; }
        [Required]
        [Range(0, 10000000, ErrorMessage = "Purchase cannot be negative")]
        public decimal Purchase { get; set; }
        [Required]
        [Range(0, 10000000, ErrorMessage = "LastDiv cannot be negative")]
        public decimal LastDiv { get; set; }
        [Required]
        [Range(0, 10000000, ErrorMessage = "AnnualDiv cannot be negative")]
        public decimal AnnualDiv { get; set; }
        [Required]
        [Range(0, 10000000, ErrorMessage = "Yield cannot be negative")]
        public decimal Yield { get; set; }
        [Required]
        [Range(0, 10000000000, ErrorMessage = "MarketCap cannot be negative")]
        public decimal MarketCap { get; set; }
        [Required]
        [MaxLength(10, ErrorMessage = "Industry cannot exceed 10 characters")]
        public string Industry { get; set; }

    }
}