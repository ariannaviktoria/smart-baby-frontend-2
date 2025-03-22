using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

namespace backend
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            // Regisztráljuk a profil kezeléshez szükséges szolgáltatásokat
            services.AddScoped<IUserProfileService, UserProfileService>();
            services.AddScoped<IFileStorageService, LocalFileStorageService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Engedélyezzük a statikus fájlok kiszolgálását
            app.UseStaticFiles();
        }
    }
} 