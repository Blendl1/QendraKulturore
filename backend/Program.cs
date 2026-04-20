using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Services.Interfaces;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
  options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<INgjarjaService, NgjarjaService>();


builder.Services.AddScoped<IBiletaService, BiletaService>();
builder.Services.AddScoped<INgjarjaService, NgjarjaService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes("ky_eshte_celesi_im_shume_i_sigurte_123456789")),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowReact"); 

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();
app.Run();