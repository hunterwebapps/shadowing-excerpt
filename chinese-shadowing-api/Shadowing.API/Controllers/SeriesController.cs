using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shadowing.Business.Extensions;
using Shadowing.Business.Series;
using Shadowing.Models.Series.BindingModels;
using Shadowing.Models.Series.ViewModels;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Shadowing.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SeriesController : ControllerBase
    {
        private readonly SeriesManager seriesManager;
        private readonly ILogger<SeriesController> logger;

        public SeriesController(SeriesManager seriesManager, ILogger<SeriesController> logger)
        {
            this.seriesManager = seriesManager;
            this.logger = logger;
        }

        [HttpGet("{seriesId}", Name = nameof(GetSeries))]
        [ProducesResponseType(200, Type = typeof(SeriesDetails))]
        public async Task<IActionResult> GetSeries(string seriesId)
        {
            var series = await this.seriesManager.GetSeriesDetailsAsync(seriesId);

            return Ok(series);
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(List<SeriesDetails>))]
        public async Task<IActionResult> GetAllSeries()
        {
            var allSeries = await this.seriesManager.GetSeriesDetailsAsync();

            return Ok(allSeries);
        }

        [HttpPost("save-video")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(200, Type = typeof(string))]
        public async Task<IActionResult> SaveVideo([FromForm] IFormFile video)
        {
            var videoId = await this.seriesManager.SaveVideoAsync(video);
            
            return Ok(videoId);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(201, Type = typeof(SeriesDetails))]
        public async Task<IActionResult> CreateSeries(CreateSeries series)
        {
            try
            {
                var createdSeries = await this.seriesManager.CreateSeriesAsync(series);

                return CreatedAtRoute(
                    nameof(GetSeries),
                    new { seriesId = createdSeries.Id },
                    createdSeries);
            }
            catch (ConstraintException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
