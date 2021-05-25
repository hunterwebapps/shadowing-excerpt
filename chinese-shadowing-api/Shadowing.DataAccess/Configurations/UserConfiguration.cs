using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shadowing.DataAccess.Entities;

namespace Shadowing.DataAccess.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder
                .Property(u => u.DisplayName)
                .HasMaxLength(30);

            builder
                .Property(u => u.Email)
                .HasMaxLength(254);

            builder
                .HasIndex(u => u.Email)
                .IsUnique();

            builder
                .Property(u => u.PasswordHash)
                .HasMaxLength(36)
                .IsFixedLength();

            builder
                .Property(u => u.PasswordSalt)
                .HasMaxLength(36)
                .IsFixedLength();

            builder.Ignore(x => x.IsAnonymous);

            builder
                .HasMany(x => x.UserPersonas)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId);
        }
    }
}
