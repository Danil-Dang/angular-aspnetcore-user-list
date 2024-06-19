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

        // ! Rooms ---------------------------------------------
        public async Task<IEnumerable<Room>> GetRooms(int id)
        {
            // var query = "SELECT * FROM Rooms";
            var query = "SELECT * FROM Rooms WHERE HotelId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var rooms = await connection.QueryAsync<Room>(query, new { id });
                return rooms.ToList();
            }
        }

        public async Task<Room> GetRoom(int id)
        {
            var query = "SELECT * FROM Rooms WHERE Id = @Id";

            using (var connection = _context.CreateConnection())
            {
                var room = await connection.QuerySingleOrDefaultAsync<Room>(query, new { id });
                return room;
            }
        }

        public async Task<Room> CreateRoom(RoomForCreationDto room)
        {
            var query = "INSERT INTO Rooms (HotelId, RoomType, Price, IsActive, CreatedDate) VALUES (@HotelId, @RoomType, @Price, @IsActive, @CreatedDate)" +
                "SELECT CAST(SCOPE_IDENTITY() as int)";

            var parameters = new DynamicParameters();
            parameters.Add("HotelId", room.HotelId, DbType.Int32);
            parameters.Add("RoomType", room.RoomType, DbType.String);
            parameters.Add("Price", room.Price, DbType.Decimal);
            parameters.Add("IsActive", room.IsActive, DbType.Boolean);
            parameters.Add("CreatedDate", room.CreatedDate, DbType.DateTime2);

            using (var connection = _context.CreateConnection())
            {
                var id = await connection.QuerySingleAsync<int>(query, parameters);

                var createdRoom = new Room
                {
                    Id = id,
                    HotelId = room.HotelId,
                    RoomType = room.RoomType,
                    Price = room.Price,
                    IsActive = room.IsActive,
                    CreatedDate = room.CreatedDate
                };

                return createdRoom;
            }
        }

        public async Task UpdateRoom(int id, RoomForUpdateDto room)
        {
            var query = "UPDATE Rooms SET RoomType = @RoomType, Price = @Price WHERE Id = @Id";

            var parameters = new DynamicParameters();
            parameters.Add("Id", id, DbType.Int32);
            parameters.Add("HotelId", room.HotelId, DbType.Int32);
            parameters.Add("RoomType", room.RoomType, DbType.String);
            parameters.Add("Price", room.Price, DbType.Decimal);

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, parameters);
            }
        }

        public async Task DeleteRoom(int id)
        {
            var query = "DELETE FROM Rooms WHERE Id = @Id";

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id });
            }
        }

        // ! Reviews ---------------------------------------------
        public async Task<IEnumerable<Review>> GetHotelReviews(int id)
        {
            var query = "SELECT Id, HotelId, UserId, ReviewStar, Description FROM Reviews WHERE HotelId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var rooms = await connection.QueryAsync<Review>(query, new { id });
                return rooms.ToList();
            }
        }

        public async Task<IEnumerable<Review>> GetUserReviews(int id)
        {
            var query = "SELECT Id, HotelId, UserId, ReviewStar, Description FROM Reviews WHERE UserId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var rooms = await connection.QueryAsync<Review>(query, new { id });
                return rooms.ToList();
            }
        }

        public async Task<Review> GetReview(int id)
        {
            var query = "SELECT * FROM Reviews WHERE Id = @Id";

            using (var connection = _context.CreateConnection())
            {
                var review = await connection.QuerySingleOrDefaultAsync<Review>(query, new { id });
                return review;
            }
        }

        public async Task<Review> CreateReview(ReviewForCreationDto review)
        {
            var query = "INSERT INTO Reviews (UserId, HotelId, ReviewStar, Description, CreatedDate) VALUES (@UserId, @HotelId, @ReviewStar, @Description, @CreatedDate)" +
                "SELECT CAST(SCOPE_IDENTITY() as int)";

            var parameters = new DynamicParameters();
            parameters.Add("UserId", review.UserId, DbType.Int32);
            parameters.Add("HotelId", review.HotelId, DbType.Int32);
            parameters.Add("ReviewStar", review.ReviewStar, DbType.Byte);
            parameters.Add("Description", review.Description, DbType.String);
            parameters.Add("CreatedDate", review.CreatedDate, DbType.DateTime2);

            using (var connection = _context.CreateConnection())
            {
                var id = await connection.QuerySingleAsync<int>(query, parameters);

                var createdReview = new Review
                {
                    Id = id,
                    UserId = review.UserId,
                    HotelId = review.HotelId,
                    ReviewStar = review.ReviewStar,
                    Description = review.Description,
                    CreatedDate = review.CreatedDate
                };

                return createdReview;
            }
        }

        public async Task UpdateReview(int id, ReviewForUpdateDto review)
        {
            var query = "UPDATE Reviews SET ReviewStar = @ReviewStar, Description = @Description WHERE Id = @Id";

            var parameters = new DynamicParameters();
            parameters.Add("Id", id, DbType.Int32);
            parameters.Add("ReviewStar", review.ReviewStar, DbType.Byte);
            parameters.Add("Description", review.Description, DbType.String);

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, parameters);
            }
        }

        public async Task DeleteReview(int id)
        {
            var query = "DELETE FROM Reviews WHERE Id = @Id";

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id });
            }
        }

        // ! Bookings ---------------------------------------------
        // public async Task<IEnumerable<Review>> GetBookings()
        // {
        //     var query = "SELECT Id, HotelId, UserId, ReviewStar, Description FROM Reviews WHERE HotelId = @Id";

        //     using (var connection = _context.CreateConnection())
        //     {
        //         var rooms = await connection.QueryAsync<Review>(query, new { id });
        //         return rooms.ToList();
        //     }
        // }

        // public async Task<IEnumerable<Review>> GetHotelBookings(int id)
        // {
        //     var query = "SELECT Id, HotelId, UserId, ReviewStar, Description FROM Reviews WHERE HotelId = @Id";

        //     using (var connection = _context.CreateConnection())
        //     {
        //         var rooms = await connection.QueryAsync<Review>(query, new { id });
        //         return rooms.ToList();
        //     }
        // }

        // public async Task<IEnumerable<Review>> GetRoomBookings(int id)
        // {
        //     var query = "SELECT Id, HotelId, UserId, ReviewStar, Description FROM Reviews WHERE HotelId = @Id";

        //     using (var connection = _context.CreateConnection())
        //     {
        //         var rooms = await connection.QueryAsync<Review>(query, new { id });
        //         return rooms.ToList();
        //     }
        // }

        // public async Task<IEnumerable<Review>> GetUserRBookings(int id)
        // {
        //     var query = "SELECT Id, HotelId, UserId, ReviewStar, Description FROM Reviews WHERE UserId = @Id";

        //     using (var connection = _context.CreateConnection())
        //     {
        //         var rooms = await connection.QueryAsync<Review>(query, new { id });
        //         return rooms.ToList();
        //     }
        // }

        // public async Task<Review> GetBooking(int id)
        // {
        //     var query = "SELECT * FROM Reviews WHERE Id = @Id";

        //     using (var connection = _context.CreateConnection())
        //     {
        //         var review = await connection.QuerySingleOrDefaultAsync<Review>(query, new { id });
        //         return review;
        //     }
        // }

        // public async Task<Review> CreateBooking(ReviewForCreationDto review)
        // {
        //     var query = "INSERT INTO Reviews (UserId, HotelId, ReviewStar, Description, CreatedDate) VALUES (@UserId, @HotelId, @ReviewStar, @Description, @CreatedDate)" +
        //         "SELECT CAST(SCOPE_IDENTITY() as int)";

        //     var parameters = new DynamicParameters();
        //     parameters.Add("UserId", review.UserId, DbType.Int32);
        //     parameters.Add("HotelId", review.HotelId, DbType.Int32);
        //     parameters.Add("ReviewStar", review.ReviewStar, DbType.Byte);
        //     parameters.Add("Description", review.Description, DbType.String);
        //     parameters.Add("CreatedDate", review.CreatedDate, DbType.DateTime2);

        //     using (var connection = _context.CreateConnection())
        //     {
        //         var id = await connection.QuerySingleAsync<int>(query, parameters);

        //         var createdReview = new Review
        //         {
        //             Id = id,
        //             UserId = review.UserId,
        //             HotelId = review.HotelId,
        //             ReviewStar = review.ReviewStar,
        //             Description = review.Description,
        //             CreatedDate = review.CreatedDate
        //         };

        //         return createdReview;
        //     }
        // }

        // public async Task UpdateBooking(int id, ReviewForUpdateDto review)
        // {
        //     var query = "UPDATE Reviews SET ReviewStar = @ReviewStar, Description = @Description WHERE Id = @Id";

        //     var parameters = new DynamicParameters();
        //     parameters.Add("Id", id, DbType.Int32);
        //     parameters.Add("ReviewStar", review.ReviewStar, DbType.Byte);
        //     parameters.Add("Description", review.Description, DbType.String);

        //     using (var connection = _context.CreateConnection())
        //     {
        //         await connection.ExecuteAsync(query, parameters);
        //     }
        // }

        // public async Task DeleteBooking(int id)
        // {
        //     var query = "DELETE FROM Reviews WHERE Id = @Id";

        //     using (var connection = _context.CreateConnection())
        //     {
        //         await connection.ExecuteAsync(query, new { id });
        //     }
        // }
    }
}
