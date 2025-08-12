using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Ride.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smart_Ride.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RidesController : ControllerBase
    {
        private readonly SmartRideDbContext _context;

        public RidesController(SmartRideDbContext context)
        {
            _context = context;
        }

        [HttpPost("publish")]
        
        public async Task<IActionResult> PublishRide([FromBody] RidePublishRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ride = new Ride
            {
                UserId = request.UserId,
                CarNumber = request.CarNumber,
                CarOwnername = request.CarOwnername,
                LicenseNumber = request.LicenseNumber,
                DepartureLoc = request.DepartureLoc,
                DestinationLoc = request.DestinationLoc,
                DepartureDate = DateOnly.FromDateTime(request.DepartureDate),
                DepartureTime = TimeOnly.FromTimeSpan(request.DepartureTime),
                CarType = request.CarType,
                SeatsAvailable = request.SeatsAvailable,
                PricePerSeat = request.PricePerSeat,
                RideStatus = 0 // Default: active
            };

            _context.Rides.Add(ride);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ride published successfully", ride });
        }
        [HttpGet("my-rides")]
      
        public async Task<IActionResult> GetMyRides()
        {
            
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token.");

            //int userId = int.Parse(userIdClaim.Value);
            var userId = int.Parse(User.FindFirst("UserId")?.Value);
            var rides = await _context.Rides
                .Where(r => r.UserId == userId)
                .Select(r => new
                {
                    id = r.RideId,
                    departure = r.DepartureLoc,
                    destination = r.DestinationLoc,
                    date = r.DepartureDate.ToString("yyyy-MM-dd"),
                    time = r.DepartureTime.ToString("hh\\:mm"),
                    pricePerSeat = r.PricePerSeat,
                    seatsAvailable = r.SeatsAvailable,
                    seatsBooked = r.Bookings.Count,
                    status = ((RideStatus)r.RideStatus).ToString().ToLower()
                })
                .ToListAsync();

            return Ok(rides);
        }



        // 2️⃣ GET: api/Rides/user/3
        //[HttpGet("my-rides")]
        //[Authorize]
        //public async Task<IActionResult> GetRidesByUser(int userId)
        //{
        //    var rides = await _context.Rides
        //        .Where(r => r.UserId == userId)
        //        .ToListAsync();

        //    return Ok(rides);
        //}

        // 3️⃣ GET: api/Rides/search?departure=Pune&destination=Mumbai&date=2025-08-07
        [HttpGet("search")]
        [AllowAnonymous] // Allow searching without authentication
        public async Task<IActionResult> SearchRides([FromQuery] string departure, [FromQuery] string destination, [FromQuery] DateTime date)
        {
            try
            {
                // Add validation for required parameters
                if (string.IsNullOrEmpty(departure) || string.IsNullOrEmpty(destination))
                {
                    return BadRequest("Departure and destination are required.");
                }

                var rides = await _context.Rides
                    .Where(r =>
                        r.DepartureLoc.ToLower() == departure.ToLower() &&
                        r.DestinationLoc.ToLower() == destination.ToLower() &&
                        r.DepartureDate == DateOnly.FromDateTime(date) &&
                        r.RideStatus == 0 &&
                        r.SeatsAvailable > 0
                    )
                    .ToListAsync();

                if (!rides.Any())
                    return NotFound("No rides found for given criteria.");

                return Ok(rides);
            }
            catch (Exception ex)
            {
                // Log the error for debugging
                Console.WriteLine($"Search error: {ex.Message}");
                return StatusCode(500, "An error occurred while searching for rides.");
            }
        }

        [HttpPut("cancel/{rideId}")]
        public async Task<IActionResult> CancelRide(int rideId)
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
                if (userIdClaim == null)
                    return Unauthorized("User ID not found in token.");

                var userId = int.Parse(userIdClaim.Value);
                var ride = await _context.Rides.FirstOrDefaultAsync(r => r.RideId == rideId && r.UserId == userId);
                
                if (ride == null)
                    return NotFound("Ride not found or you don't have permission to cancel it.");

                ride.RideStatus = (int)RideStatus.cancelled;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Ride cancelled successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Cancel ride error: {ex.Message}");
                return StatusCode(500, "An error occurred while cancelling the ride.");
            }
        }
    }
}
public class RidePublishRequest
{
    public int UserId { get; set; }
    public string CarNumber { get; set; }
    public string CarOwnername { get; set; }
    public string LicenseNumber { get; set; }
    public string DepartureLoc { get; set; }
    public string DestinationLoc { get; set; }
    public DateTime DepartureDate { get; set; } // Use DateTime for JSON binding
    public TimeSpan DepartureTime { get; set; } // Use TimeSpan
    public int CarType { get; set; }
    public int SeatsAvailable { get; set; }
    public double PricePerSeat { get; set; }
}
