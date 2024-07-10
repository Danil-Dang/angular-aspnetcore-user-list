using System;
namespace Users.Entities.Models
{
    public class Location
    {
        public int Id { get; set; }
        public string? City { get; set; }
        public bool? IsActive { get; set; }
    }
}