using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Smart_Ride.Models;

public partial class Ride
{
    public int RideId { get; set; }

    public int UserId { get; set; }

    public string CarNumber { get; set; } = null!;

    public string CarOwnername { get; set; } = null!;

    public string LicenseNumber { get; set; } = null!;

    public string DepartureLoc { get; set; } = null!;

    public string DestinationLoc { get; set; } = null!;

    public DateOnly DepartureDate { get; set; }

    public TimeOnly DepartureTime { get; set; }

    public int CarType { get; set; }

    public int SeatsAvailable { get; set; }

    public double PricePerSeat { get; set; }

    public int RideStatus { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual User User { get; set; } = null!;
}
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CarType
{
   five_seater,
   seven_seater
}
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum RideStatus
{
   active,
   completed,
   cancelled
}
