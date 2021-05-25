using AutoMapper;
using Shadowing.Models.UserPersonas.ViewModels;

namespace Shadowing.DataAccess.Profiles
{
    public class UserPersonaProfile : Profile
    {
        public UserPersonaProfile()
        {
            MapEntitiesToViewModels();
        }

        private void MapEntitiesToViewModels()
        {
            CreateMap<Entities.UserPersona, UserPersona>().ConvertUsing(entity => MapUserPersonaEntityToUserPersonaViewModel(entity));
        }

        private UserPersona MapUserPersonaEntityToUserPersonaViewModel(Entities.UserPersona entity)
        {
            return new UserPersona()
            {
                Id = entity.Id,
                PersonaId = entity.PersonaId,
                UserId = entity.UserId,
            };
        }
    }
}
