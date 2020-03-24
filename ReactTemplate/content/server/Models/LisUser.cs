using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace dotnetify_react_template.server.Models
{
    public partial class LisUser
    {
        public LisUser()
        {
            LisTextIta = new HashSet<LisTextIta>();
            LisTextLis = new HashSet<LisTextLis>();
        }

        public int IdUser { get; set; }
        public string NameUser { get; set; }
        public string PasswordUser { get; set; }

        public ICollection<LisTextIta> LisTextIta { get; set; }
        public ICollection<LisTextLis> LisTextLis { get; set; }
    }

    public class LisUserDBContext
    {
        private string _connectionString { get; set; }
        // private string _connectionString;
        // public ValuesController(IConfiguration configuration, ILogger<ValuesController> logger)
        public LisUserDBContext(string connectionString) // IConfiguration configuration, ILogger<LisUserDBContext> logger)
        {
            _connectionString = connectionString;
            // this._connectionString = configuration.GetConnectionString("ConnectionStrings:lis");
            // IConfiguration configuration,
            Console.WriteLine("LisUser.cs - costruttore, stringa DB: " + _connectionString);
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(this._connectionString);
        }
    
        public LisUser GetLisUser(string u, string p)
        {
            LisUser us = new LisUser();
            us.IdUser = 0;
            using (MySqlConnection conn = new MySqlConnection(this._connectionString)) // this._connectionString) //GetConnection())
            {
                conn.Open();
                MySqlCommand command = new MySqlCommand();
                command.Connection = conn;
                // string SQL = "INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (@mcUserName, @mcUserPass, @twUserName, @twUserPass)";
                string SQL = "SELECT * FROM lis_user WHERE name_user = ?mcUserName AND password_user = ?mcUserPass";
                // string SQL = @"INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (true, 'frefref', 'gf/g/hfhg', 'noteeeergergegee')";
                command.CommandText = SQL;
                // MySqlCommand cmd = new MySqlCommand("SELECT * FROM lis_user WHERE name_user = ?mcUserName AND password_user = ?mcUserPass", conn);
                command.Parameters.AddWithValue("?mcUserName", u);
                command.Parameters.AddWithValue("?mcUserPass", p);
                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        us.IdUser = reader.GetInt32("id_user");
                        us.NameUser = reader.GetString("name_user");
                        us.PasswordUser = reader.GetString("password_user");
                    }
                }
                conn.Close();
            }
            return us;
        }
    }
}
