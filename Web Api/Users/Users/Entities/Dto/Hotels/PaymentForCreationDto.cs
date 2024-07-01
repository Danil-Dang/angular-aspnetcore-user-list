using System;
namespace Users.Entities.Dto.Hotels
{
    public class PaymentForCreationDto
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public decimal Price { get; set; }
        public string? PaymentMethod { get; set; }
        public int? VisaCard { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime Date { get; set; } = DateTime.Now;
    }
}