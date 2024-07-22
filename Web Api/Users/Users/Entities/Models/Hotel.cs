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

        public decimal AverageReview { get; set; }
        public decimal LowestPrice { get; set; }
        public int TotalReviews { get; set; }
        public IEnumerable<DateTime> AvailableDates { get; set; }
        public DateTime BookingDate { get; set; }
        public int BookedRooms { get; set; }
    }
}