using System;
namespace Users.Entities.Dto.Hotels
{
    public class RoomForUpdateDto
    {
        public int HotelId { get; set; }
        public string RoomType { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;
    }
}