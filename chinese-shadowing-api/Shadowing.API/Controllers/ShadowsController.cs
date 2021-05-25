using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shadowing.Business.Extensions;
using Shadowing.Business.Shadows;
using Shadowing.Models.Shadows.BindingModels;
using Shadowing.Models.Shadows.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shadowing.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ShadowsController : ControllerBase
    {
        private readonly ShadowsManager shadowsManager;

        public ShadowsController(ShadowsManager shadowsManager)
        {
            this.shadowsManager = shadowsManager;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("single/{shadowId}", Name = nameof(GetShadow))]
        [ProducesResponseType(200, Type = typeof(Shadow))]
        public async Task<IActionResult> GetShadow(string shadowId)
        {
            var model = await this.shadowsManager.GetShadowAsync(shadowId);

            return Ok(model);
        }

        [HttpGet("{roomId}")]
        [ProducesResponseType(200, Type = typeof(List<Shadow>))]
        public async Task<IActionResult> GetRoomShadows(string roomId)
        {
            var models = await this.shadowsManager.GetRoomShadowsAsync(roomId, User.GetUserId());

            return Ok(models);
        }

        [HttpPost("recording")]
        [ProducesResponseType(200, Type = typeof(string))]
        public async Task<IActionResult> SaveShadowRecording([FromForm] SaveRecording saveRecording)
        {
            var recordingUrl = await this.shadowsManager.SaveRecordingAsync(saveRecording);

            return Ok(recordingUrl);
        }

        [HttpPost]
        [ProducesResponseType(201, Type = typeof(Shadow))]
        public async Task<IActionResult> CreateShadow(CreateShadow shadow)
        {
            var model = await this.shadowsManager.CreateShadowAsync(shadow);

            return CreatedAtRoute(
                nameof(GetShadow),
                new { shadowId = model.Id },
                model);
        }
    }
}
