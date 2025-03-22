using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBabyBackend.DTOs;
using SmartBabyBackend.Models;
using SmartBabyBackend.Services;

namespace SmartBabyBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _profileService;

        public UserProfileController(IUserProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet]
        public async Task<ActionResult<UserProfile>> GetProfile()
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                var profile = await _profileService.GetProfileAsync(userId);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut]
        public async Task<ActionResult<UserProfile>> UpdateProfile([FromBody] UpdateProfileDto updateDto)
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                var profile = await _profileService.UpdateProfileAsync(userId, updateDto);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("image")]
        public async Task<ActionResult<{ imageUrl: string }>> UploadProfileImage([FromBody] { image: string } request)
        {
            try
            {
                var userId = User.FindFirst("sub")?.Value;
                var imageUrl = await _profileService.UploadProfileImageAsync(userId, request.image);
                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
} 