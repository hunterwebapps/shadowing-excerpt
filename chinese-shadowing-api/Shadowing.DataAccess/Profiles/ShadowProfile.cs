using AutoMapper;
using Shadowing.Models.Shadows.ViewModels;

namespace Shadowing.DataAccess.Profiles
{
    public class ShadowProfile : Profile
    {
        public ShadowProfile()
        {
            MapEntitiesToViewModels();
        }

        private void MapEntitiesToViewModels()
        {
            CreateMap<Entities.Shadow, Shadow>().ConvertUsing(entity => MapShadowEntityToShadowViewModel(entity));
        }

        private Shadow MapShadowEntityToShadowViewModel(Entities.Shadow entity)
        {
            return new Shadow()
            {
                Id = entity.Id,
                SectionId = entity.SectionId,
                RoomId = entity.RoomId,
                InferenceText = entity.InferenceText,
                RecordedUrl = entity.RecordedUrl,
            };
        }
    }
}
