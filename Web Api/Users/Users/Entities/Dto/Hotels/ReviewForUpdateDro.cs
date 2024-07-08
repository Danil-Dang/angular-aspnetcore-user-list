using System;
namespace Users.Entities.Dto.Hotels
{
    public class ReviewForUpdateDto
    {
        public int Id { get; set; }
        public decimal ReviewStar { get; set; }
        public string? Description { get; set; }
    }
}