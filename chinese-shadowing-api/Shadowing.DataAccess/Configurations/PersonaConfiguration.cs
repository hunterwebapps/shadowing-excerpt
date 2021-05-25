using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shadowing.DataAccess.Entities;

namespace Shadowing.DataAccess.Configurations
{
    public class PersonaConfiguration : IEntityTypeConfiguration<Persona>
    {
        public void Configure(EntityTypeBuilder<Persona> builder)
        {
            builder
                .Property(x => x.Name)
                .HasMaxLength(50)
                .IsRequired();

            builder
                .HasMany(x => x.UserPersonas)
                .WithOne(x => x.Persona)
                .HasForeignKey(x => x.PersonaId);
        }
    }
}
