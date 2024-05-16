using System;
using Users.Entities.Dto.Hotels;
using Users.Entities.Models;

namespace Users.Contracts
{
    public interface IHotelsRepository
    {
        public Task<IEnumerable<Hotel>> GetHotels();
        public Task<Hotel> GetHotel(int id);
        public Task<Hotel> CreateHotel(HotelForCreationDto hotel);
        public Task UpdateHotel(int id, HotelForUpdateDto hotel);
        public Task DeleteHotel(int id);
    }
}