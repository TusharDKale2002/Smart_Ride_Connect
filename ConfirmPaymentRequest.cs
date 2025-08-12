namespace Smart_Ride.Models
{
    public class ConfirmPaymentRequest
    {
        public int BookingId { get; set; }
        public string PaymentMethod { get; set; }
        public decimal Amount { get; set; }
    }
}


