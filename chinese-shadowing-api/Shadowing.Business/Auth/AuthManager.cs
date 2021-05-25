using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Shadowing.Business.Extensions;
using Shadowing.DataAccess;
using Shadowing.Models.Auth.BindingModels;
using Shadowing.Models.Auth.Enums;
using Shadowing.Models.Auth.ViewModels;
using Shadowing.Models.Common.Enums;
using Shadowing.Models.User.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Entities = Shadowing.DataAccess.Entities;

namespace Shadowing.Business.Auth
{
    public class AuthManager
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IMapper mapper;
        private readonly string jwtSecret;

        public const int SHORT_TOKEN_HOURS = 3;
        public const int LONG_TOKEN_YEARS = 1;

        public AuthManager(ApplicationDbContext dataContext, IMapper mapper, IConfiguration configuration)
        {
            this.dbContext = dataContext;
            this.mapper = mapper;
            this.jwtSecret = configuration["JwtSecret"];
        }

        public async Task<AuthenticatedUser> AuthenticateUserAsync(LoginCredentials loginCredentials, string anonymousUserId)
        {
            var user = await this.dbContext.Users
                .Include(u => u.UserRoles)
                .SingleOrDefaultAsync(u => u.Email == loginCredentials.Email);

            if (user == null)
            {
                return null;
            }

            var passwordHasher = new PasswordHash(loginCredentials.Password, user.PasswordSalt);

            if (!passwordHasher.Hash.SequenceEqual(user.PasswordHash))
            {
                return null;
            }

            user.LastLogin = DateTime.Now;

            await this.dbContext.SaveChangesAsync();

            var model = this.mapper.Map<User>(user);

            var (token, expiration) = this.MakeToken(model, loginCredentials.Remember);

            return new AuthenticatedUser()
            {
                User = model,
                Token = token,
                Expiration = expiration,
            };
        }

        public async Task<AuthenticatedUser> CreateAnonymousUserAsync()
        {
            // TODO: Run process to cleanup anonymous users.
            var entity = new Entities.User()
            {
                Id = Guid.NewGuid().ToString(),
                Gender = Gender.Unspecified.ToString(),
                LastLogin = DateTime.Now,
                Created = DateTime.Now,
            };

            await this.dbContext.Users.AddAsync(entity);

            await this.dbContext.SaveChangesAsync();

            var model = this.mapper.Map<User>(entity);

            var (token, expiration) = this.MakeToken(model, false);

            return new AuthenticatedUser()
            {
                User = model,
                Token = token,
                Expiration = expiration,
            };
        }

        public async Task<User> RegisterUserAsync(RegisterCredentials registerCredentials, string anonymousUserId)
        {
            var entity = await this.dbContext.Users.FindAsync(anonymousUserId);

            var passwordHash = new PasswordHash(registerCredentials.Password);

            entity.Email = registerCredentials.Email;
            entity.DisplayName = await GetUniqueDisplayNameAsync(registerCredentials.Email);
            entity.PasswordHash = passwordHash.Hash;
            entity.PasswordSalt = passwordHash.Salt;

            await this.dbContext.SaveChangesAsync();

            return this.mapper.Map<User>(entity);
        }

        public async Task<List<RegisterIssue>> CheckCredentialsAsync(RegisterCredentials credentials)
        {
            var issues = new List<RegisterIssue>();

            var isEmailExists = await this.dbContext.Users.AnyAsync(u => u.Email == credentials.Email);
            if (isEmailExists)
            {
                issues.Add(RegisterIssue.DuplicateEmail);
            }

            if (!this.IsComplexPassword(credentials.Password))
            {
                issues.Add(RegisterIssue.InvalidPassword);
            }

            return issues;
        }

        public async Task<AuthenticatedUser> RenewTokenAsync(ClaimsPrincipal user)
        {
            var isLongToken = user.GetTokenExpiration() > DateTime.Now.AddHours(AuthManager.SHORT_TOKEN_HOURS);

            var entity = await this.dbContext.Users
                .Include(u => u.UserRoles)
                .SingleAsync(u => u.Id == user.GetUserId());

            var model = this.mapper.Map<User>(entity);

            var (token, expiration) = this.MakeToken(model, isLongToken);

            return new AuthenticatedUser()
            {
                User = model,
                Token = token,
                Expiration = expiration,
            };
        }

        public async Task<User> UpdateCredentialsAsync(UpdateCredentials credentials, string userId)
        {
            var entity = await this.dbContext.Users.FindAsync(userId);

            var userByEmail = await this.dbContext.Users.SingleOrDefaultAsync(x => x.Email == credentials.Email);

            if (userByEmail != null && entity.Id != userByEmail.Id)
            {
                // TODO: Handle email already exists; Probably check on front end in real time.
                throw new Exception("Trying to update to existing email.");
            }
            else if (userByEmail == null)
            {
                entity.Email = credentials.Email;
                // TODO: Send confirmation email.
            }

            if (credentials.NewPassword != null)
            {
                if (!this.IsComplexPassword(credentials.NewPassword))
                {
                    throw new Exception("Front-end failed to handle password complexity validation.");
                }

                var confirmPassword = new PasswordHash(credentials.CurrentPassword, entity.PasswordSalt);
                if (!confirmPassword.Hash.SequenceEqual(entity.PasswordHash))
                {
                    // TODO: Give proper UI feedback without throwing error.
                    throw new Exception("Invalid confirm password");
                }
                
                var newPassword = new PasswordHash(credentials.NewPassword);

                entity.PasswordHash = newPassword.Hash;
                entity.PasswordSalt = newPassword.Salt;
            }

            await this.dbContext.SaveChangesAsync();

            return this.mapper.Map<User>(entity);
        }

        private (string, DateTime) MakeToken(User model, bool remember)
        {
            var roleClaims = model.Roles.Select(role => new Claim(ClaimTypes.Role, role.ToString()));

            var tokenExpiration = remember
                ? DateTime.Now.AddYears(LONG_TOKEN_YEARS)
                : DateTime.Now.AddHours(SHORT_TOKEN_HOURS);

            var userClaims = new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, model.Id),
                new Claim(ClaimTypes.Expiration, tokenExpiration.ToString()),
            };

            var allClaims = roleClaims.Concat(userClaims);

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(this.jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(allClaims),
                Expires = tokenExpiration,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return (tokenHandler.WriteToken(token), tokenExpiration);
        }

        private bool IsComplexPassword(string password)
        {
            var hasUpperCase = new Regex("[A-Z]").IsMatch(password) ? 1 : 0;
            var hasLowerCase = new Regex("[a-z]").IsMatch(password) ? 1 : 0;
            var hasNumbers = new Regex("\\d").IsMatch(password) ? 1 : 0;
            var hasNonAlphas = new Regex("\\W").IsMatch(password) ? 1 : 0;

            var isComplex = hasUpperCase + hasLowerCase + hasNumbers + hasNonAlphas >= 3;

            return isComplex && password.Length >= 8;
        }

        private async Task<string> GetUniqueDisplayNameAsync(string registerEmail)
        {
            var emailUsername = registerEmail.Substring(0, registerEmail.IndexOf("@"));

            var cleanName = CleanDisplayName(emailUsername);

            var attempt = 0;
            var potentialName = cleanName;
            while (await this.dbContext.Users.CountAsync(x => x.DisplayName == potentialName) > 0)
            {
                attempt++;
                potentialName = $"{cleanName}{attempt}";
            }

            return potentialName;
        }

        internal string CleanDisplayName(string emailUsername)
        {
            var cleanName = Regex.Replace(emailUsername, @"[^\w\s]", "", RegexOptions.IgnoreCase);

            return cleanName;
        }
    }
}
