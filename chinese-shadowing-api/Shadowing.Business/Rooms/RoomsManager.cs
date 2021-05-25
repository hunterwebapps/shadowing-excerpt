using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Shadowing.DataAccess;
using Shadowing.Models.Room.BindingModels;
using Shadowing.Models.Rooms.Enums;
using Shadowing.Models.Rooms.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entities = Shadowing.DataAccess.Entities;

namespace Shadowing.Business.Rooms
{
    public class RoomsManager
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IMapper mapper;

        public RoomsManager(ApplicationDbContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<Room> GetRoomAsync(string roomId)
        {
            var entity = await this.dbContext.Rooms
                .Include(x => x.UserPersonas)
                .Include(x => x.Shadows)
                .SingleAsync(x => x.Id == roomId);

            var model = this.mapper.Map<Room>(entity);

            return model;
        }

        public async Task<List<Room>> GetRoomsAsync(string userId)
        {
            var entity = await this.dbContext.Rooms
                .Include(x => x.UserPersonas)
                .Include(x => x.Shadows)
                .Where(x => x.UserPersonas.Any(up => up.UserId == userId))
                .ToListAsync();

            var models = this.mapper.Map<List<Room>>(entity);

            return models;
        }

        public async Task<Room> CreateRoomAsync(CreateRoom room, string userId)
        {
            var episodeRoomExists = await this.dbContext.UserPersonas
                .AnyAsync(x =>
                    x.Room.State == RoomState.Active.ToString() &&
                    x.Room.EpisodeId == room.EpisodeId &&
                    x.UserId == userId);

            if (episodeRoomExists)
            {
                throw new ConstraintException("Room Already Active");
            }

            var entity = new Entities.Room()
            {
                Id = Guid.NewGuid().ToString(),
                EpisodeId = room.EpisodeId,
                Created = DateTime.UtcNow,
                UserPersonas = room.PersonaIds
                    .Select(personaId => new Entities.UserPersona()
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserId = userId,
                        PersonaId = personaId,
                        Created = DateTime.UtcNow,
                    })
                    .ToList(),
                State = RoomState.Active.ToString(),
                CreatedById = userId,
            };

            await this.dbContext.AddAsync(entity);
            await this.dbContext.SaveChangesAsync();

            var model = this.mapper.Map<Room>(entity);

            return model;
        }

        public async Task<Room> CompleteRoomAsync(string roomId)
        {
            var entity = await this.dbContext.Rooms
                .Include(x => x.Episode)
                .ThenInclude(x => x.Sections)
                .Include(x => x.Shadows)
                .SingleAsync(x => x.Id == roomId);

            var isSectionsCompleted = entity.Shadows.Count == entity.Episode.Sections.Count;

            if (!isSectionsCompleted)
            {
                throw new ConstraintException("Shadow Count Doesn't Match Section Count");
            }

            entity.State = RoomState.Completed.ToString();

            await this.dbContext.SaveChangesAsync();

            return this.mapper.Map<Room>(entity);
        }

        public async Task<Room> CancelRoomAsync(string roomId, string userId)
        {
            var entity = await this.dbContext.Rooms
                .SingleAsync(x =>
                    x.Id == roomId &&
                    x.CreatedById == userId);

            if (entity.State == RoomState.Active.ToString())
            {
                entity.State = RoomState.Cancelled.ToString();

                await this.dbContext.SaveChangesAsync();
            }

            return this.mapper.Map<Room>(entity);
        }
    }
}
