﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.IO;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;

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
    public static class FileSaveExtension
    {
        public static async Task SaveAsAsync(this IFormFile formFile, string filePath)
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await formFile.CopyToAsync(stream);
            }
        }

        public static void SaveAs(this IFormFile formFile, string filePath)
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                formFile.CopyTo(stream);
            }
        }
    }
    [Route("api/[controller]")]
    // [Route("api/[controller]/[target]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly ILogger _logger;
        private string _connectionString;
        private string _translatescript;
        public class PostInfo
        {
            public string value { get; set; }
        }

        public ValuesController(IConfiguration configuration, ILogger<ValuesController> logger)
        {
            // _connectionString = configuration.GetConnectionString("ConnectionStrings:lis");
            Console.WriteLine("ValuesController.cs - costruttore, configurazione: " + configuration.ToString());

            _connectionString = configuration.GetConnectionString("lis"); //  _configuration.GetValue<string>("ConnectionStrings:lis");
            Console.WriteLine("ValuesController.cs - costruttore, stringa connessione DB MySQL: " + _connectionString); //_configuration["ConnectionStrings:lis"]);

            _translatescript = configuration.GetValue<string>("Scripts:lis");
            Console.WriteLine("ValuesController.cs - costruttore, script Powershell di translate: " + _translatescript); //_configuration["ConnectionStrings:lis"]);

            _logger = logger;

        }

        private MySqlConnection connection;
        // private string _connectionStringcs = @"server=localhost;port=3306;database=lis2;user=root;password=root";
        // GET api/values
        // [HttpGet]
        [HttpGet("meteo")]
        public ActionResult Get_meteo()
        // public string Get()
        // public ActionResult<IEnumerable<string>> Get()
        {
            connection = new MySqlConnection(this._connectionString);
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
        public ActionResult Get_meteo_id(string id)
        {
            string product = "[{'CENTRO E SARDEGNA':'Inizializzazione..'},{'NORD':'Inizializzazione..'}]";
            try {
                connection = new MySqlConnection(this._connectionString);
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

                    /*
                    Versione corretta ma non formattata
                                        SELECT JSON_OBJECT( 'status', 'success', 'data_day', MIN(date_day), 'id_day', MIN(id_day), 'timeframe', JSON_OBJECT( 'id_timeframe', MAX(id_timeframe), 'editions', JSON_ARRAY( JSON_OBJECT ( 'date_day', MIN(date_day), 'id_edition', MIN(id_edition), 'time_edition', MIN(name_edition), 'id_timeframe', MIN(id_timeframe), 'forecast_data', (SELECT JSON_ARRAYAGG(obj)) ), JSON_OBJECT ( 'date_day', MAX(date_day), 'id_edition', MAX(id_edition), 'time_edition', MAX(name_edition), 'id_timeframe', MAX(id_timeframe), 'forecast_data', (SELECT JSON_ARRAYAGG(obj)) )))) AS list FROM (SELECT * FROM ( SELECT d.id_day, d.date_day, le.name_edition, le.id_edition, tf.id_timeframe, JSON_OBJECT('date_day',d.date_day,'id_forecast',f.id_forecast, 'edition', f.id_edition, 'offset_days',f.offset_day, 'id_forecast_type',fc.id_forecast_type, 'name_type',( CASE WHEN f.offset_day = 1 THEN ft.name_type ELSE CONCAT(ft.name_type,' +',f.offset_day) END), 'id_text_trans',tr.id_text_trans,'id_text_ita',it.id_text_ita,'id_text_lis',li.id_text_lis,'it_version',it.version,'text_ita', it.text_ita,'li_version',li.version,'text_lis',li.text_lis) AS obj FROM lis_day           d JOIN lis_timeframe     tf ON d.id_timeframe = tf.id_timeframe JOIN lis_forecast      f ON d.id_day = f.id_day JOIN lis_forecast_data fc ON f.id_forecast = fc.id_forecast JOIN lis_text_trans    tr ON tr.id_text_trans=fc.id_translation JOIN lis_text_ita it ON tr.id_text_ita = it.id_text_ita JOIN lis_text_lis li ON tr.id_text_lis = li.id_text_lis AND it.version = li.version JOIN lis_forecast_type ft ON ft.id_forecast_type = fc.id_forecast_type JOIN lis_edition le ON f.id_edition = le.id_edition WHERE it.id_text_ita = it.id_text_ita AND it.version IN ((SELECT MIN(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita),(SELECT MAX(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita)) AND li.id_text_lis = li.id_text_lis AND li.version IN ((SELECT MIN(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis),(SELECT MAX(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis)) AND d.date_day = '" + id + "' ORDER BY f.id_edition, it.version, fc.id_forecast_type ) AS sub GROUP BY id_day, date_day, name_edition, id_edition, id_timeframe, obj ) AS lot;", connection);
                    */
                    // Versione con anche path_video
                    MySqlCommand cmd = new MySqlCommand(@"
                            SELECT JSON_OBJECT(
                            'status', 'success',
                            'data_day', Min(date_day),
                            'id_day', Min(id_day),
                            'timeframe', JSON_OBJECT(
                            'id_timeframe', Max(id_timeframe), 
                            'editions', JSON_ARRAY(JSON_OBJECT(
                                'date_day', Min(date_day),
                                
                                'offsets', JSON_OBJECT(
                                'min', Min(offset_day),
                                'max', Max(offset_day)),
                                
                                'id_edition', Min(id_edition), 
                                'time_edition', Min(name_edition),
                                'id_timeframe', Min(id_timeframe),
                                'forecast_data', (SELECT 
                                JSON_ARRAYAGG(obj))), JSON_OBJECT(
                                    'date_day', Max(date_day), 
                                    'id_edition', Max(id_edition), 
                                    'time_edition', Max(name_edition), 
                                    'id_timeframe', Max(id_timeframe),
                                    'forecast_data', (SELECT 
                                    JSON_ARRAYAGG(obj)))))) AS list 
                                        FROM   (SELECT * 
                                                FROM   (SELECT d.id_day, 
                                                            d.date_day, 
                                                            le.name_edition, 
                                                            le.id_edition, 
                                                            f.offset_day,
                                                            tf.id_timeframe, 
                                            Json_object('date_day', d.date_day, 'id_forecast', f.id_forecast, 
                                            'edition', 
                                            f.id_edition, 'offset_days', f.offset_day, 
                                            'id_forecast_type', fc.id_forecast_type, 
                                            'name_type', ( CASE 
                                            WHEN f.offset_day = 1 THEN ft.name_type 
                                            ELSE Concat(ft.name_type, ' +', f.offset_day) 
                                            end ), 
                                        'id_text_trans', tr.id_text_trans, 'id_text_ita', it.id_text_ita, 'id_text_lis', li.id_text_lis, 'it_version', it.version, 'text_ita',
                                        it.text_ita, 'li_version', li.version, 'text_lis', li.text_lis, 'path_video', lr.path_video) AS obj 
                                        FROM   lis_day d 
                                        JOIN lis_timeframe tf 
                                        ON d.id_timeframe = tf.id_timeframe 
                                        JOIN lis_forecast f 
                                        ON d.id_day = f.id_day 
                                        JOIN lis_forecast_data fc 
                                        ON f.id_forecast = fc.id_forecast 
                                        JOIN lis_text_trans tr 
                                        ON tr.id_text_trans = fc.id_translation 
                                        LEFT JOIN lis_request lr 
                                        ON tr.id_text_trans = lr.id_translation 
                                        JOIN lis_text_ita it 
                                        ON tr.id_text_ita = it.id_text_ita 
                                        JOIN lis_text_lis li 
                                        ON tr.id_text_lis = li.id_text_lis 
                                            AND it.version = li.version 
                                        JOIN lis_forecast_type ft 
                                        ON ft.id_forecast_type = fc.id_forecast_type 
                                        JOIN lis_edition le 
                                        ON f.id_edition = le.id_edition 
                                        WHERE  it.id_text_ita = it.id_text_ita 
                                        AND it.version IN ( (SELECT Min(version) 
                                                            FROM   lis_text_ita 
                                                            WHERE  id_text_ita = it.id_text_ita), 
                                                            (SELECT Max(version) 
                                                            FROM   lis_text_ita 
                                                            WHERE 
                                                                id_text_ita = it.id_text_ita) ) 
                                        AND li.id_text_lis = li.id_text_lis 
                                        AND li.version IN ( (SELECT Min(version) 
                                                            FROM   lis_text_lis 
                                                            WHERE  id_text_lis = li.id_text_lis), 
                                                            (SELECT Max(version) 
                                                            FROM   lis_text_lis 
                                                            WHERE 
                                                                id_text_lis = li.id_text_lis) ) 
                                        AND d.date_day = '" + id + @"' 
                                        ORDER  BY f.id_edition, 
                                        it.version, 
                                        fc.id_forecast_type) AS sub 
                                        GROUP  BY id_day, 
                                                date_day, 
                                                name_edition, 
                                                offset_day,
                                                id_edition, 
                                                id_timeframe, 
                                                obj) AS lot;", 
                    connection);

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
                Console.WriteLine("ValuesController - Error in [HttpGet(\"meteo/id\")]. Error: " + ex.Message);
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

        
        [HttpGet("translate1")]
        public ActionResult Get_translate() // ActionResult Get_translate()
        // public string Get()
        // public ActionResult<IEnumerable<string>> Get()
        {
            string output = "Default";
            try {
                ProcessStartInfo startInfo = new ProcessStartInfo();
                startInfo.FileName = @"powershell.exe";
                // startInfo.Arguments = @"& 'd:\test.ps1'";
                // PowerShell.exe -ExecutionPolicy Bypass -File .runme.ps1
                // startInfo.Arguments = @"-Command ""echo 'd:\test.ps1'""";
                // startInfo.Arguments = @"-ExecutionPolicy Bypass -File d:\test.ps1";
                startInfo.Arguments = @"-NoLogo -ExecutionPolicy Bypass -Command """ + _translatescript + @" -Param1 Hello -Param2 World""";
                startInfo.RedirectStandardOutput = true;
                startInfo.RedirectStandardError = true;
                startInfo.UseShellExecute = false;
                startInfo.CreateNoWindow = true;
                
                Process process = new Process();
                process.StartInfo = startInfo;
                process.Start();

                output = process.StandardOutput.ReadToEnd().Replace(System.Environment.NewLine, "");
                Console.WriteLine("ValuesController.cs - process powershell output: " + output);
            }
            catch(InvalidOperationException ex){
                Console.WriteLine(ex.Message);
            }
            catch(Exception ex) {
                Console.WriteLine(ex.Message);
            }

            // connection.Close();
            // return output;
            return Ok("{\"translation\": \"" + output + "\"}");
            // return Ok("{\"expiresAt\": \"2015-11-03T10:15:57.000Z\", \"status\": \"SUCCESS\", \"relayState\": \"/myapp/some/deep/link/i/want/to/return/to\", \"sessionToken\": \"00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe\", \"_embedded\": { \"user\": { \"id\": \"00ub0oNGTSWTBKOLGLNR\", \"passwordChanged\": \"2015-09-08T20:14:45.000Z\", \"profile\": { \"login\": \"dade.murphy@example.com\", \"firstName\": \"Dade\", \"lastName\": \"Murphy\", \"locale\": \"en_US\", \"timeZone\": \"America/Los_Angeles\" } } } } ");
            // return Ok(ff); // new string[] { "value1", "value2_" + product };
        }


        // POST api/values
        // [HttpPost]
        [HttpPost("menu")]
        // public void Post([FromBody] string value)
        public void InsertMenu([FromBody] string value)
        {
            try {
                connection = new MySqlConnection(this._connectionString);
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
                connection = new MySqlConnection(this._connectionString);
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

        [HttpPost("testpost_0/{id}")]
        // public ApiResponse PushMessage(int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        // public ActionResult<string> Post( int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        public ActionResult<string> TestPost(int id, [FromBody] string json)
        {
            _logger.LogInformation("ValuesController POST test - post_id: " + id);
            _logger.LogInformation("ValuesController POST test - json: " + json);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(json);
            var idf = results.value;
            // return new JsonResult<string>("rr"); // value, new JsonSerializerSettings(), Encoding.UTF8, this);
            // return "Prova";
            return Ok(new string[] { "id_passato_querystring_" + id, "value_passato_json_post_" + idf });
            // $ curl -X POST -d '"{\"value\":\"test_setting_name\"}"' --header "Content-Type: application/json" http://localhost:5000/api/values/testpost_0/699
            // 100   109    0    74  100    35    197     93 --:--:-- --:--:-- --:--:--   290["id_passato_querystring_699","value_passato_json_post_test_setting_name"]
        }

        [HttpPost("testpost_1/{id}")]
        // public ApiResponse PushMessage(int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        // public ActionResult<string> Post( int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        public ActionResult<string> TestPost_1(int id, [FromBody] string json)
        {
            _logger.LogInformation("ValuesController POST test - post_id: " + id);
            // _logger.LogInformation("ValuesController POST test - value: " + value);
            // dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
            // var idf = results.value;
            // return new JsonResult<string>("rr"); // value, new JsonSerializerSettings(), Encoding.UTF8, this);
            // return "Prova";
            return Ok(new string[] { "value_json_string_" + json, "id_querystring_" + id });
            // $ curl -X POST -d '"{\"value\":\"test_setting_name\"}"' --header "Content-Type: application/json" http://localhost:5000/api/values/testpost_1/699
            // 100   111    0    76  100    35   5066   2333 --:--:-- --:--:-- --:--:--  7400["value_json_string_{\"value\":\"test_setting_name\"}","id_querystring_699"]

        }

        [HttpPost("testpost_2")]
        // public ApiResponse PushMessage(int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        // public ActionResult<string> Post( int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        public ActionResult<string> TestPost_2([FromBody] string json)
        {
            // _logger.LogInformation("ValuesController POST test - post_id: " + id);
            _logger.LogInformation("ValuesController POST test - value: " + json);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(json);
            var idf = results.value;
            // return new JsonResult<string>("rr"); // value, new JsonSerializerSettings(), Encoding.UTF8, this);
            // return "Prova";
            return Ok(new string[] { "value_json_" + idf, "value_totale_" + json });
            // $ curl -X POST -d '"{\"value\":\"test_setting_name\"}"' --header "Content-Type: application/json" http://localhost:5000/api/values/testpost_2
            // 100   116    0    81  100    35  81000  35000 --:--:-- --:--:-- --:--:--  113k["value_json_test_setting_name","value_totale_{\"value\":\"test_setting_name\"}"]

        }

        [HttpPost("testpost_3")]
        // public ApiResponse PushMessage(int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        // public ActionResult<string> Post( int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        public ActionResult<string> TestPost_3([FromBody] PostInfo json)
        {
            // _logger.LogInformation("ValuesController POST test - post_id: " + id);
            _logger.LogInformation("ValuesController POST test - value: " + json);
            // dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
            var idf = json.value; // ["value"]; // results.value;
            // return new JsonResult<string>("rr"); // value, new JsonSerializerSettings(), Encoding.UTF8, this);
            // return "Prova";
            return Ok(new string[] { "value_idf_" + idf, "value_tot_" + json});
            // $ curl -X POST -d '"{\"value\":\"test_setting_name\"}"' --header "Content-Type: application/json" http://localhost:5000/api/values/testpost_3
            // 100    68    0    33  100    35    302    321 --:--:-- --:--:-- --:--:--   623{"":["The input was not valid."]}
            // $ curl -X POST -d '{"value":"test_setting_name"}' --header "Content-Type: application/json" http://localhost:5000/api/values/testpost_3
            // 100   141    0   112  100    29   109k  29000 --:--:-- --:--:-- --:--:--  137k["value_idf_test_setting_name","value_tot_dotnetify_react_template.server.Controllers.ValuesController+PostInfo"]
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
                connection = new MySqlConnection(this._connectionString);
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

        [HttpPost("request")]
        // public string JsonStringBody([FromBody] string value)
        public string InsertRequest([FromBody] string value)
        {
            _logger.LogInformation("ValuesController POST - value: " + value);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
            // var idf = results.value;
            try {
                connection = new MySqlConnection(this._connectionString);
                connection.Open();
                using (connection) {
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = connection;

                    // INSERT INTO `lis_request` ( `id_translation`, `path_video`, `notes`) VALUES ( 1, '/path/to/video/1.mp4', 'Note della request relativa alla translation 1. Il fatto che una translation abbia una request significa che ne e\' stata avviato il rendering con relativo salvataggio degli artefatti su ftp' );

                    string SQL = "INSERT INTO lis_request ( id_translation, path_video, notes) VALUES (?id, ?path, ?notes)";
                    command.CommandText = SQL;
                    command.Parameters.AddWithValue("?id", results.id);
                    command.Parameters.AddWithValue("?path", results.path);
                    // command.Parameters.AddWithValue("?url_menu", "/path/to/menuvalue");
                    command.Parameters.AddWithValue("?notes", results.notes);
                    command.ExecuteNonQuery();

                    // SQL = "INSERT INTO lis_text_lis (id_text_lis, id_user_edit, version, text_lis, xml_lis, notes) VALUES ((select MAX(id_text_lis)+1 from (select * from lis_text_lis) AS T2),2, ?version, 'texttt_lis', '<xml>test</xml>', 'note_lis_HttpPost')";
                    // command.CommandText = SQL;
                    // command.Parameters.AddWithValue("?version", idf); // Gia' specificato sopra - anche se poi magari le versioni potranno essere diverse tra ita e lis
                    // command.Parameters.AddWithValue("?name_menu", "menu_name");
                    // command.Parameters.AddWithValue("?url_menu", "/path/to/menuvalue");
                    // command.Parameters.AddWithValue("?notes", "menu_notes_!");
                    // command.ExecuteNonQuery();
                }
                connection.Close();
                return "{\"insertRequest\": \"Ok\"}";
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogInformation("ValuesController - Error in [HttpPost(\"request\")]. Error: " + ex.Message);
                return "{\"insertRequest\": \"Non Okei\"}";
            }
            // return content;
        }

        [HttpPost("translate")]
        // public void Post([FromBody] string value)
        public ActionResult Post_translate([FromBody] string json) //  [FromBody] string b)
        {
            _logger.LogInformation("ValuesController POST translate - value: " + json);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(json);
            var translateText = results.value;
            // _logger.LogInformation("ValuesController POST publish - value: ");
            // _logger.LogInformation(idf);
            Console.WriteLine("ValuesController.cs - process powershell output: " + translateText);
            try {

                ProcessStartInfo startInfo = new ProcessStartInfo();
                startInfo.FileName = @"powershell.exe";
                // startInfo.Arguments = @"& 'd:\test.ps1'";
                // PowerShell.exe -ExecutionPolicy Bypass -File .runme.ps1
                // startInfo.Arguments = @"-Command ""echo 'd:\test.ps1'""";
                // startInfo.Arguments = @"-ExecutionPolicy Bypass -File d:\test.ps1";
                startInfo.Arguments = @"-NoLogo -ExecutionPolicy Bypass -Command """ + _translatescript + @" -Param1 '" + translateText + @"' -Param2 'manual'""";
                startInfo.RedirectStandardOutput = true;
                startInfo.RedirectStandardError = true;
                startInfo.UseShellExecute = false;
                startInfo.CreateNoWindow = true;
                
                Process process = new Process();
                process.StartInfo = startInfo;
                process.Start();

                string output = process.StandardOutput.ReadToEnd().Replace(System.Environment.NewLine, "");
                Console.WriteLine("ValuesController.cs - process powershell output: " + output);
                
                // connection.Close();
                // return output;

                return Ok("{\"translation\": \"" + output + "\"}");
                // return Ok("{\"expiresAt\": \"2015-11-03T10:15:57.000Z\", \"status\": \"SUCCESS\", \"relayState\": \"/myapp/some/deep/link/i/want/to/return/to\", \"sessionToken\": \"00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe\", \"_embedded\": { \"user\": { \"id\": \"00ub0oNGTSWTBKOLGLNR\", \"passwordChanged\": \"2015-09-08T20:14:45.000Z\", \"profile\": { \"login\": \"dade.murphy@example.com\", \"firstName\": \"Dade\", \"lastName\": \"Murphy\", \"locale\": \"en_US\", \"timeZone\": \"America/Los_Angeles\" } } } } ");
                // return Ok(ff); // new string[] { "value1", "value2_" + product };
            } catch (Exception ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogInformation("ValuesController - Error in [HttpPost(\"publish\")]. Error: " + ex.Message);
                return Ok("{\"output_publish\": \"KO\"}");
            }
        }


        [HttpPost("publish")]
        // public void Post([FromBody] string value)
        public ActionResult Publish([FromBody] string value) //  [FromBody] string b)
        {
            _logger.LogInformation("ValuesController POST publish - value: " + value);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
            var idf = results.value;
            // _logger.LogInformation("ValuesController POST publish - value: ");
            // _logger.LogInformation(idf);
            Console.WriteLine("ValuesController.cs - process powershell output: " + idf);
            try {
/*
                ProcessStartInfo startInfo = new ProcessStartInfo();
                startInfo.FileName = @"powershell.exe";
                // startInfo.Arguments = @"& 'd:\test.ps1'";
                // PowerShell.exe -ExecutionPolicy Bypass -File .runme.ps1
                // startInfo.Arguments = @"-Command ""echo 'd:\test.ps1'""";
                // startInfo.Arguments = @"-ExecutionPolicy Bypass -File d:\test.ps1";
                startInfo.Arguments = @"-NoLogo -ExecutionPolicy Bypass -Command ""d:\test.ps1 -Param1 Hello -Param2 World""";
                startInfo.RedirectStandardOutput = true;
                startInfo.RedirectStandardError = true;
                startInfo.UseShellExecute = false;
                startInfo.CreateNoWindow = true;
                
                Process process = new Process();
                process.StartInfo = startInfo;
                process.Start();

                string output = process.StandardOutput.ReadToEnd().Replace(System.Environment.NewLine, "");
                Console.WriteLine("ValuesController.cs - process powershell output: " + output);
                
                // connection.Close();
                // return output;
*/
                return Ok("{\"output_publish\": \"" + value + "\"}");
                // return Ok("{\"expiresAt\": \"2015-11-03T10:15:57.000Z\", \"status\": \"SUCCESS\", \"relayState\": \"/myapp/some/deep/link/i/want/to/return/to\", \"sessionToken\": \"00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe\", \"_embedded\": { \"user\": { \"id\": \"00ub0oNGTSWTBKOLGLNR\", \"passwordChanged\": \"2015-09-08T20:14:45.000Z\", \"profile\": { \"login\": \"dade.murphy@example.com\", \"firstName\": \"Dade\", \"lastName\": \"Murphy\", \"locale\": \"en_US\", \"timeZone\": \"America/Los_Angeles\" } } } } ");
                // return Ok(ff); // new string[] { "value1", "value2_" + product };
            } catch (Exception ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogInformation("ValuesController - Error in [HttpPost(\"publish\")]. Error: " + ex.Message);
                return Ok("{\"output_publish\": \"KO\"}");
            }
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
                connection = new MySqlConnection(this._connectionString);
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
                connection = new MySqlConnection(this._connectionString);
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
        
        [HttpPost("upload_1")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            // if (file == null || file.Length == 0) 
            // return Content("file not selected");
            var path = Path.Combine(
              Directory.GetCurrentDirectory(), "wwwroot", "list.txt");
              // file.GetFilename());
            // byte[] byteArray = Encoding.UTF8.GetBytes(uploads);
            /*
            byte[] byteArray = Encoding.UTF8.GetBytes(uploads);
            MemoryStream stream = new MemoryStream(byteArray);
            await file.CopyToAsync(stream);
            */
              
              
            using (var stream = new FileStream(path, FileMode.Create))
            {
              await file.CopyToAsync(stream);
            }
            return RedirectToAction("Files");
        }

        [HttpPost("upload")]
        public async Task<IActionResult> OnPostUploadAsync(List<IFormFile> files)
        {
            long uploadFileSize = files.Sum(f => f.Length);
            Console.WriteLine("ValuesController - upload uploadFileSize:" + uploadFileSize);
            string uploadFilePath = "";
            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    _logger.LogInformation("ValuesController - upload: " + formFile);
                    Console.WriteLine("ValuesController - upload: " + formFile);
                    uploadFilePath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot", "dist/rules/glossario.csv");
                    
                    // Path.GetTempFileName();
                    using (var stream = System.IO.File.Create(uploadFilePath))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                } else {
                    _logger.LogInformation("ValuesController - upload: no files");
                    Console.WriteLine("ValuesController - upload KO:");
                    return Ok(new { count = 0, uploadFileSize = 0, uploadFilePath = "no files" });
                }
            }
            // Process uploaded files
            // Don't rely on or trust the FileName property without validation.
            return Ok(new { count = files.Count, uploadFileSize, uploadFilePath });
        }
        
        [HttpGet("download")]
        public async Task<IActionResult> Download(string downloadFileName)
        {
            // filename = "index.html";
            downloadFileName = "dist/rules/glossario.csv";
            if (downloadFileName == null)
              return Content("downloadFileName not present");
            var downloadFilePath = Path.Combine(
               Directory.GetCurrentDirectory(),
               "wwwroot", downloadFileName);
               
            // formFile.SaveAsAsync("Your-File-Path"); // [ Async call ]
            // formFile.SaveAs("Your-File-Path");
            
            var memory = new MemoryStream();
            using (var stream = new FileStream(downloadFilePath, FileMode.Open))
            {
              await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetMimeType(downloadFilePath), Path.GetFileName(downloadFilePath));
        }
        
        private string GetMimeType (string fileName)
        {
            string mimeType = "application/unknown";
            string ext = System.IO.Path.GetExtension(fileName).ToLower();
            Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey(ext);
            if (regKey != null && regKey.GetValue("Content Type") != null)
            mimeType = regKey.GetValue("Content Type").ToString();
            return mimeType;
        }
    }
}
