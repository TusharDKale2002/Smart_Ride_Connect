using System;
using System.Collections.Generic;

namespace Smart_Ride.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int BookingId { get; set; }

    public double Amount { get; set; }

    public int PaymentMethod { get; set; }

    public string TransactionId { get; set; } = null!;

    public int PaymentStatus { get; set; }

    public virtual Booking Booking { get; set; } = null!;
}
public enum PaymentStatus
{
    Failed ,
    Success 
}

public enum PaymentMethods
{
    Card ,
    UPI ,
    DigitalWallet
}