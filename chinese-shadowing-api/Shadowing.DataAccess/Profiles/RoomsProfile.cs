using AutoMapper;
using Shadowing.Models.Rooms.Enums;
using Shadowing.Models.Rooms.ViewModels;
using Shadowing.Models.Shadows.ViewModels;
using Shadowing.Models.UserPersonas.ViewModels;
using System;
using System.Collections.Generic;

namespace Shadowing.DataAccess.Profiles
{
    public class RoomsProfile : Profile
    {
        public RoomsProfile()
        {
            MapEntitiesToViewModels();
        }

        private void MapEntitiesToViewModels()
        {
            CreateMap<Entities.Room, Room>().ConvertUsing((entity, _, context) => MapRoomEntityToRoomViewModel(entity, context.Mapper));
        }

        private Room MapRoomEntityToRoomViewModel(Entities.Room entity, IRuntimeMapper mapper)
        {
            var shadows = mapper.Map<List<Shadow>>(entity.Shadows);
            var userPersonas = mapper.Map<List<UserPersona>>(entity.UserPersonas);
            return new Room()
            {
                Id = entity.Id,
                EpisodeId = entity.EpisodeId,
                Shadows = shadows,
                UserPersonas = userPersonas,
                State = Enum.Parse<RoomState>(entity.State),
                CreatedById = entity.CreatedById,
            };
        }
    }
}
