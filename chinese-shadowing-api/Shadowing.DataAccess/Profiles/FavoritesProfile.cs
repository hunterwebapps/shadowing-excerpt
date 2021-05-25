using AutoMapper;
using Shadowing.Models.Favorites.ViewModels;

namespace Shadowing.DataAccess.Profiles
{
    public class FavoritesProfile : Profile
    {
        public FavoritesProfile()
        {
            MapEntitiesToViewModels();
        }

        private void MapEntitiesToViewModels()
        {
            CreateMap<Entities.Favorite, Favorite>().ConvertUsing((entity, _, context) => MapEpisodeEntityToEpisodeViewModel(entity, context.Mapper));
        }

        private Favorite MapEpisodeEntityToEpisodeViewModel(Entities.Favorite entity, IRuntimeMapper mapper)
        {
            return new Favorite()
            {
                EpisodeId = entity.EpisodeId,
            };
        }
    }
}
