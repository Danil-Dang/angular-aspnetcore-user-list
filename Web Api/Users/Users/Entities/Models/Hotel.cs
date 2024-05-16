using System;
namespace Users.Entities.Models
{
    public class Hotel
    {
        public int Id { get; set; }
        public string? HotelName { get; set; }
        public byte? HotelStar { get; set; }
        public int? RoomTotal { get; set; }
        public string? Location { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}