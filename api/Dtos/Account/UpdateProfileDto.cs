using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Account
{
    public class UpdateProfileDto
    {
        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
