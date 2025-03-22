using System.Threading.Tasks;

namespace SmartBabyBackend.Services
{
    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(string base64String, string fileName);
        Task DeleteFileAsync(string fileUrl);
    }
} 