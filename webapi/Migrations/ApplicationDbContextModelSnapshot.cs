﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using webapi.Data;

#nullable disable

namespace webapi.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("EventUser", b =>
                {
                    b.Property<int>("ApplicantsUserId")
                        .HasColumnType("int");

                    b.Property<int>("EventId")
                        .HasColumnType("int");

                    b.HasKey("ApplicantsUserId", "EventId");

                    b.HasIndex("EventId");

                    b.ToTable("EventApplicants", (string)null);
                });

            modelBuilder.Entity("EventUser1", b =>
                {
                    b.Property<int>("Event1EventId")
                        .HasColumnType("int");

                    b.Property<int>("RejectedUsersUserId")
                        .HasColumnType("int");

                    b.HasKey("Event1EventId", "RejectedUsersUserId");

                    b.HasIndex("RejectedUsersUserId");

                    b.ToTable("EventRejectedUsers", (string)null);
                });

            modelBuilder.Entity("EventUser2", b =>
                {
                    b.Property<int>("AcceptedUsersUserId")
                        .HasColumnType("int");

                    b.Property<int>("Event2EventId")
                        .HasColumnType("int");

                    b.HasKey("AcceptedUsersUserId", "Event2EventId");

                    b.HasIndex("Event2EventId");

                    b.ToTable("EventAcceptedUsers", (string)null);
                });

            modelBuilder.Entity("webapi.Models.Event", b =>
                {
                    b.Property<int>("EventId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("EventId"));

                    b.Property<int>("CreatorUserId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("EventId");

                    b.HasIndex("CreatorUserId");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("webapi.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("EventUser", b =>
                {
                    b.HasOne("webapi.Models.User", null)
                        .WithMany()
                        .HasForeignKey("ApplicantsUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("webapi.Models.Event", null)
                        .WithMany()
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("EventUser1", b =>
                {
                    b.HasOne("webapi.Models.Event", null)
                        .WithMany()
                        .HasForeignKey("Event1EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("webapi.Models.User", null)
                        .WithMany()
                        .HasForeignKey("RejectedUsersUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("EventUser2", b =>
                {
                    b.HasOne("webapi.Models.User", null)
                        .WithMany()
                        .HasForeignKey("AcceptedUsersUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("webapi.Models.Event", null)
                        .WithMany()
                        .HasForeignKey("Event2EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("webapi.Models.Event", b =>
                {
                    b.HasOne("webapi.Models.User", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorUserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Creator");
                });
#pragma warning restore 612, 618
        }
    }
}
