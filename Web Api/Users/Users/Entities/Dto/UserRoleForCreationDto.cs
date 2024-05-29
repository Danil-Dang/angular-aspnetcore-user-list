using System;
namespace Users.Entities.Dto
{
    public class UserRoleForCreationDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}