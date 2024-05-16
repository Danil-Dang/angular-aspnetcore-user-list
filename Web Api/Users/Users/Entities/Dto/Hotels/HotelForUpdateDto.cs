using System;
namespace Users.Entities.Dto.Hotels
{
    public class HotelForUpdateDto
    {
        public int Id { get; set; }
        public string? HotelName { get; set; }
        public byte HotelStar { get; set; }
        public int RoomTotal { get; set; }
        public string? Location { get; set; }
    }
}