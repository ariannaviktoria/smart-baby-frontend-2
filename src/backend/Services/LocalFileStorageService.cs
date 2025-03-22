using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace SmartBabyBackend.Services
{
    public class LocalFileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string _uploadFolder;

        public LocalFileStorageService(IWebHostEnvironment environment)
        {
            _environment = environment;
            _uploadFolder = Path.Combine(_environment.WebRootPath, "uploads");
            
            if (!Directory.Exists(_uploadFolder))
            {
                Directory.CreateDirectory(_uploadFolder);
            }
        }

        public async Task<string> UploadFileAsync(string base64String, string fileName)
        {
            try
            {
                // Eltávolítjuk a base64 fejlécet, ha van
                if (base64String.Contains(","))
                {
                    base64String = base64String.Split(',')[1];
                }

                // Dekódoljuk a base64 stringet
                var fileBytes = Convert.FromBase64String(base64String);
                
                // Létrehozzuk a teljes fájl elérési útját
                var filePath = Path.Combine(_uploadFolder, fileName);
                
                // Írjuk a fájlt a lemezre
                await File.WriteAllBytesAsync(filePath, fileBytes);

                // Visszaadjuk a relatív URL-t
                return $"/uploads/{fileName}";
            }
            catch (Exception ex)
            {
                throw new Exception($"Hiba történt a fájl feltöltése során: {ex.Message}");
            }
        }

        public async Task DeleteFileAsync(string fileUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(fileUrl))
                    return;

                // Kinyerjük a fájl nevét az URL-ből
                var fileName = Path.GetFileName(fileUrl);
                if (string.IsNullOrEmpty(fileName))
                    return;

                var filePath = Path.Combine(_uploadFolder, fileName);
                
                if (File.Exists(filePath))
                {
                    await Task.Run(() => File.Delete(filePath));
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Hiba történt a fájl törlése során: {ex.Message}");
            }
        }
    }
} 