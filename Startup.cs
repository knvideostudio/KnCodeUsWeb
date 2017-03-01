using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(KnCodeUsWeb.Startup))]
namespace KnCodeUsWeb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
