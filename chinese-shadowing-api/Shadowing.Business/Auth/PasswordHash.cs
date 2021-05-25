using System.Security.Cryptography;
using System.Text;

namespace Shadowing.Business.Auth
{
    public class PasswordHash
    {
        private const int _length = 36;
        private const int _iterations = 1000;

        public PasswordHash(string plainPassword, byte[] salt = null)
        {
            var passwordBytes = Encoding.ASCII.GetBytes(plainPassword);
            Salt = salt ?? GenerateSalt();
            Hash = GenerateHash(passwordBytes, Salt);
        }

        public byte[] Hash { get; set; }

        public byte[] Salt { get; set; }

        private byte[] GenerateSalt()
        {
            var bytes = new byte[_length];

            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(bytes);
            }

            return bytes;
        }

        private byte[] GenerateHash(byte[] password, byte[] salt)
        {
            using (var deriveBytes = new Rfc2898DeriveBytes(password, salt, _iterations))
            {
                var hash = deriveBytes.GetBytes(_length);

                return hash;
            }
        }

    }
}
