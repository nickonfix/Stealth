using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Stock
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public string CompanyName { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal Purchase { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal LastDiv { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal AnnualDiv { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal Yield { get; set; }
        public string Industry { get; set; }
        public string Sector { get; set; }

        public List<Comment> Comments { get; set; }= new List<Comment>();
    }
}
