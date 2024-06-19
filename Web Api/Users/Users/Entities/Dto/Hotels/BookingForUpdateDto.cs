using System;
namespace Users.Entities.Dto.Hotels
{
    public class BookingForUpdateDto
    {
        public int UserId { get; set; }
        public int RoomId { get; set; }
        public int HotelId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
    }
}