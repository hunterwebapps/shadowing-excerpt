using AutoMapper;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Shadowing.Business.Images;
using Shadowing.DataAccess;
using Shadowing.Models.User.BindingModels;
using Shadowing.Models.User.ViewModels;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using entities = Shadowing.DataAccess.Entities;

namespace Shadowing.Business.Users
{
    public class UserManager
    {
        private readonly ApplicationDbContext dbContext;
        private readonly BlobServiceClient storageClient;
        private readonly IMapper mapper;

        const string avatarContainerName = "avatars";

        public UserManager(ApplicationDbContext dbContext, BlobServiceClient storageClient, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.storageClient = storageClient;
            this.mapper = mapper;
        }

        public async Task<User> GetUserAsync(string userId, bool includeRoles)
        {
            var query = this.dbContext.Users
                .Where(u => u.Id == userId);

            if (includeRoles)
            {
                query = query.Include(u => u.UserRoles);
            }

            var entity = await query.SingleOrDefaultAsync();

            if (entity == null)
            {
                return null;
            }

            return this.mapper.Map<User>(entity);
        }

        public async Task<List<User>> GetUsersAsync()
        {
            var entities = await this.dbContext.Users.ToListAsync();

            return this.mapper.Map<List<User>>(entities);
        }

        public async Task<User> UpdatePersonalAsync(UpdatePersonal updatePersonal, string userId)
        {
            var user = await this.dbContext.Users.FindAsync(userId);

            if (updatePersonal.Avatar.StartsWith("data:image/"))
            {
                await this.UpdateAvatarAsync(updatePersonal.Avatar, user);
            }

            user.DisplayName = updatePersonal.DisplayName;
            user.Gender = updatePersonal.Gender.ToString();

            await this.dbContext.SaveChangesAsync();

            return this.mapper.Map<User>(user);
        }

        private async Task UpdateAvatarAsync(string avatarBase64, entities.User user)
        {
            var bytes = Convert.FromBase64String(avatarBase64.Split(',')[1]);

            await using var memoryStream = new MemoryStream(bytes);

            var image = Image.FromStream(memoryStream);

            memoryStream.Position = 0;
            memoryStream.SetLength(0);

            var resizer = new ImageResizer();
            
            using var avatar = resizer.ResizeImage(image, 120, 120);

            avatar.Save(memoryStream, ImageFormat.Jpeg);

            memoryStream.Position = 0;

            var containerClient = this.storageClient.GetBlobContainerClient(avatarContainerName);
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

            var avatarFileName = $"{Guid.NewGuid()}.jpg";

            var avatarBlobClient = containerClient.GetBlobClient(avatarFileName);

            await avatarBlobClient.UploadAsync(memoryStream);

            var oldAvatar = user.AvatarUrl;

            user.AvatarUrl = avatarBlobClient.Uri.AbsoluteUri;

            if (oldAvatar != null)
            {
                var uri = new Uri(oldAvatar);
                await containerClient
                    .GetBlobClient(Path.GetFileName(uri.LocalPath))
                    .DeleteAsync(DeleteSnapshotsOption.IncludeSnapshots);
            }
        }
    }
}
