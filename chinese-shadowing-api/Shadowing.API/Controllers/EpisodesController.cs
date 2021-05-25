using Microsoft.AspNetCore.Mvc;
using Shadowing.Business.Episodes;
using Shadowing.Business.Extensions;
using System.Threading.Tasks;

namespace Shadowing.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EpisodesController : ControllerBase
    {
        private readonly EpisodesManager episodesManager;

        public EpisodesController(EpisodesManager episodesManager)
        {
            this.episodesManager = episodesManager;
        }
    }
}
