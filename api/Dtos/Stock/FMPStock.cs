using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Stock
{
    public class FMPStock
    {
        public string symbol { get; set; }
        public string companyName { get; set; }
        public double price { get; set; }
        public string range { get; set; }
        public double changes { get; set; }
        public string industry { get; set; }
        public string description { get; set; }
        public long mktCap { get; set; }
        public double lastDiv { get; set; }
        public double annualDiv { get; set; }
        public double dcf { get; set; }
        public string sector { get; set; }
    }
}