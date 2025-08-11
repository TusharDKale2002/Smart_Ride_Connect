using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Ride.Models;

[Route("api/[controller]")]
[ApiController]
public class RatingController : ControllerBase
{
    private readonly SmartRideDbContext _context;
    private readonly IConfiguration _config;

    public RatingController(SmartRideDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // POST: api/Rating
    [HttpPost]
    public async Task<IActionResult> PostRating([FromBody] RatingDto dto)
    {
        if (dto.Stars < 1 || dto.Stars > 5)
            return BadRequest("Rating must be between 1 and 5 stars.");

        // Optional: Prevent duplicate ratings
        var existing = await _context.Ratings.FirstOrDefaultAsync(r =>
            r.RaterId == dto.RaterId && r.RateeId == dto.RateeId);

        if (existing != null)
            return BadRequest("You have already rated this user.");

        var rating = new Rating
        {
            RaterId = dto.RaterId,
            RateeId = dto.RateeId,
            Stars = dto.Stars,
            Feedback = dto.Feedback
        };

        _context.Ratings.Add(rating);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Rating submitted successfully!" });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetRatingsForUser(int userId)
    {
        var ratings = await _context.Ratings
            .Include(r => r.Rater) // 💡 This ensures the Rater is loaded
            .Where(r => r.RateeId == userId)
            .ToListAsync();

        if (!ratings.Any())
        {
            return Ok(new
            {
                AverageRating = 0,
                TotalRatings = 0,
                Message = "No ratings found for this user."
            });
        }

        var average = Math.Round(ratings.Average(r => r.Stars), 2);

        return Ok(new
        {
            AverageRating = average,
            TotalRatings = ratings.Count,
            Ratings = ratings.Select(r => new
            {
                r.RatingId,
                r.Stars,
                r.Feedback,
                RaterId = r.RaterId,
                RaterName = r.Rater.Name 
            })
        });
    }



}
public class RatingDto
{
    public int RaterId { get; set; }
    public int RateeId { get; set; }
    public int Stars { get; set; }
    public string? Feedback { get; set; }
}
