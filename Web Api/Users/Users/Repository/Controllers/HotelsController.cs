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

        [HttpGet]
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

        [HttpGet("{id}", Name = "HotelById")]
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

        [HttpPost("register")]
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

        [HttpPut("{id}")]
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

        [HttpDelete("{id}")]
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

        [HttpGet("rooms-by-hotel/{id}")]
        public async Task<IActionResult> GetRooms(int id)
        {
            try
            {
                var rooms = await _hotelRepo.GetRooms(id);
                return Ok(rooms);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("rooms/{id}", Name = "RoomById")]
        public async Task<IActionResult> GetRoom(int id)
        {
            try
            {
                var room = await _hotelRepo.GetRoom(id);
                if (room == null) return NotFound();

                return Ok(room);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("rooms/register")]
        public async Task<IActionResult> CreateRoom(RoomForCreationDto room)
        {
            try
            {
                var createdRoom = await _hotelRepo.CreateRoom(room);
                return CreatedAtRoute("RoomById", new { id = createdRoom.Id }, createdRoom);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("rooms/{id}")]
        public async Task<IActionResult> UpdateRoom(int id, RoomForUpdateDto room)
        {
            try
            {
                var dbRoom = await _hotelRepo.GetRoom(id);
                if (dbRoom == null)
                    return NotFound();

                await _hotelRepo.UpdateRoom(id, room);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("rooms/{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            try
            {
                var dbRoom = await _hotelRepo.GetRoom(id);
                if (dbRoom == null)
                    return NotFound();

                await _hotelRepo.DeleteRoom(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
