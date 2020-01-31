using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;

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
        public string ConnectionString { get; set; }
        public LisUserDBContext(string connectionString)
        {
            this.ConnectionString = connectionString;
        }
    
        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(ConnectionString);
        }
    
        public LisUser GetLisUser(string u, string p)
        {
            LisUser us = new LisUser();
            us.IdUser = 0;
            using (MySqlConnection conn = GetConnection())
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
