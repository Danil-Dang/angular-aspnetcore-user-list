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

        private const string reviewFilterQuery = @"SELECT 
                h.Id,
                h.HotelName,
                h.HotelStar,
                h.RoomTotal,
                h.Location,
                h.ImgPath,
                r.LowestPrice,
                CAST(AVG(rev.ReviewStar) AS DECIMAL(2, 1)) AS AverageReview,
                COUNT(rev.ReviewStar) AS TotalReviews
            FROM Hotels h
            LEFT JOIN (
                SELECT HotelId, MIN(Price) AS LowestPrice
                FROM Rooms
                GROUP BY HotelId
            ) r ON h.Id = r.HotelId
            LEFT JOIN Reviews rev ON h.Id = rev.HotelId 
            WHERE 
                (@city IS NULL OR h.Location = @city)
            GROUP BY h.Id, h.HotelName, h.HotelStar, h.RoomTotal, h.Location, h.ImgPath, r.LowestPrice 
            ORDER BY
                CASE WHEN @isByReview = 1 AND @isByPriceHigh = 1
                    THEN CAST(AVG(rev.ReviewStar) AS DECIMAL(2, 1))
                    WHEN @isByPriceHigh = 1 THEN r.LowestPrice 
                    END DESC, 
                CASE WHEN @isByReview = 1 AND @isByPriceLow = 1 
                    THEN CAST(AVG(rev.ReviewStar) AS DECIMAL(2, 1)) 
                    END DESC, 
                CASE WHEN @isByReview = 1 AND @isByPriceLow = 1 
                    THEN r.LowestPrice 
                    END ASC,
                CASE WHEN @isByReview = 1 
                    THEN CAST(AVG(rev.ReviewStar) AS DECIMAL(2, 1)) 
                    END DESC,
                CASE WHEN @isByPriceHigh = 1
                    THEN r.LowestPrice 
                    END DESC,
                CASE WHEN @isByPriceLow = 1
                    THEN r.LowestPrice 
                    END ASC";

        private const string reviewFilterQueryGroupBy = "GROUP BY h.Id, h.HotelName, h.HotelStar, h.RoomTotal, h.Location, h.ImgPath, r.LowestPrice ";

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

        public async Task<IEnumerable<Hotel>> GetHotelsFiltered(string? city, bool? isByReview, bool? isByPriceHigh, bool? isByPriceLow)
        {
            var query = reviewFilterQuery;

            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@city", city);
                parameters.Add("@isByReview", isByReview);
                parameters.Add("@isByPriceHigh", isByPriceHigh);
                parameters.Add("@isByPriceLow", isByPriceLow);

                var hotels = await connection.QueryAsync<Hotel>(query, parameters);
                // var hotels = await connection.QueryAsync<Hotel>(query);
                return hotels.ToList();
            }
        }

        public async Task<IEnumerable<Hotel>> GetHotelsByReviews()
        {
            // var query = reviewFilterQuery + "WHERE h.Location = 'Hanoi' " + reviewFilterQueryGroupBy + "ORDER BY AverageReview DESC";
            // var query = reviewFilterQuery + reviewFilterQueryGroupBy + "ORDER BY AverageReview DESC";
            var query = reviewFilterQuery;

            using (var connection = _context.CreateConnection())
            {
                var hotels = await connection.QueryAsync<Hotel>(query);
                return hotels.ToList();
            }
        }

        public async Task<IEnumerable<Hotel>> GetHotelsByHighestPrice()
        {
            // var query = reviewFilterQuery + "WHERE h.Location = 'Hanoi' " + reviewFilterQueryGroupBy + "ORDER BY r.LowestPrice DESC";
            var query = reviewFilterQuery + reviewFilterQueryGroupBy + "ORDER BY r.LowestPrice DESC";

            using (var connection = _context.CreateConnection())
            {
                var hotels = await connection.QueryAsync<Hotel>(query);
                return hotels.ToList();
            }
        }
        public async Task<IEnumerable<Hotel>> GetHotelsByLowestPrice()
        {
            // var query = reviewFilterQuery + "WHERE h.Location = 'Hanoi' " + reviewFilterQueryGroupBy + "ORDER BY r.LowestPrice";
            var query = reviewFilterQuery + reviewFilterQueryGroupBy + "ORDER BY r.LowestPrice";

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

        // public async Task<Room> GetCheapestRoom(int id)
        public async Task<RoomCheapestResponse> GetCheapestRoom(int id)
        {
            var query = "SELECT MIN(Price) AS LowestPrice FROM Rooms WHERE HotelId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var room = await connection.QuerySingleOrDefaultAsync<RoomCheapestResponse>(query, new { id });
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
                var reviews = await connection.QueryAsync<Review>(query, new { id });
                return reviews.ToList();
            }
        }

        public async Task<IEnumerable<Review>> GetUserReviews(int id)
        {
            var query = "SELECT Id, HotelId, UserId, ReviewStar, Description FROM Reviews WHERE UserId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var reviews = await connection.QueryAsync<Review>(query, new { id });
                return reviews.ToList();
            }
        }

        public async Task<ReviewAverageResponse> GetAverageReview(int id)
        {
            var query = "SELECT CAST(AVG(ReviewStar) AS DECIMAL(2, 1)) AS AverageReview FROM Reviews WHERE HotelId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var review = await connection.QuerySingleOrDefaultAsync<ReviewAverageResponse>(query, new { id });
                return review;
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

        public async Task<ReviewTotalResponse> GetTotalReview(int id)
        {
            var query = "SELECT COUNT(*) as TotalReviews FROM Reviews WHERE HotelId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var review = await connection.QuerySingleOrDefaultAsync<ReviewTotalResponse>(query, new { id });
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
            parameters.Add("ReviewStar", review.ReviewStar, DbType.Decimal);
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
            parameters.Add("ReviewStar", review.ReviewStar, DbType.Decimal);
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
        public async Task<IEnumerable<Booking>> GetBookings()
        {
            var query = "SELECT * FROM Bookings";

            using (var connection = _context.CreateConnection())
            {
                var bookings = await connection.QueryAsync<Booking>(query);
                return bookings.ToList();
            }
        }

        public async Task<IEnumerable<Booking>> GetHotelBookings(int id)
        {
            var query = "SELECT Id, HotelId, RoomId, UserId, CheckIn, CheckOut, IsActive, CreatedDate FROM Bookings WHERE HotelId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var bookings = await connection.QueryAsync<Booking>(query, new { id });
                return bookings.ToList();
            }
        }

        public async Task<IEnumerable<Booking>> GetRoomBookings(int id)
        {
            var query = "SELECT Id, HotelId, RoomId, UserId, CheckIn, CheckOut, IsActive, CreatedDate FROM Bookings WHERE RoomId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var bookings = await connection.QueryAsync<Booking>(query, new { id });
                return bookings.ToList();
            }
        }

        public async Task<IEnumerable<Booking>> GetUserBookings(int id)
        {
            var query = "SELECT Id, HotelId, RoomId, UserId, CheckIn, CheckOut, IsActive, CreatedDate FROM Bookings WHERE UserId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var bookings = await connection.QueryAsync<Booking>(query, new { id });
                return bookings.ToList();
            }
        }

        public async Task<Booking> GetBooking(int id)
        {
            var query = "SELECT * FROM Bookings WHERE Id = @Id";

            using (var connection = _context.CreateConnection())
            {
                var booking = await connection.QuerySingleOrDefaultAsync<Booking>(query, new { id });
                return booking;
            }
        }

        public async Task<Booking> CreateBooking(BookingForCreationDto booking)
        {
            var query = "INSERT INTO Bookings (HotelId, RoomId, UserId, CheckIn, CheckOut, IsActive, CreatedDate) VALUES (@HotelId, @RoomId, @UserId, @CheckIn, @CheckOut, @IsActive, @CreatedDate)" +
                "SELECT CAST(SCOPE_IDENTITY() as int)";

            var parameters = new DynamicParameters();
            parameters.Add("UserId", booking.UserId, DbType.Int32);
            parameters.Add("HotelId", booking.HotelId, DbType.Int32);
            parameters.Add("RoomId", booking.RoomId, DbType.Int32);
            parameters.Add("CheckIn", booking.CheckIn, DbType.DateTime2);
            parameters.Add("CheckOut", booking.CheckOut, DbType.DateTime2);
            parameters.Add("IsActive", booking.IsActive, DbType.Boolean);
            parameters.Add("CreatedDate", booking.CreatedDate, DbType.DateTime2);

            using (var connection = _context.CreateConnection())
            {
                var id = await connection.QuerySingleAsync<int>(query, parameters);

                var createdBooking = new Booking
                {
                    Id = id,
                    UserId = booking.UserId,
                    HotelId = booking.HotelId,
                    RoomId = booking.RoomId,
                    CheckIn = booking.CheckIn,
                    CheckOut = booking.CheckOut,
                    IsActive = booking.IsActive,
                    CreatedDate = booking.CreatedDate
                };

                return createdBooking;
            }
        }

        public async Task UpdateBooking(int id, BookingForUpdateDto booking)
        {
            var query = "UPDATE Bookings SET UserId = @UserId, HotelId = @HotelId, RoomId = @RoomId, CheckIn = @CheckIn, CheckOut = @CheckOut WHERE Id = @Id";

            var parameters = new DynamicParameters();
            parameters.Add("Id", id, DbType.Int32);
            parameters.Add("UserId", booking.UserId, DbType.Int32);
            parameters.Add("HotelId", booking.HotelId, DbType.Int32);
            parameters.Add("RoomId", booking.RoomId, DbType.Int32);
            parameters.Add("CheckIn", booking.CheckIn, DbType.DateTime2);
            parameters.Add("CheckOut", booking.CheckOut, DbType.DateTime2);

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, parameters);
            }
        }

        public async Task DeleteBooking(int id)
        {
            var query = "DELETE FROM Bookings WHERE Id = @Id";

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id });
            }
        }

        // ! Payments ---------------------------------------------
        public async Task<IEnumerable<Payment>> GetPayments()
        {
            var query = "SELECT * FROM Payments";

            using (var connection = _context.CreateConnection())
            {
                var payments = await connection.QueryAsync<Payment>(query);
                return payments.ToList();
            }
        }
        public async Task<IEnumerable<Payment>> GetUserPayments(int id)
        {
            var query = "SELECT * FROM Payments WHERE UserId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var payments = await connection.QueryAsync<Payment>(query, new { id });
                return payments.ToList();
            }
        }

        public async Task<IEnumerable<Payment>> GetHotelPayments(int id)
        {
            var query = "SELECT * FROM Payments WHERE BookingId IN (SELECT Id FROM Bookings WHERE HotelId = @Id)";

            using (var connection = _context.CreateConnection())
            {
                var payments = await connection.QueryAsync<Payment>(query, new { id });
                return payments.ToList();
            }
        }
        public async Task<IEnumerable<Payment>> GetRoomPayments(int id)
        {
            var query = "SELECT * FROM Payments WHERE BookingId IN (SELECT Id FROM Bookings WHERE RoomId = @Id)";

            using (var connection = _context.CreateConnection())
            {
                var payments = await connection.QueryAsync<Payment>(query, new { id });
                return payments.ToList();
            }
        }


        public async Task<Payment> GetPayment(int id)
        {
            var query = "SELECT * FROM Payments WHERE Id = @Id";

            using (var connection = _context.CreateConnection())
            {
                var payments = await connection.QuerySingleOrDefaultAsync<Payment>(query, new { id });
                return payments;
            }
        }
        public async Task<Payment> GetBookingPayment(int id)
        {
            var query = "SELECT * FROM Payments WHERE BookingId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var payments = await connection.QuerySingleOrDefaultAsync<Payment>(query, new { id });
                return payments;
            }
        }

        public async Task<Payment> CreatePayment(PaymentForCreationDto payment)
        {
            var query = "INSERT INTO Payments (UserId, BookingId, Price, PaymentMethod, VisaCard, IsActive, Date) VALUES (@UserId, @BookingId, @Price, @PaymentMethod, @VisaCard, @IsActive, @Date)" +
                "SELECT CAST(SCOPE_IDENTITY() as int)";

            var parameters = new DynamicParameters();
            parameters.Add("UserId", payment.UserId, DbType.Int32);
            parameters.Add("BookingId", payment.BookingId, DbType.Int32);
            parameters.Add("Price", payment.Price, DbType.Decimal);
            parameters.Add("PaymentMethod", payment.PaymentMethod, DbType.String);
            parameters.Add("VisaCard", payment.VisaCard, DbType.Int32);
            parameters.Add("IsActive", payment.IsActive, DbType.Boolean);
            parameters.Add("Date", payment.Date, DbType.DateTime2);

            using (var connection = _context.CreateConnection())
            {
                var id = await connection.QuerySingleAsync<int>(query, parameters);

                var createdPayment = new Payment
                {
                    Id = id,
                    UserId = payment.UserId,
                    BookingId = payment.BookingId,
                    Price = payment.Price,
                    PaymentMethod = payment.PaymentMethod,
                    VisaCard = payment.VisaCard,
                    IsActive = payment.IsActive,
                    Date = payment.Date
                };

                return createdPayment;
            }
        }

        public async Task UpdatePayment(int id, PaymentForUpdateDto payment)
        {
            var query = "UPDATE Payments SET UserId = @UserId, BookingId = @BookingId, Price = @Price, PaymentMethod = @PaymentMethod, VisaCard = @VisaCard, IsActive = @IsActive WHERE Id = @Id";

            var parameters = new DynamicParameters();
            parameters.Add("Id", id, DbType.Int32);
            parameters.Add("UserId", payment.UserId, DbType.Int32);
            parameters.Add("BookingId", payment.BookingId, DbType.Int32);
            parameters.Add("Price", payment.Price, DbType.Decimal);
            parameters.Add("PaymentMethod", payment.PaymentMethod, DbType.String);
            parameters.Add("VisaCard", payment.VisaCard, DbType.Int32);
            parameters.Add("IsActive", payment.IsActive, DbType.Boolean);

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, parameters);
            }
        }

        public async Task DeletePayment(int id)
        {
            var query = "DELETE FROM Payments WHERE Id = @Id";

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id });
            }
        }
    }

    public class ReviewTotalResponse
    {
        public int TotalReviews { get; set; }
    }
}
