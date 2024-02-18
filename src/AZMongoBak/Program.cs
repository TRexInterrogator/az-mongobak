using AZMongoBak.BackgroundServices;
using AZMongoBak.SharedServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;


var builder = WebApplication.CreateBuilder(args);
var app_config = new AppConfigService(builder.Configuration);

// AAD sync
var admin_service_builder = new AdminServiceBuilder(app_config);
var admin_service = await admin_service_builder.BuildServiceAsync();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.AddControllersWithViews();

// Services
builder.Services.AddSingleton(app_config);
builder.Services.AddSingleton(admin_service);
builder.Services.AddSingleton(new DbService(app_config));
builder.Services.AddSingleton(new GraphService(app_config));

// Restore backups folder
const string _bak_dir = "./Backups";
if (Directory.Exists(_bak_dir)) Directory.Delete(_bak_dir, true);
Directory.CreateDirectory(_bak_dir);

// Configure App-Reg
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

// Background queue
builder.Services.AddHostedService<QueueMonitorHostedService>();
builder.Services.AddSingleton<IBackgroundTaskQueue>(x => new BackgroundTaskQueue(200));

// CORS policy config
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(
        policy => {
            policy
                .WithOrigins(app_config.settings.CorsAllowedOrigins.Split(";"))
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

if (!app.Environment.IsDevelopment()) {
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");
app.Run();