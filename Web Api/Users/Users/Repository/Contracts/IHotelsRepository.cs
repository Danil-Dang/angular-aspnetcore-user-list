using System;
using Users.Entities.Dto.Hotels;
using Users.Entities.Models;

namespace Users.Contracts
{
    public interface IHotelsRepository
    {
        // ! Hotels ------------------------------------------
        public Task<IEnumerable<Hotel>> GetHotels();
        public Task<Hotel> GetHotel(int id);
        public Task<Hotel> CreateHotel(HotelForCreationDto hotel);
        public Task UpdateHotel(int id, HotelForUpdateDto hotel);
        public Task DeleteHotel(int id);

        // ! Rooms ------------------------------------------
        public Task<IEnumerable<Room>> GetRooms(int id);
        public Task<Room> GetRoom(int id);
        public Task<Room> CreateRoom(RoomForCreationDto hotel);
        public Task UpdateRoom(int id, RoomForUpdateDto hotel);
        public Task DeleteRoom(int id);

        // ! Reviews ------------------------------------------
        public Task<IEnumerable<Review>> GetHotelReviews(int id);
        public Task<IEnumerable<Review>> GetUserReviews(int id);
        public Task<Review> GetReview(int id);
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