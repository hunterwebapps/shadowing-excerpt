using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shadowing.DataAccess.Entities;

namespace Shadowing.DataAccess.Configurations
{
    public class SectionConfiguration : IEntityTypeConfiguration<Section>
    {
        public void Configure(EntityTypeBuilder<Section> builder)
        {
            builder
                .HasOne(x => x.Persona)
                .WithMany(x => x.Sections)
                .HasForeignKey(x => x.PersonaId)
                .IsRequired();
        }
    }
}
