using System.ComponentModel.DataAnnotations;

namespace SmartBabyBackend.DTOs
{
    public class UpdateProfileDto
    {
        [Required]
        public string FullName { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        public string CurrentPassword { get; set; }
        
        [MinLength(6)]
        public string NewPassword { get; set; }
    }
} 