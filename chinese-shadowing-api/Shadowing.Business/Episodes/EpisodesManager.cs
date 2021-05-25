using Microsoft.EntityFrameworkCore;
using Shadowing.DataAccess;
using Shadowing.Models.Episode.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using entities = Shadowing.DataAccess.Entities;

namespace Shadowing.Business.Episodes
{
    public class EpisodesManager
    {
        private readonly ApplicationDbContext dbContext;

        public EpisodesManager(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<bool> CheckUrlTitleExistsAsync(IEnumerable<string> urlTitles)
        {
            var titlesExists = await this.dbContext.Episodes.AnyAsync(x => urlTitles.Contains(x.UrlTitle));

            return titlesExists;
        }
    }
}
