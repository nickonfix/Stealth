using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace api.Helpers
{
    public class CommentQueryObject
    {
        public string? Symbol { get; set; }

        public bool IsDecending { get; set; } = true;
        public string? Content { get; set; }
    }
}