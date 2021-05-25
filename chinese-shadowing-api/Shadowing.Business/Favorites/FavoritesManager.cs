using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Shadowing.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using entities = Shadowing.DataAccess.Entities;

namespace Shadowing.Business.Favorites
{
    public class FavoritesManager
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IMapper mapper;

        public FavoritesManager(ApplicationDbContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<List<string>> GetFavoritesAsync(string userId)
        {
            var episodeIds = await this.dbContext.Favorites
                .Where(x => x.UserId == userId)
                .Select(x => x.EpisodeId)
                .ToListAsync();

            return episodeIds;
        }

        public async Task<bool> ToggleFavoriteEpisodeAsync(string episodeId, string userId)
        {
            var favoriteEpisode = await this.dbContext.Favorites
                .SingleOrDefaultAsync(x => x.UserId == userId && x.EpisodeId == episodeId);

            var isFavorited = favoriteEpisode != null;

            if (isFavorited)
            {
                this.dbContext.Favorites.Remove(favoriteEpisode);
            }
            else
            {
                await this.dbContext.Favorites.AddAsync(new entities.Favorite()
                {
                    Id = Guid.NewGuid().ToString(),
                    EpisodeId = episodeId,
                    UserId = userId,
                    Created = DateTime.UtcNow,
                });
            }

            await this.dbContext.SaveChangesAsync();

            return !isFavorited;
        }
    }
}
