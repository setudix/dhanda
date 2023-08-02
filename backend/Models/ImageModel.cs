using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ImageModel
    {
        public int Id { get; set; }
        public string? FileName { get; set; } = "";
        public string? FilePath { get; set; } = "";
        
        public string? TextContent { get; set; } = "";
    }
}