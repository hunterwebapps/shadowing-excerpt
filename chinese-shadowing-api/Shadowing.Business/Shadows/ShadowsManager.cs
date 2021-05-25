using AutoMapper;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.EntityFrameworkCore;
using Shadowing.DataAccess;
using Shadowing.Models.Shadows.BindingModels;
using Shadowing.Models.Shadows.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entities = Shadowing.DataAccess.Entities;

namespace Shadowing.Business.Shadows
{
    public class ShadowsManager
    {
        private readonly ApplicationDbContext dbContext;
        private readonly BlobServiceClient storageClient;
        private readonly IMapper mapper;

        public ShadowsManager(ApplicationDbContext dbContext, BlobServiceClient storageClient, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.storageClient = storageClient;
            this.mapper = mapper;
        }

        public async Task<Shadow> GetShadowAsync(string shadowId)
        {
            var entity = await this.dbContext.Shadows.FindAsync(shadowId);

            return this.mapper.Map<Shadow>(entity);
        }

        public async Task<List<Shadow>> GetRoomShadowsAsync(string roomId, string userId)
        {
            var entities = await this.dbContext.Shadows
                .Where(x =>
                    x.RoomId == roomId &&
                    x.Room.UserPersonas.Any(y => y.UserId == userId))
                .ToListAsync();

            return this.mapper.Map<List<Shadow>>(entities);
        }

        public async Task<string> SaveRecordingAsync(SaveRecording saveRecording)
        {
            var containerClient = this.storageClient.GetBlobContainerClient("recordings");
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

            var blobKey = this.MakeRecordingKey(saveRecording.RoomId, saveRecording.SectionId);

            var blobClient = containerClient.GetBlobClient(blobKey);

            await using var stream = saveRecording.Recording.OpenReadStream();

            await blobClient.UploadAsync(stream, overwrite: true);

            return blobClient.Uri.AbsoluteUri;
        }

        public async Task<Shadow> CreateShadowAsync(CreateShadow shadow)
        {
            var entity = new Entities.Shadow()
            {
                Id = Guid.NewGuid().ToString(),
                RoomId = shadow.RoomId,
                SectionId = shadow.SectionId,
                InferenceText = shadow.InferenceText,
                RecordedUrl = shadow.RecordingUrl,
                Created = DateTime.UtcNow,
            };

            await this.dbContext.Shadows.AddAsync(entity);

            await this.dbContext.SaveChangesAsync();

            return this.mapper.Map<Shadow>(entity);
        }

        private string MakeRecordingKey(string roomId, string sectionId)
        {
            return $"{roomId}_{sectionId}.mp3";
        }
    }
}
