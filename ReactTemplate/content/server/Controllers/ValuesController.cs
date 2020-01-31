﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

using System.Diagnostics;
// using System.Management.Automation.Runspaces;
// using System.Web.Script.Serialization;
// using System.Text.Json;
// using System.Text.Json.Serialization;

/*
public ActionResult Get()
{
    return Ok(_authors.List());
}
*/
namespace dotnetify_react_template.server.Controllers
{
    [Route("api/[controller]")]
    // [Route("api/[controller]/[target]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly ILogger _logger;

        public ValuesController(ILogger<ValuesController> logger)
        {
            _logger = logger;
        }

        private MySqlConnection connection;
        private string cs = @"server=localhost;port=3306;database=lis2;user=root;password=root";
        // GET api/values
        // [HttpGet]
        [HttpGet("meteo")]
        public ActionResult Get()
        // public string Get()
        // public ActionResult<IEnumerable<string>> Get()
        {
            connection = new MySqlConnection(cs);
            connection.Open();
            string product = "{data: 'Nessun dato per il giorno selezionato'}";
            _logger.LogInformation("ValuesController - Chiamata Get().");

            // MySqlConnection connection;
            // using (MySqlConnection conn = new MySqlConnection("server=localhost;port=3306;database=anychart_db;user=anychart_user;password=anychart_pass"))
            // using (MySqlConnection conn = new MySqlConnection("server=localhost;port=3306;database=lis2;user=root;password=root"))
            using (connection)
            {
                // connection.Open();
                // MySqlCommand cmd = new MySqlCommand("SELECT * FROM sales LIMIT 1", conn);
                /*
                MySqlCommand cmd = new MySqlCommand(@"
                SELECT CONCAT('[',GROUP_CONCAT(JSON_OBJECT('id', tr.id_text_trans,'ita',concat(substr(it.text_ita,1,40),'...'), 'lis',concat(substr(lis.text_lis,1,40),'...'))),']') AS list FROM lis_text_ita AS it JOIN lis_text_lis AS lis JOIN lis_text_trans AS tr WHERE it.id_text_ita = tr.id_text_ita AND lis.id_text_lis = tr.id_text_lis AND tr.id_text_trans > 20;", connection);
                */

                MySqlCommand cmd = new MySqlCommand(@"
                select d.date_day, f.id_forecast, f.id_edition, f.offset_day, fc.id_forecast_type, CASE WHEN f.offset_day = 1 THEN ft.name_type ELSE CONCAT(ft.name_type,' +',f.offset_day) END 'name_type', tr.id_text_trans, it.id_text_ita AS id_it, li.id_text_lis AS id_lis, it.version, JSON_OBJECT('data',substr(it.text_ita,1,2000)) AS list, li.version, substr(li.text_lis,1,2000) FROM lis_day d JOIN lis_forecast f ON d.id_day = f.id_day JOIN lis_forecast_data fc ON f.id_forecast = fc.id_forecast JOIN lis_text_trans tr ON tr.id_text_trans=fc.id_translation JOIN lis_text_ita it ON tr.id_text_ita = it.id_text_ita JOIN lis_text_lis li ON tr.id_text_lis = li.id_text_lis AND it.version = li.version JOIN lis_forecast_type ft ON ft.id_forecast_type = fc.id_forecast_type WHERE it.id_text_ita = it.id_text_ita AND it.version IN ( (SELECT MIN(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita),(SELECT MAX(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita)) AND li.id_text_lis = li.id_text_lis AND li.version IN ( (SELECT MIN(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis),(SELECT MAX(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis)) AND d.date_day = '2019-12-19';", connection);

                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        // product = reader.GetString("product");
                        product = reader.GetString("list");
                    }
                }
            }
            
            connection.Close();
            return Ok(product);
            // return Ok("{\"expiresAt\": \"2015-11-03T10:15:57.000Z\", \"status\": \"SUCCESS\", \"relayState\": \"/myapp/some/deep/link/i/want/to/return/to\", \"sessionToken\": \"00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe\", \"_embedded\": { \"user\": { \"id\": \"00ub0oNGTSWTBKOLGLNR\", \"passwordChanged\": \"2015-09-08T20:14:45.000Z\", \"profile\": { \"login\": \"dade.murphy@example.com\", \"firstName\": \"Dade\", \"lastName\": \"Murphy\", \"locale\": \"en_US\", \"timeZone\": \"America/Los_Angeles\" } } } } ");
            // return Ok(ff); // new string[] { "value1", "value2_" + product };
        }

        // GET api/values/5
        [HttpGet("meteo/{id}")]
        // public ActionResult<string> Get(int id)
        // public ActionResult<string> Get(string id)
        public ActionResult Get(string id)
        {
            string product = "[{'CENTRO E SARDEGNA':'Inizializzazione..'},{'NORD':'Inizializzazione..'}]";
            try {
                connection = new MySqlConnection(cs);
                connection.Open();
                _logger.LogInformation("ValuesController - Chiamata Get(meteo/id).");
                
                // MySqlConnection connection;
                // using (MySqlConnection conn = new MySqlConnection("server=localhost;port=3306;database=anychart_db;user=anychart_user;password=anychart_pass"))
                // using (MySqlConnection conn = new MySqlConnection("server=localhost;port=3306;database=lis2;user=root;password=root"))
                using (connection)
                {
                    // connection.Open();
                    // MySqlCommand cmd = new MySqlCommand("SELECT * FROM sales LIMIT 1", conn);
                    /*
                    MySqlCommand cmd = new MySqlCommand(@"
                    SELECT CONCAT('[',GROUP_CONCAT(JSON_OBJECT('id', tr.id_text_trans,'ita',concat(substr(it.text_ita,1,40),'...'), 'lis',concat(substr(lis.text_lis,1,40),'...'))),']') AS list FROM lis_text_ita AS it JOIN lis_text_lis AS lis JOIN lis_text_trans AS tr WHERE it.id_text_ita = tr.id_text_ita AND lis.id_text_lis = tr.id_text_lis AND tr.id_text_trans > 20;", connection);
                    */

                    /*

                    MySqlCommand cmd = new MySqlCommand(@"
                    select d.date_day, f.id_forecast, f.id_edition, f.offset_day, fc.id_forecast_type, CASE WHEN f.offset_day = 1 THEN ft.name_type ELSE CONCAT(ft.name_type,' +',f.offset_day) END 'name_type', tr.id_text_trans, it.id_text_ita AS id_it, li.id_text_lis AS id_lis, it.version, JSON_OBJECT('data',substr(it.text_ita,1,2000)) AS list, li.version, substr(li.text_lis,1,2000) FROM lis_day d JOIN lis_forecast f ON d.id_day = f.id_day JOIN lis_forecast_data fc ON f.id_forecast = fc.id_forecast JOIN lis_text_trans tr ON tr.id_text_trans=fc.id_translation JOIN lis_text_ita it ON tr.id_text_ita = it.id_text_ita JOIN lis_text_lis li ON tr.id_text_lis = li.id_text_lis AND it.version = li.version JOIN lis_forecast_type ft ON ft.id_forecast_type = fc.id_forecast_type WHERE it.id_text_ita = it.id_text_ita AND it.version IN ( (SELECT MIN(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita),(SELECT MAX(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita)) AND li.id_text_lis = li.id_text_lis AND li.version IN ( (SELECT MIN(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis),(SELECT MAX(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis)) AND d.date_day = '" + id + "';", connection);
                    */

                    // CONCAT(name_type,"_",id_edition) invece di name_type

                    /*
                    MySqlCommand cmd = new MySqlCommand(@"
                    SELECT JSON_ARRAYAGG(kk) AS list FROM (SELECT JSON_OBJECTAGG(name_type, text_ita) AS kk FROM (SELECT d.date_day, f.id_forecast, f.id_edition, f.offset_day, fc.id_forecast_type, CASE WHEN f.offset_day = 1 THEN ft.name_type ELSE CONCAT(ft.name_type, ' +', f.offset_day) END 'name_type', tr.id_text_trans, it.id_text_ita AS id_it, li.id_text_lis AS id_lis, it.version AS it_version, it.text_ita, li.version AS li_version, li.text_lis FROM lis_day d JOIN lis_forecast f ON d.id_day = f.id_day JOIN lis_forecast_data fc ON f.id_forecast = fc.id_forecast JOIN lis_text_trans tr ON tr.id_text_trans=fc.id_translation JOIN lis_text_ita it ON tr.id_text_ita = it.id_text_ita JOIN lis_text_lis li ON tr.id_text_lis = li.id_text_lis AND it.version = li.version JOIN lis_forecast_type ft ON ft.id_forecast_type = fc.id_forecast_type WHERE it.id_text_ita = it.id_text_ita AND it.version IN ((SELECT MIN(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita),(SELECT MAX(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita)) AND li.id_text_lis = li.id_text_lis AND li.version IN ((SELECT MIN(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis),(SELECT MAX(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis)) AND d.date_day = '" + id + "' ORDER BY f.id_edition, fc.id_forecast_type, it.version) AS hh GROUP BY text_ita) AS klo;", connection);
                    */

                    /*
                    SELECT JSON_ARRAYAGG(kk) AS list FROM (SELECT JSON_OBJECTAGG(name_type, text_ita) AS kk FROM (SELECT d.date_day, f.id_forecast, f.id_edition, f.offset_day, fc.id_forecast_type, CASE WHEN f.offset_day = 1 THEN ft.name_type ELSE CONCAT(ft.name_type,' +', f.offset_day) END 'name_type', tr.id_text_trans, it.id_text_ita AS id_it, li.id_text_lis AS id_lis, it.version AS it_version, it.text_ita, li.version AS li_version, li.text_lis FROM lis_day d JOIN lis_forecast f ON d.id_day = f.id_day JOIN lis_forecast_data fc ON f.id_forecast =
                    fc.id_forecast JOIN lis_text_trans tr ON tr.id_text_trans=fc.id_translation JOIN lis_text_ita it ON tr.id_text_ita = it.id_text_ita JOIN lis_text_lis li ON tr.id_text_lis = li.id_text_lis AND it.version = li.version JOIN lis_forecast_type ft ON ft.id_forecast_type = fc.id_forecas
                    t_type WHERE it.id_text_ita = it.id_text_ita AND it.version IN ((SELECT MIN(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita),(SELECT MAX(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita)) AND li.id_text_lis = li.id_text_lis AND li.version IN ((SELECT MI
                    N(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis),(SELECT MAX(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis)) AND d.date_day = '2020-01-13' ORDER BY f.id_edition, fc.id_forecast_type, it.version) AS hh GROUP BY text_ita) AS klo;
                    */

                    MySqlCommand cmd = new MySqlCommand(@"
                    SELECT JSON_OBJECT( 'status', 'success', 'data_day', MIN(date_day), 'id_day', MIN(id_day), 'timeframe', JSON_OBJECT( 'id_timeframe', MAX(id_timeframe), 'editions', JSON_ARRAY( JSON_OBJECT ( 'date_day', MIN(date_day), 'id_edition', MIN(id_edition), 'time_edition', MIN(name_edition), 'id_timeframe', MIN(id_timeframe), 'forecast_data', (SELECT JSON_ARRAYAGG(obj)) ), JSON_OBJECT ( 'date_day', MAX(date_day), 'id_edition', MAX(id_edition), 'time_edition', MAX(name_edition), 'id_timeframe', MAX(id_timeframe), 'forecast_data', (SELECT JSON_ARRAYAGG(obj)) )))) AS list FROM (SELECT * FROM ( SELECT d.id_day, d.date_day, le.name_edition, le.id_edition, tf.id_timeframe, JSON_OBJECT('date_day',d.date_day,'id_forecast',f.id_forecast, 'edition', f.id_edition, 'offset_days',f.offset_day, 'id_forecast_type',fc.id_forecast_type, 'name_type',( CASE WHEN f.offset_day = 1 THEN ft.name_type ELSE CONCAT(ft.name_type,' +',f.offset_day) END), 'id_text_trans',tr.id_text_trans,'id_text_ita',it.id_text_ita,'id_text_lis',li.id_text_lis,'it_version',it.version,'text_ita', it.text_ita,'li_version',li.version,'text_lis',li.text_lis) AS obj FROM lis_day           d JOIN lis_timeframe     tf ON d.id_timeframe = tf.id_timeframe JOIN lis_forecast      f ON d.id_day = f.id_day JOIN lis_forecast_data fc ON f.id_forecast = fc.id_forecast JOIN lis_text_trans    tr ON tr.id_text_trans=fc.id_translation JOIN lis_text_ita it ON tr.id_text_ita = it.id_text_ita JOIN lis_text_lis li ON tr.id_text_lis = li.id_text_lis AND it.version = li.version JOIN lis_forecast_type ft ON ft.id_forecast_type = fc.id_forecast_type JOIN lis_edition le ON f.id_edition = le.id_edition WHERE it.id_text_ita = it.id_text_ita AND it.version IN ((SELECT MIN(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita),(SELECT MAX(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita)) AND li.id_text_lis = li.id_text_lis AND li.version IN ((SELECT MIN(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis),(SELECT MAX(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis)) AND d.date_day = '" + id + "' ORDER BY f.id_edition, fc.id_forecast_type, it.version ) AS sub GROUP BY id_day, date_day, name_edition, id_edition, id_timeframe, obj ) AS lot;", connection);

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            // product = reader.GetString("product");
                            if (!reader.IsDBNull(0))
                            {
                                product = reader.GetString("list");
                            }
                            else
                            {
                                product = "[{\"CENTRO E SARDEGNA\":\"Nessun dato per il giorno selezionato\"},{\"NORD\":\"Nessun dato per il giorno selezionato\"}]";
                            }
                        }
                    }
                }
                connection.Close();
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogInformation("ValuesController - Error in [HttpGet(\"meteo/id\")]. Error: " + ex.Message);
            }

            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.FileName = @"powershell.exe";
            // startInfo.Arguments = @"& 'd:\test.ps1'";
            startInfo.Arguments = @"-Command ""echo 'd:\test.ps1'""";
            startInfo.RedirectStandardOutput = true;
            startInfo.RedirectStandardError = true;
            startInfo.UseShellExecute = false;
            startInfo.CreateNoWindow = true;
            
            Process process = new Process();
            process.StartInfo = startInfo;
            process.Start();

            string output = process.StandardOutput.ReadToEnd();
            Console.WriteLine("ValuesController.cs - process powershell output: " + output);
            // Assert.IsTrue(output.Contains("StringToBeVerifiedInAUnitTest"));

            // string errors = process.StandardError.ReadToEnd();
            // Assert.IsTrue(string.IsNullOrEmpty(errors));

            // RunspaceConfiguration runspaceConfiguration = RunspaceConfiguration.Create();
            /*
            Runspace runspace = RunspaceFactory.CreateRunspace(runspaceConfiguration);
            runspace.Open();

            RunspaceInvoke scriptInvoker = new RunspaceInvoke(runspace);

            Pipeline pipeline = runspace.CreatePipeline();

            //Here's how you add a new script with arguments
            Command myCommand = new Command(scriptfile);
            CommandParameter testParam = new CommandParameter("key","value");
            myCommand.Parameters.Add(testParam);

            pipeline.Commands.Add(myCommand);

            // Execute PowerShell script
            results = pipeline.Invoke();

            */

            return Ok(product);
            // return Ok("{\"expiresAt\": \"2015-11-03T10:15:57.000Z\", \"status\": \"SUCCESS\", \"relayState\": \"/myapp/some/deep/link/i/want/to/return/to\", \"sessionToken\": \"00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe\", \"_embedded\": { \"user\": { \"id\": \"00ub0oNGTSWTBKOLGLNR\", \"passwordChanged\": \"2015-09-08T20:14:45.000Z\", \"profile\": { \"login\": \"dade.murphy@example.com\", \"firstName\": \"Dade\", \"lastName\": \"Murphy\", \"locale\": \"en_US\", \"timeZone\": \"America/Los_Angeles\" } } } } ");
            // return Ok(ff); // new string[] { "value1", "value2_" + product };


            // return "value";
        }

        // POST api/values
        // [HttpPost]
        [HttpPost("menu")]
        // public void Post([FromBody] string value)
        public void InsertMenu([FromBody] string value)
        {
            try {
                connection = new MySqlConnection(cs);
                connection.Open();
                
                _logger.LogInformation("ValuesController - Chiamata Post().");
                _logger.LogInformation("ValuesController - value:");
                _logger.LogInformation(value);
                object vmArgs = null;
                vmArgs = JsonConvert.DeserializeObject(value);

                dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
                var idf = results.value;
                // var name= results.Name;

                // object o = JsonConvert.DeserializeObject(json1);
                _logger.LogInformation("ValuesController - vmArgs:");
                _logger.LogInformation(vmArgs.ToString());
                // JavaScriptSerializer js = new JavaScriptSerializer();
                // IDictionary<string, string> rre = js.Deserialize<IDictionary<string, string>>(value);
                using (connection) {
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = connection;
                    // string SQL = "INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (@mcUserName, @mcUserPass, @twUserName, @twUserPass)";
                    string SQL = "INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (?auth, ?name_menu, ?url_menu, ?notes)";
                    // string SQL = @"INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (true, 'frefref', 'gf/g/hfhg', 'noteeeergergegee')";
                    command.CommandText = SQL;
                    /*
                    command.Parameters.Add("@mcUserName", true);
                    command.Parameters.Add("@mcUserPass", "pingopongo");
                    command.Parameters.Add("@twUserName", "/path/to/menuvalue");
                    command.Parameters.Add("@twUserPass", "note_da_pingopongo");
                    */
                    // try AddWithValue
                    command.Parameters.AddWithValue("?auth", true);
                    command.Parameters.AddWithValue("?name_menu", idf);
                    command.Parameters.AddWithValue("?url_menu", "/path/to/menuvalue_1_4");
                    command.Parameters.AddWithValue("?notes", "menu_notes_!_1_4");
                    command.ExecuteNonQuery();
                }
                connection.Close();
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogInformation("ValuesController - Error in [HttpPost(\"menu\")]. Error: " + ex.Message);
            }
        }


        // POST api/values
        // [HttpPost]
        [HttpPost("setting")]
        // public void Post([FromBody] string value)
        public void InsertSetting([FromBody] string value)
        {
            try {
                connection = new MySqlConnection(cs);
                connection.Open();
                
                _logger.LogInformation("ValuesController - Chiamata Post().");
                _logger.LogInformation("ValuesController - value:");
                _logger.LogInformation(value);
                object vmArgs = null;
                vmArgs = JsonConvert.DeserializeObject(value);

                dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
                var idf = results.value;
                // var name= results.Name;

                // object o = JsonConvert.DeserializeObject(json1);
                _logger.LogInformation("ValuesController - vmArgs:");
                _logger.LogInformation(vmArgs.ToString());
                // JavaScriptSerializer js = new JavaScriptSerializer();
                // IDictionary<string, string> rre = js.Deserialize<IDictionary<string, string>>(value);
                using (connection) {
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = connection;
                    // string SQL = "INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (@mcUserName, @mcUserPass, @twUserName, @twUserPass)";
                    string SQL = "INSERT INTO lis_setting ( name_setting, value_setting, notes ) VALUES ( ?name_setting, ?value_setting, ?notes )";

                    // string SQL = @"INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (true, 'frefref', 'gf/g/hfhg', 'noteeeergergegee')";
                    command.CommandText = SQL;
                    command.Parameters.AddWithValue("?name_setting", idf);
                    command.Parameters.AddWithValue("?value_setting", "/path/to/menuvalue_1_4");
                    command.Parameters.AddWithValue("?notes", "menu_notes_!_1_4");
                    command.ExecuteNonQuery();
                }
                connection.Close();
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogInformation("ValuesController - Error in [HttpPost(\"setting\")]. Error: " + ex.Message);
            }
        }

        [HttpPost("test/{id}")]
        // public ApiResponse PushMessage(int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        // public ActionResult<string> Post( int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        public ActionResult<string> TestPost(int id, [FromBody] string value)
        {
            _logger.LogInformation("ValuesController POST test - post_id: " + id);
            _logger.LogInformation("ValuesController POST test - value: " + value);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
            var idf = results.value;
            // return new JsonResult<string>("rr"); // value, new JsonSerializerSettings(), Encoding.UTF8, this);
            // return "Prova";
            return Ok(new string[] { "value1", "value2_" + idf });
        }

        // POST api/values/text
        // [HttpPost("{id}")]
        [HttpPost("text")]
        // public string JsonStringBody([FromBody] string value)
        public string InsertText([FromBody] string value)
        {
            _logger.LogInformation("ValuesController POST - value: " + value);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
            var idf = results.value;
            try {
                connection = new MySqlConnection(cs);
                connection.Open();
                using (connection) {
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = connection;

                    string SQL = "INSERT INTO lis_text_ita (id_text_ita, id_user_edit, version, text_ita, notes) VALUES ((select MAX(id_text_ita)+1 from (select * from lis_text_ita) AS T1), 2, ?version, 'texttt_ita', 'note_ita_HttpPost')";
                    command.CommandText = SQL;
                    command.Parameters.AddWithValue("?version", idf);
                    // command.Parameters.AddWithValue("?name_menu", "menu_name");
                    // command.Parameters.AddWithValue("?url_menu", "/path/to/menuvalue");
                    // command.Parameters.AddWithValue("?notes", "menu_notes_!");
                    command.ExecuteNonQuery();

                    SQL = "INSERT INTO lis_text_lis (id_text_lis, id_user_edit, version, text_lis, xml_lis, notes) VALUES ((select MAX(id_text_lis)+1 from (select * from lis_text_lis) AS T2),2, ?version, 'texttt_lis', '<xml>test</xml>', 'note_lis_HttpPost')";
                    command.CommandText = SQL;
                    // command.Parameters.AddWithValue("?version", idf); // Gia' specificato sopra - anche se poi magari le versioni potranno essere diverse tra ita e lis
                    // command.Parameters.AddWithValue("?name_menu", "menu_name");
                    // command.Parameters.AddWithValue("?url_menu", "/path/to/menuvalue");
                    // command.Parameters.AddWithValue("?notes", "menu_notes_!");
                    command.ExecuteNonQuery();
                }
                connection.Close();
                return "{\"expiresAt\": \"Okei\"}";
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogInformation("ValuesController - Error in [HttpPost(\"text\")]. Error: " + ex.Message);
                return "{\"expiresAt\": \"Non Okei\"}";
            }
            // return content;
        }

        // PUT api/values/menu/5
        [HttpPut("menu/{id}")]
        // public void Put(int id, [FromBody] string value)
        public void UpdateMenu(int id, [FromBody] string value)
        {
            _logger.LogInformation("ValuesController PUT - post_id: " + id);
            _logger.LogInformation("ValuesController PUT - value: " + value);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
            var idf = results.value;
            try {
                connection = new MySqlConnection(cs);
                connection.Open();
                using (connection) {
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = connection;
                    string SQL = "UPDATE lis_menu ( auth, name_menu, url_menu, notes ) SET auth = ?auth, name_menu = ?name_menu, url_menu = ?url_menu, notes = ?notes WHERE id_menu = ?id)";
                    command.CommandText = SQL;
                    command.Parameters.AddWithValue("?auth", true);
                    command.Parameters.AddWithValue("?name_menu", "menu_name");
                    command.Parameters.AddWithValue("?url_menu", "/path/to/menuvalue_new");
                    command.Parameters.AddWithValue("?notes", "menu_notes_!_new");
                    command.Parameters.AddWithValue("?id", id);
                    command.ExecuteNonQuery();
                }
                connection.Close();
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogInformation("ValuesController - Error in [HttpPut(\"menu\")]. Error: " + ex.Message);
            }
        }

        // PUT api/values/setting/5
        [HttpPut("setting/{id}")]
        // public void Put(int id, [FromBody] string value)
        public void UpdateSetting(string id, [FromBody] string value)
        {
            _logger.LogInformation("ValuesController PUT - post_id: " + id);
            _logger.LogInformation("ValuesController PUT - value: " + value);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
            var idf = results.value;

            try {
                connection = new MySqlConnection(cs);
                connection.Open();
                using (connection) {
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = connection;
                    string SQL = "UPDATE lis_setting SET value_setting = ?value WHERE name_setting = ?name;";
                    command.CommandText = SQL;
                    // command.Parameters.AddWithValue("?auth", true);
                    command.Parameters.AddWithValue("?value", idf); //"menu_name");
                    command.Parameters.AddWithValue("?name", id);
                    // command.Parameters.AddWithValue("?notes", "menu_notes_!_new");
                    // command.Parameters.AddWithValue("?id", id);
                    command.ExecuteNonQuery();
                }
                connection.Close();
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogInformation("ValuesController - Error in [HttpPut(\"setting\")]. Error: " + ex.Message);
            }
        }

        // DELETE api/values/5
        [HttpDelete("menu/{id}")]
        public void Delete(int id)
        {
        }
    }
}
