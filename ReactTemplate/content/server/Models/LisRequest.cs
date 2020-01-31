using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;

namespace dotnetify_react_template.server.Models
{
    public partial class LisRequest
    {
        public int IdRequest { get; set; }
        public int IdTranslation { get; set; }
        public string PathVideo { get; set; }
        public string Notes { get; set; }

        public LisTextTrans IdTranslationNavigation { get; set; }
    }

    public class LisRequestDBContext
    {
        public string ConnectionString { get; set; }
        public LisRequestDBContext(string connectionString)
        {
            this.ConnectionString = connectionString;
        }
    
        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(ConnectionString);
        }
    
        public List<LisRequest> GetLisRequests()
        {
            List<LisRequest> list = new List<LisRequest>();
        
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand("SELECT * FROM lis_request", conn);
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new LisRequest(){
                            IdRequest = reader.GetInt32("id_request"),
                            IdTranslation = reader.GetInt32("id_translation"),
                            PathVideo = reader.GetString("path_video"),
                            Notes = reader.GetString("notes")
                        });
                    }
                }
            }
            return list;
        }
    }
}
