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

    public class RequestInfo
    {
        public string Date { get; set; }
        public string Area { get; set; }
        public int Version { get; set; }
        public string Path { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }
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
    
        public List<RequestInfo> GetLisRequestInfo()
        {
            List<RequestInfo> list = new List<RequestInfo>();
        
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                // "SELECT * FROM lis_request"
                MySqlCommand cmd = new MySqlCommand(@"
                    SELECT fd.id_forecast_type, lr.id_translation, ft.name_type, ld.date_day, it.version, it.text_ita
                    FROM lis_request       lr
                    JOIN lis_forecast_data fd ON lr.id_translation = fd.id_forecast 
                    JOIN lis_forecast_type ft ON ft.id_forecast_type = fd.id_forecast_type 
                    JOIN lis_forecast      lf ON fd.id_forecast = lf.id_forecast 
                    JOIN lis_day           ld ON lf.id_day = ld.id_day 
                    JOIN lis_text_trans    tr ON tr.id_text_trans = fd.id_translation
                    JOIN lis_text_ita      it ON tr.id_text_ita = it.id_text_ita
                ", conn);
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new RequestInfo(){
                            Date = reader.GetString("date_day"),
                            Area = reader.GetString("name_type"),
                            Version = reader.GetInt32("version"),
                            Path = "Path1",
                            Notes = reader.GetString("text_ita"),
                            Status = "Ok"
                        });
                    }
                }
            }
            return list;
        }
    }
}
