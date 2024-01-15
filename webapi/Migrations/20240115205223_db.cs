using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class db : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    EventId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorUserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.EventId);
                    table.ForeignKey(
                        name: "FK_Events_Users_CreatorUserId",
                        column: x => x.CreatorUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EventAcceptedUsers",
                columns: table => new
                {
                    AcceptedUsersUserId = table.Column<int>(type: "int", nullable: false),
                    Event2EventId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventAcceptedUsers", x => new { x.AcceptedUsersUserId, x.Event2EventId });
                    table.ForeignKey(
                        name: "FK_EventAcceptedUsers_Events_Event2EventId",
                        column: x => x.Event2EventId,
                        principalTable: "Events",
                        principalColumn: "EventId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventAcceptedUsers_Users_AcceptedUsersUserId",
                        column: x => x.AcceptedUsersUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventApplicants",
                columns: table => new
                {
                    ApplicantsUserId = table.Column<int>(type: "int", nullable: false),
                    EventId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventApplicants", x => new { x.ApplicantsUserId, x.EventId });
                    table.ForeignKey(
                        name: "FK_EventApplicants_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "EventId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventApplicants_Users_ApplicantsUserId",
                        column: x => x.ApplicantsUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventRejectedUsers",
                columns: table => new
                {
                    Event1EventId = table.Column<int>(type: "int", nullable: false),
                    RejectedUsersUserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventRejectedUsers", x => new { x.Event1EventId, x.RejectedUsersUserId });
                    table.ForeignKey(
                        name: "FK_EventRejectedUsers_Events_Event1EventId",
                        column: x => x.Event1EventId,
                        principalTable: "Events",
                        principalColumn: "EventId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventRejectedUsers_Users_RejectedUsersUserId",
                        column: x => x.RejectedUsersUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventAcceptedUsers_Event2EventId",
                table: "EventAcceptedUsers",
                column: "Event2EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventApplicants_EventId",
                table: "EventApplicants",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventRejectedUsers_RejectedUsersUserId",
                table: "EventRejectedUsers",
                column: "RejectedUsersUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_CreatorUserId",
                table: "Events",
                column: "CreatorUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventAcceptedUsers");

            migrationBuilder.DropTable(
                name: "EventApplicants");

            migrationBuilder.DropTable(
                name: "EventRejectedUsers");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
