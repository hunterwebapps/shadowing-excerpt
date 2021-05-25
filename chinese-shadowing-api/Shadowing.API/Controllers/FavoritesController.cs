using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shadowing.Business.Extensions;
using Shadowing.Business.Favorites;
using System.Threading.Tasks;

namespace Shadowing.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly FavoritesManager favoritesManager;

        public FavoritesController(FavoritesManager favoritesManager)
        {
            this.favoritesManager = favoritesManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            var models = await this.favoritesManager.GetFavoritesAsync(User.GetUserId());

            return Ok(models);
        }

        [HttpGet("toggle")]
        public async Task<IActionResult> ToggleFavoriteEpisode(string episodeId)
        {
            var isFavorite = await this.favoritesManager.ToggleFavoriteEpisodeAsync(episodeId, User.GetUserId());

            return Ok(isFavorite);
        }
    }
}
