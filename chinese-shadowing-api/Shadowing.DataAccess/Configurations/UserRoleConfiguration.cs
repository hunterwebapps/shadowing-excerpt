using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shadowing.DataAccess.Entities;

namespace Shadowing.DataAccess.Configurations
{
    public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
    {
        public void Configure(EntityTypeBuilder<UserRole> builder)
        {
            builder.HasKey(ur => new
            {
                ur.UserId,
                ur.Role,
            });

            builder
                .Property(r => r.Role)
                .HasMaxLength(254)
                .IsUnicode(false)
                .IsRequired();

            builder
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();
        }
    }
}
