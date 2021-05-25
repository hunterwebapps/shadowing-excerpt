using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shadowing.Business.Extensions;
using Shadowing.Business.Rooms;
using Shadowing.Models.Room.BindingModels;
using Shadowing.Models.Rooms.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Shadowing.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly RoomsManager roomsManager;
        private readonly ILogger<RoomsController> logger;

        public RoomsController(RoomsManager roomsManager, ILogger<RoomsController> logger)
        {
            this.roomsManager = roomsManager;
            this.logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(List<Room>))]
        public async Task<IActionResult> GetUserRooms()
        {
            var models = await this.roomsManager.GetRoomsAsync(User.GetUserId());

            return Ok(models);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{roomId}", Name = nameof(GetRoom))]
        [ProducesResponseType(200, Type = typeof(Room))]
        [ProducesResponseType(400, Type = typeof(string))]
        public async Task<IActionResult> GetRoom(string roomId)
        {
            var model = await this.roomsManager.GetRoomAsync(roomId);

            return Ok(model);
        }

        [HttpPost]
        [ProducesResponseType(201, Type = typeof(Room))]
        public async Task<IActionResult> CreateRoom(CreateRoom room)
        {
            var model = await this.roomsManager.CreateRoomAsync(room, User.GetUserId());

            return CreatedAtRoute(
                nameof(GetRoom),
                new { roomId = model.Id },
                model);
        }

        [HttpDelete("cancel/{roomId}")]
        [ProducesResponseType(200, Type = typeof(void))]
        [ProducesResponseType(400, Type = typeof(string))]
        public async Task<IActionResult> CancelRoom(string roomId)
        {
            var model = await this.roomsManager.CancelRoomAsync(roomId, User.GetUserId());

            return Ok(model);
        }

        [HttpDelete("complete/{roomId}")]
        [ProducesResponseType(200, Type = typeof(Room))]
        public async Task<IActionResult> CompleteRoom(string roomId)
        {
            var model = await this.roomsManager.CompleteRoomAsync(roomId);

            return Ok(model);
        }
    }
}
