using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace dotnetify_react_template.server.Models
{
    public partial class lis2Context : DbContext
    {
        public lis2Context()
        {
        }

        public lis2Context(DbContextOptions<lis2Context> options)
            : base(options)
        {
        }

        public virtual DbSet<LisDay> LisDay { get; set; }
        public virtual DbSet<LisEdition> LisEdition { get; set; }
        public virtual DbSet<LisForecast> LisForecast { get; set; }
        public virtual DbSet<LisForecastData> LisForecastData { get; set; }
        public virtual DbSet<LisForecastType> LisForecastType { get; set; }
        public virtual DbSet<LisMenu> LisMenu { get; set; }
        public virtual DbSet<LisRequest> LisRequest { get; set; }
        public virtual DbSet<LisSetting> LisSetting { get; set; }
        public virtual DbSet<LisTextIta> LisTextIta { get; set; }
        public virtual DbSet<LisTextLis> LisTextLis { get; set; }
        public virtual DbSet<LisTextTrans> LisTextTrans { get; set; }
        public virtual DbSet<LisTimeframe> LisTimeframe { get; set; }
        public virtual DbSet<LisUser> LisUser { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                /*
                #warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySQL("server=localhost;port=3306;user=root;password=root;database=lis2");
                */
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LisDay>(entity =>
            {
                entity.HasKey(e => e.IdDay);

                entity.ToTable("lis_day", "lis2");

                entity.HasIndex(e => e.IdTimeframe)
                    .HasName("lis_day_ibfk_1");

                entity.Property(e => e.IdDay)
                    .HasColumnName("id_day")
                    .HasColumnType("int(11)");

                entity.Property(e => e.DateDay)
                    .HasColumnName("date_day")
                    .HasColumnType("date");

                entity.Property(e => e.IdTimeframe)
                    .HasColumnName("id_timeframe")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<LisEdition>(entity =>
            {
                entity.HasKey(e => e.IdEdition);

                entity.ToTable("lis_edition", "lis2");

                entity.Property(e => e.IdEdition)
                    .HasColumnName("id_edition")
                    .HasColumnType("int(11)");

                entity.Property(e => e.TimeEdition)
                    .HasColumnName("time_edition")
                    .HasColumnType("int(11)");
            });

            modelBuilder.Entity<LisForecast>(entity =>
            {
                entity.HasKey(e => e.IdForecast);

                entity.ToTable("lis_forecast", "lis2");

                entity.HasIndex(e => e.IdDay)
                    .HasName("lis_forecast_ibfk_1");

                entity.HasIndex(e => e.IdEdition)
                    .HasName("lis_forecast_ibfk_2");

                entity.Property(e => e.IdForecast)
                    .HasColumnName("id_forecast")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IdDay)
                    .HasColumnName("id_day")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IdEdition)
                    .HasColumnName("id_edition")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.OffsetDay)
                    .HasColumnName("offset_day")
                    .HasColumnType("int(11)");

                entity.HasOne(d => d.IdDayNavigation)
                    .WithMany(p => p.LisForecast)
                    .HasForeignKey(d => d.IdDay)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("lis_forecast_ibfk_1");

                entity.HasOne(d => d.IdEditionNavigation)
                    .WithMany(p => p.LisForecast)
                    .HasForeignKey(d => d.IdEdition)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("lis_forecast_ibfk_2");
            });

            modelBuilder.Entity<LisForecastData>(entity =>
            {
                entity.HasKey(e => e.IdForecastData);

                entity.ToTable("lis_forecast_data", "lis2");

                entity.HasIndex(e => e.IdForecast)
                    .HasName("lis_forecast_data_ibfk_1");

                entity.HasIndex(e => e.IdForecastType)
                    .HasName("lis_forecast_data_ibfk_2");

                entity.HasIndex(e => e.IdTranslation)
                    .HasName("lis_forecast_data_ibfk_3");

                entity.Property(e => e.IdForecastData)
                    .HasColumnName("id_forecast_data")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IdForecast)
                    .HasColumnName("id_forecast")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IdForecastType)
                    .HasColumnName("id_forecast_type")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IdTranslation)
                    .HasColumnName("id_translation")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdForecastNavigation)
                    .WithMany(p => p.LisForecastData)
                    .HasForeignKey(d => d.IdForecast)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("lis_forecast_data_ibfk_1");

                entity.HasOne(d => d.IdForecastTypeNavigation)
                    .WithMany(p => p.LisForecastData)
                    .HasForeignKey(d => d.IdForecastType)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("lis_forecast_data_ibfk_2");

                entity.HasOne(d => d.IdTranslationNavigation)
                    .WithMany(p => p.LisForecastData)
                    .HasForeignKey(d => d.IdTranslation)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("lis_forecast_data_ibfk_3");
            });

            modelBuilder.Entity<LisForecastType>(entity =>
            {
                entity.HasKey(e => e.IdForecastType);

                entity.ToTable("lis_forecast_type", "lis2");

                entity.Property(e => e.IdForecastType)
                    .HasColumnName("id_forecast_type")
                    .HasColumnType("int(11)");

                entity.Property(e => e.NameType)
                    .IsRequired()
                    .HasColumnName("name_type")
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<LisMenu>(entity =>
            {
                entity.HasKey(e => e.IdMenu);

                entity.ToTable("lis_menu", "lis2");

                entity.Property(e => e.IdMenu)
                    .HasColumnName("id_menu")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Auth)
                    .HasColumnName("auth")
                    .HasColumnType("tinyint(1)");

                entity.Property(e => e.NameMenu)
                    .IsRequired()
                    .HasColumnName("name_menu")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UrlMenu)
                    .IsRequired()
                    .HasColumnName("url_menu")
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<LisRequest>(entity =>
            {
                entity.HasKey(e => e.IdRequest);

                entity.ToTable("lis_request", "lis2");

                entity.HasIndex(e => e.IdTranslation)
                    .HasName("lis_request_ibfk_1");

                entity.Property(e => e.IdRequest)
                    .HasColumnName("id_request")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IdTranslation)
                    .HasColumnName("id_translation")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.PathVideo)
                    .IsRequired()
                    .HasColumnName("path_video")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdTranslationNavigation)
                    .WithMany(p => p.LisRequest)
                    .HasForeignKey(d => d.IdTranslation)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("lis_request_ibfk_1");
            });

            modelBuilder.Entity<LisSetting>(entity =>
            {
                entity.HasKey(e => e.IdSetting);

                entity.ToTable("lis_setting", "lis2");

                entity.Property(e => e.IdSetting)
                    .HasColumnName("id_setting")
                    .HasColumnType("int(11)");

                entity.Property(e => e.NameSetting)
                    .IsRequired()
                    .HasColumnName("name_setting")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ValueSetting)
                    .IsRequired()
                    .HasColumnName("value_setting")
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<LisTextIta>(entity =>
            {
                entity.HasKey(e => new { e.IdTextIta, e.Version });

                entity.ToTable("lis_text_ita", "lis2");

                entity.HasIndex(e => e.IdUserEdit)
                    .HasName("lis_text_ita_ibfk_1");

                entity.Property(e => e.IdTextIta)
                    .HasColumnName("id_text_ita")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Version)
                    .HasColumnName("version")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IdUserEdit)
                    .HasColumnName("id_user_edit")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.TextIta)
                    .IsRequired()
                    .HasColumnName("text_ita")
                    .IsUnicode(false);

                entity.HasOne(d => d.IdUserEditNavigation)
                    .WithMany(p => p.LisTextIta)
                    .HasForeignKey(d => d.IdUserEdit)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("lis_text_ita_ibfk_1");
            });

            modelBuilder.Entity<LisTextLis>(entity =>
            {
                entity.HasKey(e => new { e.IdTextLis, e.Version });

                entity.ToTable("lis_text_lis", "lis2");

                entity.HasIndex(e => e.IdUserEdit)
                    .HasName("lis_text_lis_ibfk_1");

                entity.Property(e => e.IdTextLis)
                    .HasColumnName("id_text_lis")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Version)
                    .HasColumnName("version")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IdUserEdit)
                    .HasColumnName("id_user_edit")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.TextLis)
                    .IsRequired()
                    .HasColumnName("text_lis")
                    .IsUnicode(false);

                entity.Property(e => e.XmlLis)
                    .IsRequired()
                    .HasColumnName("xml_lis")
                    .IsUnicode(false);

                entity.HasOne(d => d.IdUserEditNavigation)
                    .WithMany(p => p.LisTextLis)
                    .HasForeignKey(d => d.IdUserEdit)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("lis_text_lis_ibfk_1");
            });

            modelBuilder.Entity<LisTextTrans>(entity =>
            {
                entity.HasKey(e => e.IdTextTrans);

                entity.ToTable("lis_text_trans", "lis2");

                entity.HasIndex(e => e.IdTextIta)
                    .HasName("lis_text_trans_ibfk_1");

                entity.HasIndex(e => e.IdTextLis)
                    .HasName("lis_text_trans_ibfk_2");

                entity.Property(e => e.IdTextTrans)
                    .HasColumnName("id_text_trans")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IdTextIta)
                    .HasColumnName("id_text_ita")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IdTextLis)
                    .HasColumnName("id_text_lis")
                    .HasColumnType("int(11)");
            });

            modelBuilder.Entity<LisTimeframe>(entity =>
            {
                entity.HasKey(e => new { e.IdTimeframe, e.IdEdition });

                entity.ToTable("lis_timeframe", "lis2");

                entity.HasIndex(e => e.IdEdition)
                    .HasName("lis_timeframe_ibfk_1");

                entity.Property(e => e.IdTimeframe)
                    .HasColumnName("id_timeframe")
                    .HasColumnType("int(11)");

                entity.Property(e => e.IdEdition)
                    .HasColumnName("id_edition")
                    .HasColumnType("int(11)");

                entity.HasOne(d => d.IdEditionNavigation)
                    .WithMany(p => p.LisTimeframe)
                    .HasForeignKey(d => d.IdEdition)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("lis_timeframe_ibfk_1");
            });

            modelBuilder.Entity<LisUser>(entity =>
            {
                entity.HasKey(e => e.IdUser);

                entity.ToTable("lis_user", "lis2");

                entity.Property(e => e.IdUser)
                    .HasColumnName("id_user")
                    .HasColumnType("int(11)");

                entity.Property(e => e.NameUser)
                    .IsRequired()
                    .HasColumnName("name_user")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.PasswordUser)
                    .IsRequired()
                    .HasColumnName("password_user")
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });
        }
    }
}
