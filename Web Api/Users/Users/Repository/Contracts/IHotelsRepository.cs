using System;
using Users.Entities.Dto.Hotels;
using Users.Entities.Models;
using Users.Repository;

namespace Users.Contracts
{
    public interface IHotelsRepository
    {
        // ! Hotels ------------------------------------------
        public Task<IEnumerable<Hotel>> GetHotels();
        public Task<IEnumerable<Hotel>> GetHotelsFiltered(string? city, bool? isByReview, bool? isByPriceHigh, bool? isByPriceLow);
        public Task<IEnumerable<Hotel>> GetHotelsByReviews();
        public Task<IEnumerable<Hotel>> GetHotelsByLowestPrice();
        public Task<IEnumerable<Hotel>> GetHotelsByHighestPrice();
        public Task<Hotel> GetHotel(int id);
        public Task<Hotel> CreateHotel(HotelForCreationDto hotel);
        public Task UpdateHotel(int id, HotelForUpdateDto hotel);
        public Task DeleteHotel(int id);

        // ! Locations ------------------------------------------
        public Task<IEnumerable<Location>> GetLocations();
        public Task<IEnumerable<LocationCityGet>> GetLocationsCity();
        public Task<Location> GetLocation(int id);
        public Task<Location> CreateLocation(LocationForCreationDto location);
        public Task DeleteLocation(int id);

        // ! Rooms ------------------------------------------
        public Task<IEnumerable<Room>> GetRooms(int id);
        public Task<Room> GetRoom(int id);
        public Task<RoomCheapestResponse> GetCheapestRoom(int id);
        public Task<Room> CreateRoom(RoomForCreationDto hotel);
        public Task UpdateRoom(int id, RoomForUpdateDto hotel);
        public Task DeleteRoom(int id);

        // ! Reviews ------------------------------------------
        public Task<IEnumerable<Review>> GetHotelReviews(int id);
        public Task<IEnumerable<Review>> GetUserReviews(int id);
        public Task<Review> GetReview(int id);
        public Task<ReviewAverageResponse> GetAverageReview(int id);
        public Task<ReviewTotalResponse> GetTotalReview(int id);
        public Task<Review> CreateReview(ReviewForCreationDto review);
        public Task UpdateReview(int id, ReviewForUpdateDto review);
        public Task DeleteReview(int id);

        // ! Bookings ------------------------------------------
        public Task<IEnumerable<Booking>> GetBookings();
        public Task<IEnumerable<Booking>> GetHotelBookings(int id);
        public Task<IEnumerable<Booking>> GetRoomBookings(int id);
        public Task<IEnumerable<Booking>> GetUserBookings(int id);
        public Task<Booking> GetBooking(int id);
        public Task<Booking> CreateBooking(BookingForCreationDto booking);
        public Task UpdateBooking(int id, BookingForUpdateDto booking);
        public Task DeleteBooking(int id);

        // ! Bookings ------------------------------------------
        public Task<IEnumerable<Payment>> GetPayments();
        public Task<IEnumerable<Payment>> GetUserPayments(int id);
        public Task<IEnumerable<Payment>> GetHotelPayments(int id);
        public Task<IEnumerable<Payment>> GetRoomPayments(int id);
        public Task<Payment> GetBookingPayment(int id);
        public Task<Payment> GetPayment(int id);
        public Task<Payment> CreatePayment(PaymentForCreationDto payment);
        public Task UpdatePayment(int id, PaymentForUpdateDto payment);
        public Task DeletePayment(int id);
    }
}