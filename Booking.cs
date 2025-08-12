using System;
using System.Collections.Generic;

namespace Smart_Ride.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int RideId { get; set; }

    public int UserId { get; set; }

    public int SeatsRequested { get; set; }

    public int BookingStatus { get; set; }

    public int BookingRequest { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual Ride Ride { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
public enum BookingRequest
{
    Pending,
    Accepted,
    Rejected
}

public enum BookingStatus
{
    Upcoming,
    Completed,
    Cancelled
}
