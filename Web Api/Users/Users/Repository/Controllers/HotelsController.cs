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

        // ! Hotels ----------------------------------------
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

        [HttpGet("filtered")]
        public async Task<IActionResult> GetHotelsFiltered(string? city, bool? isByReview, bool? isByPriceHigh, bool? isByPriceLow, DateTime startDate, DateTime endDate, bool? isByStars, string? stars, bool? isByRating, string? rating)
        {
            try
            {
                var hotels = await _hotelRepo.GetHotelsFiltered(city, isByReview, isByPriceHigh, isByPriceLow, startDate, endDate, isByStars, stars, isByRating, rating);
                return Ok(hotels);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("by-reviews")]
        public async Task<IActionResult> GetHotelsByReviews()
        {
            try
            {
                var hotels = await _hotelRepo.GetHotelsByReviews();
                return Ok(hotels);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("by-price-high")]
        public async Task<IActionResult> GetHotelsByHighestPrice()
        {
            try
            {
                var hotels = await _hotelRepo.GetHotelsByHighestPrice();
                return Ok(hotels);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("by-price-low")]
        public async Task<IActionResult> GetHotelsByLowestPrice()
        {
            try
            {
                var hotels = await _hotelRepo.GetHotelsByLowestPrice();
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
        public async Task<IActionResult> UpdateHotel(int id, HotelForUpdateDto hotel)
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
        [HttpPut("room-total/{id}")]
        public async Task<IActionResult> UpdateHotelRoomTotal(int id, HotelRoomTotalForUpdateDto hotel)
        {
            try
            {
                var dbHotel = await _hotelRepo.GetHotel(id);
                if (dbHotel == null)
                    return NotFound();

                await _hotelRepo.UpdateHotelRoomTotal(id, hotel);
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

        // ! Locations ----------------------------------------
        [HttpGet("locations")]
        public async Task<IActionResult> GetLocations()
        {
            try
            {
                var locations = await _hotelRepo.GetLocations();
                return Ok(locations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("locations/city")]
        public async Task<IActionResult> GetLocationsCity()
        {
            try
            {
                var locations = await _hotelRepo.GetLocationsCity();
                return Ok(locations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("locations/{id}", Name = "LocationById")]
        public async Task<IActionResult> GetLocation(int id)
        {
            try
            {
                var location = await _hotelRepo.GetLocation(id);
                if (location == null) return NotFound();

                return Ok(location);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("locations/register")]
        public async Task<IActionResult> CreateLocation(LocationForCreationDto location)
        {
            try
            {
                var createdLocation = await _hotelRepo.CreateLocation(location);
                return CreatedAtRoute("LocationById", new { id = createdLocation.Id }, createdLocation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("locations/{id}")]
        public async Task<IActionResult> DeleteLocation(int id)
        {
            try
            {
                var dbLocation = await _hotelRepo.GetLocation(id);
                if (dbLocation == null)
                    return NotFound();

                await _hotelRepo.DeleteLocation(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // ! Rooms ----------------------------------------

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

        [HttpGet("rooms-by-price/{id}")]
        public async Task<IActionResult> GetCheapestRoom(int id)
        {
            try
            {
                var room = await _hotelRepo.GetCheapestRoom(id);
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

        // ! Reviews ----------------------------------------
        [HttpGet("reviews-by-hotel/{id}")]
        public async Task<IActionResult> GetHotelReviews(int id)
        {
            try
            {
                var reviews = await _hotelRepo.GetHotelReviews(id);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("reviews-by-user/{id}")]
        public async Task<IActionResult> GetUserReviews(int id)
        {
            try
            {
                var reviews = await _hotelRepo.GetUserReviews(id);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("reviews/{id}", Name = "ReviewById")]
        public async Task<IActionResult> GetReview(int id)
        {
            try
            {
                var review = await _hotelRepo.GetReview(id);
                if (review == null) return NotFound();

                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("reviews-average/{id}")]
        public async Task<IActionResult> GetAverageReview(int id)
        {
            try
            {
                var review = await _hotelRepo.GetAverageReview(id);
                if (review == null) return NotFound();

                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("reviews-total/{id}")]
        public async Task<IActionResult> GetTotalReview(int id)
        {
            try
            {
                var review = await _hotelRepo.GetTotalReview(id);
                if (review == null) return NotFound();

                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("reviews/register")]
        public async Task<IActionResult> CreateReview(ReviewForCreationDto review)
        {
            try
            {
                var createdReview = await _hotelRepo.CreateReview(review);
                return CreatedAtRoute("ReviewById", new { id = createdReview.Id }, createdReview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("reviews/{id}")]
        public async Task<IActionResult> UpdateReview(int id, ReviewForUpdateDto review)
        {
            try
            {
                var dbReview = await _hotelRepo.GetReview(id);
                if (dbReview == null)
                    return NotFound();

                await _hotelRepo.UpdateReview(id, review);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("reviews/{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            try
            {
                var dbReview = await _hotelRepo.GetReview(id);
                if (dbReview == null)
                    return NotFound();

                await _hotelRepo.DeleteReview(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // ! Bookings ----------------------------------------
        [HttpGet("bookings-by-hotel/{id}")]
        public async Task<IActionResult> GetHotelBookings(int id)
        {
            try
            {
                var bookings = await _hotelRepo.GetHotelBookings(id);
                if (bookings == null) return NotFound();

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("bookings-by-room/{id}")]
        public async Task<IActionResult> GetRoomBookings(int id)
        {
            try
            {
                var bookings = await _hotelRepo.GetRoomBookings(id);
                if (bookings == null) return NotFound();

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("bookings-by-user/{id}")]
        public async Task<IActionResult> GetUserBookings(int id)
        {
            try
            {
                var bookings = await _hotelRepo.GetUserBookings(id);
                if (bookings == null) return NotFound();

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("bookings")]
        public async Task<IActionResult> GetBookings()
        {
            try
            {
                var bookings = await _hotelRepo.GetBookings();
                if (bookings == null) return NotFound();

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("bookings/{id}", Name = "BookingById")]
        public async Task<IActionResult> GetBooking(int id)
        {
            try
            {
                var booking = await _hotelRepo.GetBooking(id);
                if (booking == null) return NotFound();

                return Ok(booking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("bookings/register")]
        public async Task<IActionResult> CreateBooking(BookingForCreationDto booking)
        {
            try
            {
                var createdBooking = await _hotelRepo.CreateBooking(booking);
                return CreatedAtRoute("BookingById", new { id = createdBooking.Id }, createdBooking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("bookings/{id}")]
        public async Task<IActionResult> UpdateBooking(int id, BookingForUpdateDto booking)
        {
            try
            {
                var dbBooking = await _hotelRepo.GetBooking(id);
                if (dbBooking == null)
                    return NotFound();

                await _hotelRepo.UpdateBooking(id, booking);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("bookings/{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            try
            {
                var dbBooking = await _hotelRepo.GetBooking(id);
                if (dbBooking == null)
                    return NotFound();

                await _hotelRepo.DeleteBooking(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // ! Payments ----------------------------------------
        [HttpGet("payments-by-hotel/{id}")]
        public async Task<IActionResult> GetHotelPayments(int id)
        {
            try
            {
                var payments = await _hotelRepo.GetHotelPayments(id);
                if (payments == null) return NotFound();

                return Ok(payments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("payments-by-room/{id}")]
        public async Task<IActionResult> GetRoomPayments(int id)
        {
            try
            {
                var payments = await _hotelRepo.GetRoomPayments(id);
                if (payments == null) return NotFound();

                return Ok(payments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("payments-by-user/{id}")]
        public async Task<IActionResult> GetUserPayments(int id)
        {
            try
            {
                var payments = await _hotelRepo.GetUserPayments(id);
                if (payments == null) return NotFound();

                return Ok(payments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("payments-by-booking/{id}")]
        public async Task<IActionResult> GetBookingPayment(int id)
        {
            try
            {
                var payments = await _hotelRepo.GetBookingPayment(id);
                if (payments == null) return NotFound();

                return Ok(payments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("payments")]
        public async Task<IActionResult> GetPayments()
        {
            try
            {
                var payments = await _hotelRepo.GetPayments();
                if (payments == null) return NotFound();

                return Ok(payments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("payments/{id}", Name = "PaymentById")]
        public async Task<IActionResult> GetPayment(int id)
        {
            try
            {
                var payment = await _hotelRepo.GetPayment(id);
                if (payment == null) return NotFound();

                return Ok(payment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("payments/register")]
        public async Task<IActionResult> CreatePayment(PaymentForCreationDto payment)
        {
            try
            {
                var createdPayment = await _hotelRepo.CreatePayment(payment);
                return CreatedAtRoute("PaymentById", new { id = createdPayment.Id }, createdPayment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("payments/{id}")]
        public async Task<IActionResult> UpdatePayment(int id, PaymentForUpdateDto payment)
        {
            try
            {
                var dbPayment = await _hotelRepo.GetPayment(id);
                if (dbPayment == null)
                    return NotFound();

                await _hotelRepo.UpdatePayment(id, payment);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("payments/{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            try
            {
                var dbPayment = await _hotelRepo.GetPayment(id);
                if (dbPayment == null)
                    return NotFound();

                await _hotelRepo.DeletePayment(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
