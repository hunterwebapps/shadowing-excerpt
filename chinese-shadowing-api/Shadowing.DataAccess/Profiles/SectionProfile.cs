using AutoMapper;
using Shadowing.Models.Persona.ViewModels;
using Shadowing.Models.Section.ViewModels;

namespace Shadowing.DataAccess.Profiles
{
    public class SectionProfile : Profile
    {
        public SectionProfile()
        {
            MapEntitiesToViewModels();
        }

        private void MapEntitiesToViewModels()
        {
            CreateMap<Entities.Section, SectionDetails>().ConvertUsing((entity, _, context) => MapSectionEntityToSectionViewModel(entity, context.Mapper));
        }

        private SectionDetails MapSectionEntityToSectionViewModel(Entities.Section entity, IMapper mapper)
        {
            return new SectionDetails()
            {
                Id = entity.Id,
                Start = entity.Start,
                End = entity.End,
                AudioUrl = entity.AudioUrl,
                Text = entity.Text,
                Persona = mapper.Map<Persona>(entity.Persona),
            };
        }
    }
}
