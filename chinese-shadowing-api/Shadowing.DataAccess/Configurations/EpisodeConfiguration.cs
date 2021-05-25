using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shadowing.DataAccess.Entities;

namespace Shadowing.DataAccess.Configurations
{
    class EpisodeConfiguration : IEntityTypeConfiguration<Episode>
    {
        public void Configure(EntityTypeBuilder<Episode> builder)
        {
            builder
                .Property(x => x.Title)
                .HasMaxLength(255)
                .IsRequired();

            builder
                .Property(x => x.UrlTitle)
                .HasMaxLength(255)
                .IsRequired();

            builder
                .Property(x => x.Difficulty)
                .HasMaxLength(6)
                .IsRequired();

            builder
                .HasMany(x => x.Sections)
                .WithOne(x => x.Episode)
                .HasForeignKey(x => x.EpisodeId)
                .IsRequired();
        }
    }
}
