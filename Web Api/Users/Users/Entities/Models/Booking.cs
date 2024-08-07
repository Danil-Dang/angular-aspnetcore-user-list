using System;
namespace Users.Entities.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoomId { get; set; }
        public int HotelId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }

        public string? Username { get; set; }
        public string? HotelName { get; set; }
        public string? RoomType { get; set; }
        public string? Location { get; set; }
        public string? Price { get; set; }
    }
}