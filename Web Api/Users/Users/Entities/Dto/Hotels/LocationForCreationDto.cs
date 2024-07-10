using System;
namespace Users.Entities.Dto.Hotels
{
    public class LocationForCreationDto
    {
        public int Id { get; set; }
        public string City { get; set; }
        public bool IsActive { get; set; } = true;
    }
}