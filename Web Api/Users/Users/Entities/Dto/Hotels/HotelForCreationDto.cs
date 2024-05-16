using System;
namespace Users.Entities.Dto.Hotels
{
    public class HotelForCreationDto
    {
        public int Id { get; set; }
        public string? HotelName { get; set; }
        public byte HotelStar { get; set; }
        public int RoomTotal { get; set; }
        public string? Location { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}