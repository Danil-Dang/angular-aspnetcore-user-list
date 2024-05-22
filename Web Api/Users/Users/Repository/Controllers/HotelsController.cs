using System;
using System.Text;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Users.Contracts;
using Users.Entities.Dto.Hotels;
using Users.Entities.Models;

namespace Users.Repository.Controllers
{
    [Route("api/hotels")]
    [ApiController]
    public class HotelsController : ControllerBase
    {
        private readonly IHotelsRepository _hotelRepo;

        public HotelsController(IHotelsRepository hotelRepo)
        {
            _hotelRepo = hotelRepo;
        }

        [HttpGet, Authorize]
        public async Task<IActionResult> GetHotels()
        {
            try
            {
                var hotels = await _hotelRepo.GetHotels();
                return Ok(hotels);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{id}", Name = "HotelById"), Authorize]
        public async Task<IActionResult> GetHotel(int id)
        {
            try
            {
                var hotel = await _hotelRepo.GetHotel(id);
                if (hotel == null) return NotFound();

                return Ok(hotel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("register"), Authorize]
        public async Task<IActionResult> CreateHotel(HotelForCreationDto hotel)
        {
            try
            {
                var createdHotel = await _hotelRepo.CreateHotel(hotel);
                return CreatedAtRoute("HotelById", new { id = createdHotel.Id }, createdHotel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> UpdateUser(int id, HotelForUpdateDto hotel)
        {
            try
            {
                var dbHotel = await _hotelRepo.GetHotel(id);
                if (dbHotel == null)
                    return NotFound();

                await _hotelRepo.UpdateHotel(id, hotel);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            try
            {
                var dbHotel = await _hotelRepo.GetHotel(id);
                if (dbHotel == null)
                    return NotFound();

                await _hotelRepo.DeleteHotel(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // [HttpPost, DisableRequestSizeLimit]
        // public async Task<IActionResult> Upload()
        // {
        //     try
        //     {
        //         var formCollection = await Request.ReadFormAsync();
        //         var file = formCollection.Files.First();
        //         // var file = Request.Form.Files[0];
        //         var folderName = Path.Combine("Resources", "Images");
        //         var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
        //         if (file.Length > 0)
        //         {
        //             var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
        //             var fullPath = Path.Combine(pathToSave, fileName);
        //             var dbPath = Path.Combine(folderName, fileName);
        //             using (var stream = new FileStream(fullPath, FileMode.Create))
        //             {
        //                 file.CopyTo(stream);
        //             }
        //             return Ok(new { dbPath });
        //         }
        //         else
        //         {
        //             return BadRequest();
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, $"Internal server error: {ex}");
        //     }
        // }
    }
}
