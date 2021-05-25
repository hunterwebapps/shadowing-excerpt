using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shadowing.DataAccess.Entities;
using Shadowing.Models.Rooms.Enums;
using System;

namespace Shadowing.DataAccess.Configurations
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder
                .HasOne(x => x.Episode)
                .WithMany(x => x.Rooms)
                .HasForeignKey(x => x.EpisodeId)
                .IsRequired();

            builder
                .HasMany(x => x.UserPersonas)
                .WithOne(x => x.Room)
                .HasForeignKey(x => x.RoomId);

            builder
                .HasMany(x => x.Shadows)
                .WithOne(x => x.Room)
                .HasForeignKey(x => x.RoomId);

            builder
                .Property(x => x.State)
                .HasDefaultValue(RoomState.Active.ToString())
                .HasMaxLength(255)
                .IsUnicode(false)
                .IsRequired();

            builder
                .Property(x => x.CreatedById)
                .HasMaxLength(36)
                .IsFixedLength(true)
                .IsUnicode(false)
                .HasDefaultValue("f326f874-6bdc-4e43-8a51-e8709db4f7ee")
                .IsRequired();
        }
    }
}
