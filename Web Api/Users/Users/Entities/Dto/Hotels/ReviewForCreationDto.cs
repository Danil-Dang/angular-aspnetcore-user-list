using System;
namespace Users.Entities.Dto.Hotels
{
    public class ReviewForCreationDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int HotelId { get; set; }
        public decimal ReviewStar { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}