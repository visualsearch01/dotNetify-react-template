using DotNetify.Routing;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace dotnetify_react_template.server.Models
{
    /**
     * Classe base con solo i dati di Request
     * la creazione di un'anteprima video crea sempre una request che poi puo' essere pubblicata
     * La generazione della request andrebbe spostata 
     */
    public class LisRequest // partial 
    {
        public int IdRequest { get; set; }
        public string NameRequest { get; set; }
        public int IdTranslation { get; set; }
        public string PathVideo { get; set; }
        public string Notes { get; set; }
        public string TimeRequest { get; set; }
        public LisTextTrans IdTranslationNavigation { get; set; }
    }
    /**
     * Classe composta con i dati di Request agganciati a quelli di forecast e di traduzione
     * Il filtro sulle request solo dell'utente va fatto sulle tabelle text_ita e text_lis
     * Un campo data c'e' solo se la request e' di un testo meteo mentre forse dovrebbe esserci sempre
     */
    public class LisRequestTrans
    {
        public string ForecastDate { get; set; }
        public string ForecastArea { get; set; }

        public int IdITA { get; set; }
        public int IdLIS { get; set; }

        public int VersionITA { get; set; }
        public int VersionLIS { get; set; }

        // public string PathVideo { get; set; }
        public string TextITA { get; set; }
        public string TextLIS { get; set; }
        public string Status { get; set; }
        public LisRequest LisRequest { get; set; }
        public Route Route { get; set; }
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

        public LisRequest GetLisRequest(int requestid)
        {
            var result = new LisRequest(){};
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand("SELECT * FROM lis_request WHERE id_request = " + requestid, conn);
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    // while (
                    reader.Read();
                    // {
                    result = new LisRequest(){
                        IdRequest = reader.GetInt32("id_request"),
                        NameRequest = reader.GetString("name_request"),
                        IdTranslation = reader.GetInt32("id_translation"),
                        PathVideo = reader.GetString("path_video"),
                        Notes = reader.GetString("notes")
                        }; // );
                    // }
                }
            }
            return result;
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
                            NameRequest = reader.GetString("name_request"),
                            IdTranslation = reader.GetInt32("id_translation"),
                            PathVideo = reader.GetString("path_video"),
                            Notes = reader.GetString("notes")
                        });
                    }
                }
            }
            return list;
        }
    
        public List<LisRequestTrans> GetLisRequestsTrans(int userid)
        {
            List<LisRequestTrans> list = new List<LisRequestTrans>();
            try {
                using (MySqlConnection conn = GetConnection())
                {
                    conn.Open();
                    // "SELECT * FROM lis_request"
                    MySqlCommand cmd = new MySqlCommand(@"
                        SELECT
                            lr.id_request,
                            lr.name_request,
                            lr.id_translation,
                            lr.path_video,
                            lr.notes,
                            lr.time_request,
                            fd.id_forecast_type,
                            ft.name_type,
                            ld.date_day,
                            it.version AS version_ita_edit,
                            it.text_ita AS text_ita_edit,
                            it.id_text_ita AS id_text_ita_edit,
                            li.text_lis AS text_lis_edit,
                            li.id_text_lis AS id_text_lis_edit
                        FROM lis_request                lr 
                            JOIN lis_text_trans2        tr ON tr.id_text_trans = lr.id_translation 
                            LEFT JOIN lis_forecast_data fd ON fd.id_translation = tr.id_text_trans
                            LEFT JOIN lis_forecast_type ft ON ft.id_forecast_type = fd.id_forecast_type 
                            LEFT JOIN lis_forecast      lf ON lf.id_forecast = fd.id_forecast 
                            LEFT JOIN lis_day           ld ON ld.id_day = lf.id_day
                            JOIN lis_text_ita           it ON it.id_text_ita = tr.id_text_ita AND it.version = tr.version_ita 
                            JOIN lis_text_lis           li ON li.id_text_lis = tr.id_text_lis AND li.version = tr.version_lis
                        WHERE
                        it.id_user_edit LIKE '%'
                        AND
                        li.id_user_edit LIKE '%'
                        ORDER BY lr.id_request DESC
                    ;", conn);
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list.Add(new LisRequestTrans(){
                                ForecastDate = Convert.IsDBNull(reader["date_day"]) ? "" : Convert.ToDateTime(reader["date_day"]).ToString("dd/MM/yyyy"), //      reader.GetString("date_day"),
                                ForecastArea = Convert.IsDBNull(reader["name_type"]) ? "" : reader.GetString("name_type"),
                                VersionITA = reader.GetInt32("version_ita_edit"),
                                // PathVideo = "PathVideo",
                                TextITA = reader.GetString("text_ita_edit"),
                                TextLIS = reader.GetString("text_lis_edit"),
                                Status = "Ok",
                                LisRequest = new LisRequest(){
                                    IdRequest = reader.GetInt32("id_request"),
                                    NameRequest = reader.GetString("name_request"),
                                    IdTranslation = reader.GetInt32("id_translation"),
                                    PathVideo = reader.GetString("path_video"),
                                    Notes = reader.GetString("notes"),
                                    TimeRequest = reader.GetString("time_request"),
                                    IdTranslationNavigation = new  LisTextTrans (){
                                        IdTextTrans = reader.GetInt32("id_translation"),
                                        IdTextIta = reader.GetInt32("id_text_ita_edit"),
                                        IdTextLis = reader.GetInt32("id_text_lis_edit")
                                    }
                                }
                            });
                        }
                    }
                }
            } catch (MySqlException ex) {
                Console.WriteLine("LiRequest - MySqlError in GetLisRequestsTrans(int userid). Error: " + ex.Message);
            } catch(Exception ex) {
                Console.WriteLine("LiRequest - Error in GetLisRequestsTrans(int userid). Error: " + ex.Message);
            }
            // Console.WriteLine("LiRequest - getrequestTrans OK: ");
            // list.ForEach(i => Console.Write("{0}\n", i.TextITA));
            return list;
        }

        public LisRequestTrans GetLisRequestTrans(int reqid)
        {
            LisRequestTrans req = new LisRequestTrans(){};
            try {
                using (MySqlConnection conn = GetConnection())
                {
                    conn.Open();
                    // "SELECT * FROM lis_request"
                    MySqlCommand cmd = new MySqlCommand(@"
                        SELECT
                            lr.id_request,
                            lr.name_request,
                            lr.id_translation,
                            lr.path_video,
                            lr.notes,
                            lr.time_request,
                            fd.id_forecast_type,
                            ft.name_type,
                            ld.date_day,

                            it.id_text_ita AS id_text_ita_edit,
                            it.version AS version_ita_edit,
                            it.text_ita AS text_ita_edit,
                            
                            li.id_text_lis AS id_text_lis_edit,
                            li.version AS version_lis_edit,
                            li.text_lis AS text_lis_edit

                        FROM lis_request                lr 
                            JOIN lis_text_trans2        tr ON tr.id_text_trans = lr.id_translation 
                            LEFT JOIN lis_forecast_data fd ON fd.id_translation = tr.id_text_trans
                            LEFT JOIN lis_forecast_type ft ON ft.id_forecast_type = fd.id_forecast_type 
                            LEFT JOIN lis_forecast      lf ON lf.id_forecast = fd.id_forecast 
                            LEFT JOIN lis_day           ld ON ld.id_day = lf.id_day
                            JOIN lis_text_ita           it ON it.id_text_ita = tr.id_text_ita AND it.version = tr.version_ita 
                            JOIN lis_text_lis           li ON li.id_text_lis = tr.id_text_lis AND li.version = tr.version_lis
                        WHERE
                        lr.id_request = " + reqid + @"
                        AND
                        li.id_user_edit LIKE '%'
                    ;", conn);

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        // while (
                          reader.Read(); // )
                        // {
                            req = new LisRequestTrans(){
                                ForecastDate = Convert.IsDBNull(reader["date_day"]) ? "" : Convert.ToDateTime(reader["date_day"]).ToString("dd/MM/yyyy"), //      reader.GetString("date_day"),
                                ForecastArea = Convert.IsDBNull(reader["name_type"]) ? "" : reader.GetString("name_type"),
                                // VersionITA = reader.GetInt32("version_ita_edit"),
                                // PathVideo = "PathVideo",

                                IdITA = reader.GetInt32("id_text_ita_edit"),
                                IdLIS = reader.GetInt32("id_text_lis_edit"),

                                VersionITA = reader.GetInt32("version_ita_edit"),
                                VersionLIS = reader.GetInt32("version_lis_edit"),

                                TextITA = reader.GetString("text_ita_edit"),
                                TextLIS = reader.GetString("text_lis_edit"),
                                Status = "Ok",
                                LisRequest = new LisRequest(){
                                    IdRequest = reader.GetInt32("id_request"),
                                    NameRequest = reader.GetString("name_request"),
                                    IdTranslation = reader.GetInt32("id_translation"),
                                    PathVideo = reader.GetString("path_video"),
                                    Notes = reader.GetString("notes"),
                                    TimeRequest = reader.GetString("time_request"),
                                    IdTranslationNavigation = new  LisTextTrans (){
                                        IdTextTrans = reader.GetInt32("id_translation"),
                                        IdTextIta = reader.GetInt32("id_text_ita_edit"),
                                        IdTextLis = reader.GetInt32("id_text_lis_edit")
                                    }
                                }
                            };
                        // );
                        // }
                    }
                }
            } catch (MySqlException ex) {
                Console.WriteLine("LiRequest - MySqlError in GetLisRequestTrans(int reqid). Error: " + ex.Message);
            } catch(Exception ex) {
                Console.WriteLine("LiRequest - Error in GetLisRequestTrans(int reqid). Error: " + ex.Message);
            }
            // Console.WriteLine("LiRequest - getrequestTrans OK: ");
            // list.ForEach(i => Console.Write("{0}\n", i.TextITA));
            return req;
        }
    }
}
