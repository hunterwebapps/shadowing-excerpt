using AutoMapper;
using System.Reflection;

namespace Shadowing.DataAccess
{
    public class Mapper
    {
        public static IMapper Initialize(params string[] assemblyNames)
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(Assembly.GetExecutingAssembly().FullName);
                cfg.AddMaps(assemblyNames);
            });

            return config.CreateMapper();
        }
    }
}
