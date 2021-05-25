using AutoMapper;
using Shadowing.Models.Auth.Enums;
using Shadowing.Models.Common.Enums;
using System;
using System.Linq;
using UserEntity = Shadowing.DataAccess.Entities.User;
using UserViewModel = Shadowing.Models.User.ViewModels.User;


namespace Shadowing.DataAccess.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            MapEntitiesToViewModels();
            MapBindingModelsToEntities();
        }

        private void MapEntitiesToViewModels()
        {
            CreateMap<UserEntity, UserViewModel>().ConvertUsing((entity) => CastUserEntityToUserViewModel(entity));
        }

        private void MapBindingModelsToEntities()
        {

        }

        private UserViewModel CastUserEntityToUserViewModel(UserEntity entity)
        {
            Enum.TryParse<Gender>(entity.Gender, out var gender);
            return new UserViewModel()
            {
                Id = entity.Id,
                DisplayName = entity.DisplayName,
                Email = entity.Email,
                AvatarUrl = entity.AvatarUrl,
                Gender = gender,
                IsAnonymous = entity.IsAnonymous,
                Roles = entity.UserRoles.Select(ur => (RoleIdentifier)Enum.Parse(typeof(RoleIdentifier), ur.Role)).ToList(),
                Created = entity.Created,
            };
        }
}
}
