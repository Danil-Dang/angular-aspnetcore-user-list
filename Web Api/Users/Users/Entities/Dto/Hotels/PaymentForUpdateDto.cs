using System;
namespace Users.Entities.Dto.Hotels
{
    public class PaymentForUpdateDto
    {
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public decimal Price { get; set; }
        public string? PaymentMethod { get; set; }
        public int? VisaCard { get; set; }
        public bool IsActive { get; set; } = true;
    }
}