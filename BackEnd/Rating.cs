using System;
using System.Collections.Generic;

namespace Smart_Ride.Models;

public partial class Rating
{
    public int RatingId { get; set; }

    public int RaterId { get; set; }

    public int RateeId { get; set; }

    public int Stars { get; set; }

    public string? Feedback { get; set; }

    public virtual User Ratee { get; set; } = null!;

    public virtual User Rater { get; set; } = null!;
    
}
