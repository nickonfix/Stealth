using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Stock
{
    public class FMPStock
    {
        // Root myDeserializedClass = JsonConvert.DeserializeObject<List<Root>>(myJsonResponse);
        public class Root
        {
            public string symbol { get; set; }
            public string name { get; set; }
            public string currency { get; set; }
            public string exchangeFullName { get; set; }
            public string exchange { get; set; }
        }



    }
}