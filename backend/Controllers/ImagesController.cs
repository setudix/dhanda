using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ImagesController(AppDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
        //   return Ok(_webHostEnvironment);
            // try
            // {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("File is required.");
                }

                var uploadsFolder = Path.Combine(_webHostEnvironment.ContentRootPath, "chobi");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Save the ImageModel to the database
                var imageModel = new ImageModel
                {

                    FileName = uniqueFileName,
                    FilePath = filePath
                };
                _context.Images.Add(imageModel);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    uploaded = true,
                    url = "http://localhost:5111/api/Images/chobi/" + uniqueFileName
                    });
            // }
            // catch (Exception ex)
            // {
            //     return StatusCode(500, $"Internal server error: {ex.Message}");
            // }

            // return Ok(new
            // {
            //     uploaded = true,

            // });

            // return Ok(new { image.Id, image.FileName, image.FilePath, image.UploadDate });
        }

        [HttpGet("chobi/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath, "chobi", fileName);

            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound();
            }

            var imageBytes = System.IO.File.ReadAllBytes(imagePath);
            return File(imageBytes, "image/png"); // You can change the content type as needed
        }
    }
}