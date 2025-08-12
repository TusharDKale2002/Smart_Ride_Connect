using Microsoft.AspNetCore.Mvc;
using Smart_Ride.Models;
using Microsoft.EntityFrameworkCore;

namespace Smart_Ride.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly SmartRideDbContext _context;

        public PaymentController(SmartRideDbContext context)
        {
            _context = context;
        }

        // POST: api/Payment
        [HttpPost]
        public async Task<IActionResult> MakePayment([FromBody] PaymentDto paymentDto)
        {
            // Check if booking exists
            var booking = await _context.Bookings
                .Include(b => b.User) // Optional, if you want to confirm user
                .FirstOrDefaultAsync(b => b.BookingId == paymentDto.BookingId);

            if (booking == null)
                return NotFound(new { message = "Booking not found." });

            // Create Payment object
            var payment = new Payment
            {
                BookingId = paymentDto.BookingId,
                Amount = paymentDto.Amount,
                PaymentMethod = (int)paymentDto.PaymentMethod,
                TransactionId = paymentDto.TransactionId,
                PaymentStatus = (int)paymentDto.PaymentStatus
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Payment recorded successfully.",
                paymentId = payment.PaymentId
            });
        }
    }

    // DTO for payment input
    public class PaymentDto
    {
        public int BookingId { get; set; }
        public double Amount { get; set; }
        public PaymentMethods PaymentMethod { get; set; }
        public string TransactionId { get; set; } = null!;
        public PaymentStatus PaymentStatus { get; set; }
    }
}
