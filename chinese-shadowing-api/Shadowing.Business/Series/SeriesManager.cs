using AutoMapper;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Shadowing.Business.Episodes;
using Shadowing.DataAccess;
using Shadowing.Models.Series.BindingModels;
using Shadowing.Models.Series.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Entities = Shadowing.DataAccess.Entities;

namespace Shadowing.Business.Series
{
    public class SeriesManager
    {
        private readonly ApplicationDbContext dbContext;
        private readonly BlobServiceClient storageClient;
        private readonly EpisodesManager episodesManager;
        private readonly IMapper mapper;

        public SeriesManager(ApplicationDbContext dbContext, BlobServiceClient storageClient, EpisodesManager episodesManager, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.storageClient = storageClient;
            this.episodesManager = episodesManager;
            this.mapper = mapper;
        }

        public async Task<SeriesDetails> GetSeriesDetailsAsync(string seriesId)
        {
            var entity = await this.dbContext.Series
                .Include(x => x.Episodes)
                .ThenInclude(x => x.Sections)
                .ThenInclude(x => x.Persona)
                .SingleAsync(x => x.Id == seriesId);

            var viewModel = this.mapper.Map<SeriesDetails>(entity);

            return viewModel;
        }

        public async Task<List<SeriesDetails>> GetSeriesDetailsAsync()
        {
            var entities = await this.dbContext.Series
                .Include(x => x.Episodes)
                .ThenInclude(x => x.Sections)
                .ThenInclude(x => x.Persona)
                .ToListAsync();

            var viewModels = this.mapper.Map<List<SeriesDetails>>(entities);

            return viewModels;
        }

        public async Task<string> SaveVideoAsync(IFormFile video)
        {
            var containerClient = this.storageClient.GetBlobContainerClient("videos");
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

            var videoId = Guid.NewGuid().ToString();
            var blobClient = containerClient.GetBlobClient($"{videoId}.mp4");

            await using var stream = video.OpenReadStream();

            await blobClient.UploadAsync(stream);

            return videoId;
        }

        public async Task<SeriesDetails> CreateSeriesAsync(CreateSeries series)
        {
            var seriesUrlTitle = SeriesCreator.GetUrlTitle(series.Title);
            var seriesTitleExists = await CheckUrlTitleExistsAsync(seriesUrlTitle);

            var episodesUrlTitles = series.Episodes.Select((episode) => SeriesCreator.GetUrlTitle(episode.Title));
            var urlTitlesExists = await this.episodesManager.CheckUrlTitleExistsAsync(episodesUrlTitles);

            if (seriesTitleExists || urlTitlesExists)
            {
                throw new ConstraintException("Series Title or Episode Title(s) Already Exist.");
            }

            var seriesCreator = new SeriesCreator(this.storageClient, series.VideoId);

            var seriesEntity = await seriesCreator.CreateAsync(series);

            var personaEntities = series.Personas
                .Select(persona => new Entities.Persona()
                {
                    Id = persona.Id,
                    Name = persona.Name,
                    Gender = persona.Gender.ToString(),
                    Created = DateTime.UtcNow,
                })
                .ToList();

            await using var transaction = await this.dbContext.Database.BeginTransactionAsync();

            await this.dbContext.Personas.AddRangeAsync(personaEntities);
            await this.dbContext.Series.AddAsync(seriesEntity);
            await this.dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            await seriesCreator.CleanupAsync();

            var viewModel = this.mapper.Map<SeriesDetails>(seriesEntity);

            return viewModel;
        }

        public async Task<bool> CheckUrlTitleExistsAsync(string title)
        {
            var titleExists = await this.dbContext.Series.AnyAsync(x => x.Title == title);

            return titleExists;
        }
    }
}
