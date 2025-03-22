using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartBabyBackend.Data;
using SmartBabyBackend.DTOs;
using SmartBabyBackend.Models;

namespace SmartBabyBackend.Services
{
    public interface IUserProfileService
    {
        Task<UserProfile> GetProfileAsync(string userId);
        Task<UserProfile> UpdateProfileAsync(string userId, UpdateProfileDto updateDto);
        Task<string> UploadProfileImageAsync(string userId, string imageBase64);
    }

    public class UserProfileService : IUserProfileService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IFileStorageService _fileStorageService;

        public UserProfileService(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            IFileStorageService fileStorageService)
        {
            _context = context;
            _userManager = userManager;
            _fileStorageService = fileStorageService;
        }

        public async Task<UserProfile> GetProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("Felhasználó nem található");

            return new UserProfile
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                ProfileImageUrl = user.ProfileImageUrl,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }

        public async Task<UserProfile> UpdateProfileAsync(string userId, UpdateProfileDto updateDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("Felhasználó nem található");

            // Ellenőrizzük a jelszót, ha meg van adva
            if (!string.IsNullOrEmpty(updateDto.CurrentPassword) && !string.IsNullOrEmpty(updateDto.NewPassword))
            {
                var passwordCheck = await _userManager.CheckPasswordAsync(user, updateDto.CurrentPassword);
                if (!passwordCheck)
                    throw new Exception("Hibás jelenlegi jelszó");

                var result = await _userManager.ChangePasswordAsync(user, updateDto.CurrentPassword, updateDto.NewPassword);
                if (!result.Succeeded)
                    throw new Exception("A jelszó módosítása sikertelen");
            }

            // Frissítjük a profil adatokat
            user.FullName = updateDto.FullName;
            user.Email = updateDto.Email;
            user.UpdatedAt = DateTime.UtcNow;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                throw new Exception("A profil frissítése sikertelen");

            return await GetProfileAsync(userId);
        }

        public async Task<string> UploadProfileImageAsync(string userId, string imageBase64)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("Felhasználó nem található");

            // Töröljük a régi képet, ha létezik
            if (!string.IsNullOrEmpty(user.ProfileImageUrl))
            {
                await _fileStorageService.DeleteFileAsync(user.ProfileImageUrl);
            }

            // Feltöltjük az új képet
            var fileName = $"profile_{userId}_{DateTime.UtcNow.Ticks}.jpg";
            var imageUrl = await _fileStorageService.UploadFileAsync(imageBase64, fileName);

            // Frissítjük a felhasználó profil kép URL-jét
            user.ProfileImageUrl = imageUrl;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new Exception("A profil kép frissítése sikertelen");

            return imageUrl;
        }
    }
} 