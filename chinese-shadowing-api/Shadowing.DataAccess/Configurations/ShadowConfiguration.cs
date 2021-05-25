using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shadowing.DataAccess.Entities;

namespace Shadowing.DataAccess.Configurations
{
    public class ShadowConfiguration : IEntityTypeConfiguration<Shadow>
    {
        public void Configure(EntityTypeBuilder<Shadow> builder)
        {
            builder
                .Property(x => x.RecordedUrl)
                .HasMaxLength(2048)
                .IsUnicode(false)
                .IsRequired();
        }
    }
}
