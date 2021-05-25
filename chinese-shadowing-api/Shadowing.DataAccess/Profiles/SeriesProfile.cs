using AutoMapper;
using Shadowing.Models.Series.ViewModels;
using Shadowing.Models.Episode.ViewModels;
using System.Collections.Generic;

namespace Shadowing.DataAccess.Profiles
{
    public class SeriesProfile : Profile
    {
        public SeriesProfile()
        {
            MapEntitiesToViewModels();
        }

        private void MapEntitiesToViewModels()
        {
            CreateMap<Entities.Series, SeriesDetails>().ConvertUsing((entity, _, context) => MapSeriesEntityToSeriesViewModel(entity, context.Mapper));
        }

        private SeriesDetails MapSeriesEntityToSeriesViewModel(Entities.Series entity, IRuntimeMapper mapper)
        {
            return new SeriesDetails()
            {
                Id = entity.Id,
                Title = entity.Title,
                UrlTitle = entity.UrlTitle,
                Episodes = mapper.Map<List<EpisodeDetails>>(entity.Episodes),
            };
        }
    }
}
