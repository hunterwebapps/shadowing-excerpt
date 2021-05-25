using AutoMapper;
using Shadowing.Models.Common.Enums;
using Shadowing.Models.Persona.ViewModels;
using System;

namespace Shadowing.DataAccess.Profiles
{
    public class PersonaProfile : Profile
    {
        public PersonaProfile()
        {
            MapEntitiesToViewModels();
        }

        private void MapEntitiesToViewModels()
        {
            CreateMap<Entities.Persona, Persona>().ConvertUsing(entity => MapEpisodeEntityToPersonaViewModel(entity));
        }

        private Persona MapEpisodeEntityToPersonaViewModel(Entities.Persona entity)
        {
            Enum.TryParse<Gender>(entity.Gender, out var gender);
            return new Persona()
            {
                Id = entity.Id,
                Name = entity.Name,
                Gender = gender,
            };
        }
    }
}
