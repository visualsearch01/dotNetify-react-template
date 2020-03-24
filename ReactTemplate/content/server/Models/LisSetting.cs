using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;

namespace dotnetify_react_template.server.Models
{
    public partial class LisSetting
    {
        public int IdSetting { get; set; }
        public string NameSetting { get; set; }
        public string ValueSetting { get; set; }
        public string Notes { get; set; }
    }

    public class LisSettingDBContext
    {
        public string ConnectionString { get; set; }
        public LisSettingDBContext(string connectionString)
        {
            this.ConnectionString = connectionString;
        }
    
        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(ConnectionString);
        }
    
        public List<LisSetting> GetLisSettings()
        {
            List<LisSetting> list = new List<LisSetting>();
        
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand("SELECT * FROM lis_setting", conn);
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new LisSetting(){
                            IdSetting = reader.GetInt32("id_setting"),
                            NameSetting = reader.GetString("name_setting"),
                            ValueSetting = reader.GetString("value_setting"),
                            Notes = reader.GetString("notes")
                        });
                    }
                    conn.Close();
                }
            }
            return list;
        }

        public void UpdateLisSettings(string tel, string em, string ftp)
        {
            try
            {
                using (MySqlConnection conn = GetConnection())
                {
                    conn.Open();
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = conn;
                    string SQL = "UPDATE lis_setting SET value_setting = (case when name_setting = 'Url' then @tel when name_setting = 'email' then @em when name_setting = 'ftp' then @ftp end) WHERE name_setting in ('Url', 'email', 'ftp');";
                    // string SQL = "UPDATE lis_setting SET value_setting=@tel WHERE name_setting='Url'";
                    command.CommandText = SQL;
                    command.Parameters.AddWithValue("@tel", tel);
                    command.Parameters.AddWithValue("@em", em);
                    command.Parameters.AddWithValue("@ftp", ftp);
                    command.ExecuteNonQuery();
                    /*
                    string SQL = "INSERT INTO lis_text_ita (id_text_ita, id_user_edit, version, text_ita, notes) VALUES ( ?id_text_ita, ?id_user, ?version, ?text, ?notes);";
                                command.CommandText = SQL;
                                command.Parameters.AddWithValue("?id_text_ita", changes.IdTextIta);
                                command.Parameters.AddWithValue("?id_user", changes.IdUserEdit);
                                command.Parameters.AddWithValue("?version", (changes.VersionIta + 1));
                                command.Parameters.AddWithValue("?text", changes.TextIta); // Gia' escapato .Replace("'", "''"));
                                command.Parameters.AddWithValue("?notes", changes.NotesIta); // .Replace("'", "''"));
                                command.ExecuteNonQuery();
                                command.Parameters.Clear();
                    */
                    conn.Close();
                }
            }
            catch (MySqlException ex)
            {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                using (MySqlConnection conn = GetConnection())
                {
                    conn.Open();
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = conn;
                    string SQL = "UPDATE lis_setting SET notes = ?tel WHERE name_setting = 'Url'";
                    command.CommandText = SQL;
                    command.Parameters.AddWithValue("?tel", ex.Message);
                    command.ExecuteNonQuery();
                    conn.Close();
                }
            }
        }
    }
}
