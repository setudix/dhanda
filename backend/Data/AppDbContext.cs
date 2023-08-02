using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {   
        public DbSet<ImageModel>? Images { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = "server=localhost;user=root;password=;database=dotnet;";
            var serverVersion = new MySqlServerVersion(new Version(10,4,27));
            
            optionsBuilder.UseMySql(connectionString, serverVersion);
        }
    }
}