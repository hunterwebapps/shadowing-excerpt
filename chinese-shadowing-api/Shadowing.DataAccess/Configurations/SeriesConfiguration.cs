using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shadowing.DataAccess.Entities;

namespace Shadowing.DataAccess.Configurations
{
    public class SeriesConfiguration : IEntityTypeConfiguration<Series>
    {
        public void Configure(EntityTypeBuilder<Series> builder)
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
                .HasMany(x => x.Episodes)
                .WithOne(x => x.Series)
                .HasForeignKey(x => x.SeriesId)
                .IsRequired();
        }
    }
}
