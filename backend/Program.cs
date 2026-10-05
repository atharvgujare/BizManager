using System.Text;
using BusinessManager.Api.Data;
using BusinessManager.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Dynamic Port support: bind to 5058, 10000, and Render dynamic $PORT
var port = Environment.GetEnvironmentVariable("PORT");
var listenUrls = new List<string> { "http://*:5058", "http://*:10000" };
if (!string.IsNullOrEmpty(port))
{
    listenUrls.Add($"http://*:{port}");
}
builder.WebHost.UseUrls(string.Join(";", listenUrls.Distinct()));

// 1. Add Controllers
builder.Services.AddControllers();

// 2. Database Context (SQLite for cross-platform/Docker/Render cloud, SQL Server if configured)
var rawConn = builder.Configuration.GetConnectionString("DefaultConnection") 
              ?? Environment.GetEnvironmentVariable("DATABASE_URL")
              ?? Environment.GetEnvironmentVariable("CONNECTION_STRING");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (!string.IsNullOrEmpty(rawConn) && !rawConn.Contains("(localdb)") && !rawConn.EndsWith(".db"))
    {
        // External SQL Server instance configured via env variable or connection string
        options.UseSqlServer(rawConn);
    }
    else if (OperatingSystem.IsWindows() && string.IsNullOrEmpty(rawConn))
    {
        // Windows local development with LocalDB
        options.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=BusinessManagerDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;");
    }
    else
    {
        // Cross-platform Docker / Render deployment: zero-config fast embedded SQLite
        var dbPath = Path.Combine(builder.Environment.ContentRootPath, "businessmanager.db");
        options.UseSqlite($"Data Source={dbPath}");
    }
});

// 3. Register Application Services
builder.Services.AddScoped<ITokenService, TokenService>();

// 4. JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "BusinessManagerSuperSecretKeyForJwtAuthentication2026!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "BusinessManagerApi",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "BusinessManagerMobileApp",
            ClockSkew = TimeSpan.Zero
        };
    });

// 5. CORS for Mobile and Web development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 6. Swagger / OpenAPI Documentation with JWT Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Business Manager Web API",
        Version = "v1",
        Description = "All-in-One Multi-Purpose Business Management Suite API"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(doc => new OpenApiSecurityRequirement
    {
        { new OpenApiSecuritySchemeReference("Bearer"), new List<string>() }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Business Manager API v1");
    c.RoutePrefix = string.Empty; // Serve Swagger at app root URL
});

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure Database is Created & Seeded automatically on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while creating/migrating the database.");
    }
}

app.Run();
