using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace api.Controllers
{
    [Route("api/fmp")]
    [ApiController]
    public class FMPController : ControllerBase
    {
        private const string FmpBaseUrl = "https://financialmodelingprep.com/stable";
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public FMPController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _configuration = configuration;
        }

        [HttpGet("search-symbol")]
        public Task<IActionResult> SearchSymbol([FromQuery] string query, [FromQuery] int limit = 10)
        {
            return ForwardToFmpAsync("search-symbol", new Dictionary<string, string?>
            {
                ["query"] = query,
                ["limit"] = limit.ToString()
            });
        }

        [HttpGet("profile/{symbol}")]
        public Task<IActionResult> Profile([FromRoute] string symbol)
        {
            return ForwardToFmpAsync("profile", new Dictionary<string, string?>
            {
                ["symbol"] = symbol
            });
        }

        [HttpGet("key-metrics/{symbol}")]
        public Task<IActionResult> KeyMetrics([FromRoute] string symbol)
        {
            return ForwardToFmpAsync("key-metrics-ttm", new Dictionary<string, string?>
            {
                ["symbol"] = symbol
            });
        }

        [HttpGet("income-statement/{symbol}")]
        public Task<IActionResult> IncomeStatement([FromRoute] string symbol, [FromQuery] int limit = 2)
        {
            return ForwardToFmpAsync("income-statement", new Dictionary<string, string?>
            {
                ["symbol"] = symbol,
                ["limit"] = limit.ToString()
            });
        }

        [HttpGet("balance-sheet/{symbol}")]
        public Task<IActionResult> BalanceSheet([FromRoute] string symbol, [FromQuery] int limit = 2)
        {
            return ForwardToFmpAsync("balance-sheet-statement", new Dictionary<string, string?>
            {
                ["symbol"] = symbol,
                ["limit"] = limit.ToString()
            });
        }

        [HttpGet("cash-flow/{symbol}")]
        public Task<IActionResult> CashFlow([FromRoute] string symbol, [FromQuery] int limit = 2)
        {
            return ForwardToFmpAsync("cash-flow-statement", new Dictionary<string, string?>
            {
                ["symbol"] = symbol,
                ["limit"] = limit.ToString()
            });
        }

        private async Task<IActionResult> ForwardToFmpAsync(string endpoint, Dictionary<string, string?> parameters)
        {
            var apiKey = _configuration["FMPKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                return StatusCode(500, "FMPKey is not configured on server.");
            }

            parameters["apikey"] = apiKey;
            var queryString = string.Join("&",
                parameters
                    .Where(p => !string.IsNullOrWhiteSpace(p.Value))
                    .Select(p => $"{Uri.EscapeDataString(p.Key)}={Uri.EscapeDataString(p.Value!)}"));

            var url = $"{FmpBaseUrl}/{endpoint}?{queryString}";
            var response = await _httpClient.GetAsync(url);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, content);
            }

            if (string.IsNullOrWhiteSpace(content))
            {
                return Ok(Array.Empty<object>());
            }

            try
            {
                return Ok(JToken.Parse(content));
            }
            catch
            {
                return Ok(content);
            }
        }
    }
}
