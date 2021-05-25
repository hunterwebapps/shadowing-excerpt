using AutoMapper;
using Shadowing.Models.Section.ViewModels;
using Shadowing.Models.Episode.Enums;
using Shadowing.Models.Episode.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Shadowing.DataAccess.Profiles
{
    public class EpisodeProfile : Profile
    {
        public EpisodeProfile()
        {
            MapEntitiesToViewModels();
        }

        private void MapEntitiesToViewModels()
        {
            CreateMap<Entities.Episode, EpisodeDetails>().ConvertUsing((entity, _, context) => MapEpisodeEntityToEpisodeViewModel(entity, context.Mapper));
        }

        private EpisodeDetails MapEpisodeEntityToEpisodeViewModel(Entities.Episode entity, IRuntimeMapper mapper)
        {
            Enum.TryParse<Difficulty>(entity.Difficulty, out var difficulty);
            var sections = mapper.Map<List<SectionDetails>>(entity.Sections.OrderBy(x => x.Start));
            return new EpisodeDetails()
            {
                Id = entity.Id,
                Title = entity.Title,
                UrlTitle = entity.UrlTitle,
                Duration = entity.Duration,
                Difficulty = difficulty,
                ThumbnailUrl = entity.ThumbnailUrl,
                VideoUrl = entity.VideoUrl,
                BackgroundUrl = entity.BackgroundUrl,
                SeriesId = entity.SeriesId,
                Sections = sections,
            };
        }
    }
}
