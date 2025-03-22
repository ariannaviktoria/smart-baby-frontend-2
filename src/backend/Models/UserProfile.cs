using System;
using System.ComponentModel.DataAnnotations;

namespace SmartBabyBackend.Models
{
    public class UserProfile
    {
        public string Id { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string FullName { get; set; }
        
        public string ProfileImageUrl { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
    }
} 