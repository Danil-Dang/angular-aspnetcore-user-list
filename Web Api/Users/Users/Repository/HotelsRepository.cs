using System;
using Users.Contracts;
using Users.Entities.Models;
using Dapper;
using Users.Entities.Dto.Hotels;
using System.Data;

namespace Users.Repository
{
    public class HotelsRepository : IHotelsRepository
    {
        private readonly DapperContext _context;

        public HotelsRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Hotel>> GetHotels()
        {
            var query = "SELECT * FROM Hotels";

            using (var connection = _context.CreateConnection())
            {
                var hotels = await connection.QueryAsync<Hotel>(query);
                return hotels.ToList();
            }
        }

        public async Task<Hotel> GetHotel(int id)
        {
            var query = "SELECT * FROM Hotels WHERE Id = @Id";

            using (var connection = _context.CreateConnection())
            {
                var hotel = await connection.QuerySingleOrDefaultAsync<Hotel>(query, new { id });
                return hotel;
            }
        }

        public async Task<Hotel> CreateHotel(HotelForCreationDto hotel)
        {
            var query = "INSERT INTO Hotels (HotelName, HotelStar, RoomTotal, Location, IsActive, CreatedDate) VALUES (@HotelName, @HotelStar, @RoomTotal, @Location, @IsActive, @CreatedDate)" +
                "SELECT CAST(SCOPE_IDENTITY() as int)";

            var parameters = new DynamicParameters();
            parameters.Add("HotelName", hotel.HotelName, DbType.String);
            parameters.Add("HotelStar", hotel.HotelStar, DbType.Byte);
            parameters.Add("RoomTotal", hotel.RoomTotal, DbType.Int32);
            parameters.Add("Location", hotel.Location, DbType.String);
            parameters.Add("IsActive", hotel.IsActive, DbType.Boolean);
            parameters.Add("CreatedDate", hotel.CreatedDate, DbType.DateTime2);

            using (var connection = _context.CreateConnection())
            {
                var id = await connection.QuerySingleAsync<int>(query, parameters);

                var createdHotel = new Hotel
                {
                    Id = id,
                    HotelName = hotel.HotelName,
                    HotelStar = hotel.HotelStar,
                    RoomTotal = hotel.RoomTotal,
                    Location = hotel.Location,
                    IsActive = hotel.IsActive,
                    CreatedDate = hotel.CreatedDate
                };

                return createdHotel;
            }
        }

        public async Task UpdateHotel(int id, HotelForUpdateDto hotel)
        {
            var query = "UPDATE Hotels SET HotelName = @HotelName, HotelStar = @HotelStar, RoomTotal = @RoomTotal, Location = @Location WHERE Id = @Id";

            var parameters = new DynamicParameters();
            parameters.Add("Id", id, DbType.Int32);
            parameters.Add("HotelName", hotel.HotelName, DbType.String);
            parameters.Add("HotelStar", hotel.HotelStar, DbType.Byte);
            parameters.Add("RoomTotal", hotel.RoomTotal, DbType.Int32);
            parameters.Add("Location", hotel.Location, DbType.String);

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, parameters);
            }
        }

        public async Task DeleteHotel(int id)
        {
            var query = "DELETE FROM Hotels WHERE Id = @Id";

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id });
            }
        }
    }
}
