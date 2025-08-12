using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Ride.Models;
using System.Security.Claims;


namespace Smart_Ride.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly SmartRideDbContext _context;

        public BookingController(SmartRideDbContext context)
        {
            _context = context;
        }

        // Helper method to get current user ID from JWT token
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            
            // Fallback: try to get from email claim
            var emailClaim = User.FindFirst(ClaimTypes.Email)?.Value;
            if (!string.IsNullOrEmpty(emailClaim))
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == emailClaim);
                return user?.UserId ?? 0;
            }
            
            return 0;
        }

        // Test endpoint to verify controller is working
        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok(new { message = "Booking controller is working!", timestamp = DateTime.Now });
        }

        // GET: api/Booking/my-bookings/{userId}
        [HttpGet("my-bookings/{userId}")]
        public async Task<IActionResult> GetMyBookings(int userId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Ride)
                .Include(b => b.Ride.User) // Include driver information
                .Include(b => b.User)
                .Where(b => b.UserId == userId)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    RideId = b.RideId,
                    UserId = b.UserId,
                    SeatsRequested = b.SeatsRequested,
                    BookingStatus = ((BookingStatus)b.BookingStatus).ToString(),
                    BookingRequest = ((BookingRequest)b.BookingRequest).ToString(),
                    PassengerName = b.User.Name,
                    DriverName = b.Ride.User.Name, // Driver's name
                    From = b.Ride.DepartureLoc,
                    To = b.Ride.DestinationLoc,
                    DepartureDate = b.Ride.DepartureDate,
                    DepartureTime = b.Ride.DepartureTime,
                    PricePerSeat = b.Ride.PricePerSeat,
                    CarType = ((CarType)b.Ride.CarType).ToString(),
                    CarNumber = b.Ride.CarNumber,
                    TotalAmount = b.Ride.PricePerSeat * b.SeatsRequested
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // GET: api/Booking/booking-requests/{driverId}
        [HttpGet("booking-requests/{driverId}")]
        public async Task<IActionResult> GetBookingRequestsForDriver(int driverId)
        {
            try
            {
                Console.WriteLine($"Getting booking requests for driver ID: {driverId}");
                
                // First, get all bookings to debug
                var allBookings = await _context.Bookings.ToListAsync();
                Console.WriteLine($"Total bookings in database: {allBookings.Count}");
                
                foreach (var booking in allBookings)
                {
                    Console.WriteLine($"Booking ID: {booking.BookingId}, RideId: {booking.RideId}, UserId: {booking.UserId}, Status: {booking.BookingStatus}, Request: {booking.BookingRequest}");
                }
                
                var requests = await _context.Bookings
                    .Include(b => b.Ride)
                    .Include(b => b.User)
                    .Where(b => b.Ride.UserId == driverId) // Remove the pending filter to get all requests
                    .Select(b => new BookingDto
                    {
                        BookingId = b.BookingId,
                        RideId = b.RideId,
                        UserId = b.UserId,
                        SeatsRequested = b.SeatsRequested,
                        BookingStatus = ((BookingStatus)b.BookingStatus).ToString(),
                        BookingRequest = ((BookingRequest)b.BookingRequest).ToString(),
                        PassengerName = b.User.Name,
                        From = b.Ride.DepartureLoc,
                        To = b.Ride.DestinationLoc,
                        DepartureTime = b.Ride.DepartureTime
                    })
                    .ToListAsync();

                Console.WriteLine($"Found {requests.Count} total booking requests for driver {driverId}");
                return Ok(requests);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting booking requests: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        // PUT: api/Booking/update-request
        [HttpPut("update-request")]
        public async Task<IActionResult> UpdateBookingRequest([FromBody] UpdateBookingRequestDto dto)
        {
            var booking = await _context.Bookings.FindAsync(dto.BookingId);
            if (booking == null)
                return NotFound("Booking not found.");

            if (!Enum.TryParse<BookingRequest>(dto.NewRequestStatus, out var newStatus))
                return BadRequest("Invalid request status.");

            booking.BookingRequest = (int)newStatus;
            await _context.SaveChangesAsync();

            return Ok("Booking request updated.");
        }

        [HttpPost("book")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            try
            {
                Console.WriteLine($"Booking request received - RideId: {dto.RideId}, UserId: {dto.UserId}, Seats: {dto.SeatsRequested}");
                
                var ride = await _context.Rides.FindAsync(dto.RideId);
                if (ride == null)
                {
                    Console.WriteLine($"Ride not found with ID: {dto.RideId}");
                    return BadRequest("Ride not found.");
                }
                
                if (ride.SeatsAvailable < dto.SeatsRequested)
                {
                    Console.WriteLine($"Insufficient seats. Available: {ride.SeatsAvailable}, Requested: {dto.SeatsRequested}");
                    return BadRequest("Insufficient seats available.");
                }

                var booking = new Booking
                {
                    RideId = dto.RideId,
                    UserId = dto.UserId,
                    SeatsRequested = dto.SeatsRequested,
                    BookingStatus = (int)BookingStatus.Upcoming,
                    BookingRequest = (int)BookingRequest.Pending
                };

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();
                
                Console.WriteLine($"Booking created successfully with ID: {booking.BookingId}");
                return Ok(new { message = "Booking request sent to driver", bookingId = booking.BookingId });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Booking error: {ex.Message}");
                return StatusCode(500, $"An error occurred while creating the booking: {ex.Message}");
            }
        }

        [HttpPost("confirm-payment")]
        public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.Ride)
                    .FirstOrDefaultAsync(b => b.BookingId == request.BookingId);

                if (booking == null)
                {
                    return NotFound("Booking not found");
                }

                // Update booking status to completed (confirmed/paid)
                booking.BookingStatus = (int)BookingStatus.Completed;
                booking.BookingRequest = (int)BookingRequest.Accepted;

                // Create payment record
                var payment = new Payment
                {
                    BookingId = request.BookingId,
                    Amount = (double)request.Amount,
                    PaymentMethod = (int)PaymentMethods.UPI,
                    TransactionId = Guid.NewGuid().ToString(),
                    PaymentStatus = (int)PaymentStatus.Success
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Payment confirmed successfully",
                    bookingId = booking.BookingId,
                    status = "Completed"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("completed-rides/{userId}")]
        public async Task<IActionResult> GetCompletedRides(int userId)
        {
            try
            {
                var completedBookings = await _context.Bookings
                    .Include(b => b.Ride)
                    .Include(b => b.Payments)
                    .Where(b => b.UserId == userId && b.BookingStatus == (int)BookingStatus.Completed)
                    .OrderByDescending(b => b.BookingId)
                    .ToListAsync();

                var result = completedBookings.Select(b => new
                {
                    b.BookingId,
                    BookingDate = DateTime.UtcNow, // Since we don't have BookingDate in the model
                    Status = "Completed",
                    PaymentStatus = "Paid",
                    PaymentDate = b.Payments.FirstOrDefault()?.PaymentId != null ? DateTime.UtcNow : (DateTime?)null,
                    ride = new
                    {
                        b.Ride.DepartureLoc,
                        b.Ride.DestinationLoc,
                        b.Ride.DepartureDate,
                        b.Ride.DepartureTime,
                        b.Ride.PricePerSeat,
                        CarModel = ((CarType)b.Ride.CarType).ToString()
                    }
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
public class BookingDto
{
    public int BookingId { get; set; }
    public int RideId { get; set; }
    public int UserId { get; set; }
    public int SeatsRequested { get; set; }
    public string BookingStatus { get; set; } // e.g. "Upcoming", "Completed"
    public string BookingRequest { get; set; } // e.g. "Pending", "Accepted"

    // Optional details for context
    public string PassengerName { get; set; }
    public string DriverName { get; set; }
    public string From { get; set; }
    public string To { get; set; }
    public DateOnly DepartureDate { get; set; }
    public TimeOnly DepartureTime { get; set; }
    public double PricePerSeat { get; set; }
    public string CarType { get; set; }
    public string CarNumber { get; set; }
    public double TotalAmount { get; set; }
}

public class UpdateBookingRequestDto
{
    public int BookingId { get; set; }
    public string NewRequestStatus { get; set; } // "Accepted" or "Rejected"
}
public class CreateBookingDto
{
    public int RideId { get; set; }
    public int UserId { get; set; }
    public int SeatsRequested { get; set; }
}
