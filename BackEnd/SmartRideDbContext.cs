using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Smart_Ride.Models;

public partial class SmartRideDbContext : DbContext
{
    public SmartRideDbContext()
    {
    }

    public SmartRideDbContext(DbContextOptions<SmartRideDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Rating> Ratings { get; set; }

    public virtual DbSet<Ride> Rides { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Only configure if not already configured (useful for testing scenarios)
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer("Server=(LocalDB)\\MSSQLLocalDB;Initial Catalog=SmartRideDB;Integrated Security=True;");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__Booking__5DE3A5B155430CE9");

            entity.ToTable("Booking");

            entity.Property(e => e.BookingId).HasColumnName("booking_id");
            entity.Property(e => e.BookingRequest).HasColumnName("booking_request");
            entity.Property(e => e.BookingStatus).HasColumnName("booking_status");
            entity.Property(e => e.RideId).HasColumnName("ride_id");
            entity.Property(e => e.SeatsRequested).HasColumnName("seats_requested");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Ride).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.RideId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Booking_Ride");

            entity.HasOne(d => d.User).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Booking_User");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payment__ED1FC9EA468F640A");

            entity.ToTable("Payment");

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.BookingId).HasColumnName("booking_id");
            entity.Property(e => e.PaymentMethod).HasColumnName("payment_method");
            entity.Property(e => e.PaymentStatus).HasColumnName("payment_status");
            entity.Property(e => e.TransactionId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("transaction_id");

            entity.HasOne(d => d.Booking).WithMany(p => p.Payments)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Payment_Booking");
        });

        modelBuilder.Entity<Rating>(entity =>
        {
            entity.HasKey(e => e.RatingId).HasName("PK__Rating__D35B278BC3A6F69B");

            entity.ToTable("Rating");

            entity.Property(e => e.RatingId).HasColumnName("rating_id");
            entity.Property(e => e.Feedback)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("feedback");
            entity.Property(e => e.RateeId).HasColumnName("ratee_id");
            entity.Property(e => e.RaterId).HasColumnName("rater_id");
            entity.Property(e => e.Stars).HasColumnName("stars");

            entity.HasOne(d => d.Ratee).WithMany(p => p.RatingRatees)
                .HasForeignKey(d => d.RateeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rating_Ratee");

            entity.HasOne(d => d.Rater).WithMany(p => p.RatingRaters)
                .HasForeignKey(d => d.RaterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rating_Rater");
        });

        modelBuilder.Entity<Ride>(entity =>
        {
            entity.HasKey(e => e.RideId).HasName("PK__Ride__C7E4D077D18947FD");

            entity.ToTable("Ride");

            entity.Property(e => e.RideId).HasColumnName("ride_id");
            entity.Property(e => e.CarNumber)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("car_number");
            entity.Property(e => e.CarOwnername)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("car_ownername");
            entity.Property(e => e.CarType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("car_type");
            entity.Property(e => e.DepartureDate).HasColumnName("departure_date");
            entity.Property(e => e.DepartureLoc)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("departure_loc");
            entity.Property(e => e.DepartureTime).HasColumnName("departure_time");
            entity.Property(e => e.DestinationLoc)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("destination_loc");
            entity.Property(e => e.LicenseNumber)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("license_number");
            entity.Property(e => e.PricePerSeat).HasColumnName("price_per_seat");
            entity.Property(e => e.RideStatus).HasColumnName("ride_status");
            entity.Property(e => e.SeatsAvailable).HasColumnName("seats_available");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Rides)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Ride_User");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__B9BE370F430EAC4E");

            entity.HasIndex(e => e.Email, "UQ__Users__AB6E616402D5CF86").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.EmergencyEmail)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("emergency_email");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("passwordHash");
            entity.Property(e => e.Phone)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("phone");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
