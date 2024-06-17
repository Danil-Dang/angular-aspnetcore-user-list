using System;
namespace Users.Entities.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int HotelId { get; set; }
        public byte ReviewStar { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedDate { get; set; }
        // public int RoomId { get; set; }
        // public Boolean Type { get; set; }
    }
}