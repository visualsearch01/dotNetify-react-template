using DotNetify.Security;
using Microsoft.AspNetCore.Mvc;
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
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace dotnetify_react_template.server.Controllers
{
    public class ChipElement
    {
        public int id { get; set; }
        public string name { get; set; }
    }

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
    public class ValuesController : Controller // Base
    {
        /*
        public Task<bool> Invoke(HttpContext context)
        {
          _logger.LogWarning("ValuesController     - " + context.User);
          // Do something with the current HTTP context...
          return new Task(true);
        }
        */
        public IActionResult Error()
        {
            ViewData["RequestId"] = HttpContext.TraceIdentifier;
            return View();
        }
        private readonly ILogger _logger;
        private MySqlConnection _connection;
        
        // private string _connectionStringcs = @"server=localhost;port=3306;database=lis2;user=root;password=root";
        private readonly string _connectionString;
        private readonly string _translatescript;
        private readonly string _xmlscript;
        private readonly string _udpscript;
        private readonly string _zipscript;
        private readonly string _videoUrl;
        private readonly string _savePath;
        
        private IUserRepository hh;
        private IHttpContextAccessor _hhh;
        private IPrincipalAccessor _nn;

        public class PostInfo
        {
            public string value { get; set; }
        }

        public class Item
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Name_player { get; set; }
            public string Name_editor { get; set; }
            public string Code { get; set; }
            public string Contesto { get; set; }
            public string Progetto { get; set; }
            public string Contributo { get; set; }
            public string Inteprete { get; set; }
            public string Animatore { get; set; }
            public string Validatore { get; set; }
            // public int Anno { get; set; }
        }


        public ValuesController(IPrincipalAccessor principalAccessor, IHttpContextAccessor bb, ILiveDataService liveDataService, IUserRepository _userRepository, IConfiguration configuration, ILogger<ValuesController> logger) // {
        {
          hh = _userRepository;
          _hhh = bb;
          _nn = principalAccessor;

          _logger = logger;
          var pathBase = HttpContext; // .Request.PathBase;
          _logger.LogWarning("ValuesController.cs - costruttore, HttpContext: " + HttpContext); //_configuration["ConnectionStrings:lis"]);

          _connectionString = configuration.GetConnectionString("lis"); //  _configuration.GetValue<string>("ConnectionStrings:lis");
          _logger.LogWarning("ValuesController.cs - costruttore, stringa connessione DB MySQL: " + _connectionString); //_configuration["ConnectionStrings:lis"]);

          _translatescript = configuration.GetValue<string>("Scripts:translate");
          _logger.LogWarning("ValuesController.cs - costruttore, script Powershell di translate: " + _translatescript); //_configuration["ConnectionStrings:lis"]);

          _xmlscript  = configuration.GetValue<string>("Scripts:sentence_xml");
          _logger.LogWarning("ValuesController.cs - costruttore, script Powershell di xml: " + _xmlscript); //_configuration["ConnectionStrings:lis"]);

          _udpscript  = configuration.GetValue<string>("Scripts:sentence_udp");
          _logger.LogWarning("ValuesController.cs - costruttore, script Powershell di udp: " + _udpscript); //_configuration["ConnectionStrings:lis"]);

          _zipscript  = configuration.GetValue<string>("Scripts:sentence_zip");
          _logger.LogWarning("ValuesController.cs - costruttore, script Powershell di zip: " + _zipscript); //_configuration["ConnectionStrings:lis"]);

          _videoUrl = configuration.GetValue<string>("Urls:video_url");
          _logger.LogWarning("ValuesController.cs - costruttore, url Powershell dei video: " + _videoUrl); //_configuration["ConnectionStrings:lis"]);

          _savePath = configuration.GetValue<string>("Paths:save_videos");
          // _savePath = Path.Combine(Directory.GetCurrentDirectory(), @"..\\", configuration.GetValue<string>("Paths:video_rel"), configuration.GetValue<string>("Paths:video_dir"));
          _logger.LogWarning("ValuesController.cs - costruttore, path Powershell di save: " + _savePath); //_configuration["ConnectionStrings:lis"]);

        }
        /*
        [HttpGet("user")]
        public HttpResponseMessage GetUser()
        {
          // this.Invoke();
          return new HttpResponseMessage(HttpStatusCode.OK)
          {
              Content = new StringContent("I'm logged!")
          };
        }

        // [HttpGet]
        [HttpGet("logged")]
        public async Task<bool> LoggedIn()
        {
          var myUser = await HttpContext.User;
          // _logger.LogWarning("ValuesController     - myUser:::::::::::::::::::::::::::::::::::::::::::::::::::::: " + HttpContext.User.Name);
          _logger.LogWarning("ValuesController     - myUser:::::::::::::::::::::::::::::::::::::::::::::::::::::: " + myUser.Identity);
          // _logger.LogWarning("ValuesController     - myUser.Nmae::::::::::::::::::::::::::::::::::::::::::::::::: " + myUser.Identities.FirstOrDefault().NameIdentifier);
          
          System.Security.Claims.ClaimsIdentity principal = myUser.Identities.FirstOrDefault() as System.Security.Claims.ClaimsIdentity;
          if (null != principal)
          {
            _logger.LogWarning("ValuesController     - userprincipal not null");
            foreach (Claim claim in principal.Claims)
            {
              _logger.LogWarning("ValuesController.cs ---------- CLAIM TYPE: " + claim.Type + "; CLAIM VALUE: " + claim.Value + "</br>");
            }
          }
          return myUser.Identities.Any(x => x.IsAuthenticated);
        }
        */
        /**
         * Endpoint GET meteo di prova - data cablata
         * Tanto per provare
         */
        [HttpGet("meteo")]
        public ActionResult Get_meteo()
        {
            /*
            using(SqlConnection _connection = new SqlConnection("_connection string"))
            {
                _connection.Open();
                using(SqlCommand cmd = new SqlCommand("SELECT * FROM SomeTable", _connection))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader != null)
                        {
                            while (reader.Read())
                            {
                                //do something
                            }
                        }
                    } // reader closed and disposed up here
                } // command disposed here
            } // _connection closed and disposed here
            */
            string result = "{data: 'Nessun dato per il giorno selezionato'}";
            _logger.LogWarning("ValuesController - Chiamata Get_meteo");
            try
            {
                // MySqlConnection _connection;
                // using (MySqlConnection conn = new MySqlConnection("server=localhost;port=3306;database=anychart_db;user=anychart_user;password=anychart_pass"))
                // using (MySqlConnection conn = new MySqlConnection("server=localhost;port=3306;database=lis2;user=root;password=root"))
                using (_connection = new MySqlConnection(this._connectionString))
                {
                    _connection.Open();
                    using(MySqlCommand cmd = new MySqlCommand(@"
                    select d.date_day, f.id_forecast, f.id_edition, f.offset_day, fc.id_forecast_type, CASE WHEN f.offset_day = 1 THEN ft.name_type ELSE CONCAT(ft.name_type,' +',f.offset_day) END 'name_type', tr.id_text_trans, it.id_text_ita AS id_it, li.id_text_lis AS id_lis, it.version, JSON_OBJECT('data',substr(it.text_ita,1,2000)) AS list, li.version, substr(li.text_lis,1,2000) FROM lis_day d JOIN lis_forecast f ON d.id_day = f.id_day JOIN lis_forecast_data fc ON f.id_forecast = fc.id_forecast JOIN lis_text_trans tr ON tr.id_text_trans=fc.id_translation JOIN lis_text_ita it ON tr.id_text_ita = it.id_text_ita JOIN lis_text_lis li ON tr.id_text_lis = li.id_text_lis AND it.version = li.version JOIN lis_forecast_type ft ON ft.id_forecast_type = fc.id_forecast_type WHERE it.id_text_ita = it.id_text_ita AND it.version IN ( (SELECT MIN(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita),(SELECT MAX(version) FROM lis_text_ita WHERE id_text_ita = it.id_text_ita)) AND li.id_text_lis = li.id_text_lis AND li.version IN ( (SELECT MIN(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis),(SELECT MAX(version) FROM lis_text_lis WHERE id_text_lis = li.id_text_lis)) AND d.date_day = '2019-12-19';", _connection))
                    {
                        using (MySqlDataReader reader = cmd.ExecuteReader())
                        {
                            // while (
                            reader.Read(); // )
                            // {
                            // product = reader.GetString("product");
                            result = reader.GetString("list");
                            // }
                        }
                    }
                }
                return Ok(result);
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - Error in [HttpGet(\"meteo\")]. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - Error in [HttpGet(\"meteo\")]. Error: " + ex.Message);
                return Ok("{\"meteo\": \"Non Okei_mysqlex\"}");
            } catch(Exception ex) {
                _logger.LogWarning(ex.Message);
                return Ok("{\"meteo\": \"Non Okei_ex\"}");
            }
        }

        /**
         * Endpoint GET di estrazione meteo per singola data
         * @id - la data in formato yyyy-mm-dd
         */
        [HttpGet("meteo/{id}")]
        public ActionResult Get_meteo_id(string id)
        {
          _logger.LogWarning("ValuesController - Nameeeeee -----------------------------------------------: " + this.hh.GetUserNetworkId());
          // _logger.LogWarning("ValuesControllerhboard - Nameeeeee -------------------------: " + this._hhh.HttpContext.User.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value);
          _logger.LogWarning("ValuesController - Nameeeeee -----------------------------------------------: " + this._nn.Principal);

          /*
          var userIdentity = this._hhh.HttpContext.User.Identity as ClaimsIdentity;
          foreach (Claim claim in userIdentity.Claims)
          {
            _logger.LogInformation("ValuesController.cs -------------- CLAIM TYPE: " + claim.Type);
            _logger.LogInformation("ValuesController.cs -------------- CLAIM VALUE: " + claim.Value); //  + "</br>");
          }

          var userIdentity = this._nn.Principal.Identity as ClaimsIdentity;
          foreach (Claim claim in userIdentity.Claims)
          {
            _logger.LogInformation("Applayout.cs -------------- CLAIM TYPE: " + claim.Type);
            _logger.LogInformation("Applayout.cs -------------- CLAIM VALUE: " + claim.Value); //  + "</br>");
          }
          */
          var user = HttpContext.User; //.FindFirst(ClaimTypes.NameIdentifier).Value;
          var email = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "Subject")?.Value;
          // _logger = logger;
          _logger.LogWarning("ValuesController     - user.Name:::::::::::::::::::::::::::::::::::::::::::::::::::::: " + user.Identity);
          _logger.LogWarning("ValuesController     - sub ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: " + email);
          _logger.LogWarning("ValuesController.cs  - httpContextAccessor.HttpContext.User.Identity.Name :::::::::::: " + user.Identity);

            string result = "[{'CENTRO E SARDEGNA':'Inizializzazione..'},{'NORD':'Inizializzazione..'}]";
            _logger.LogWarning("ValuesController - Chiamata Get_meteo_id");
            try
            {
                using (_connection = new MySqlConnection(this._connectionString))
                {
                    _connection.Open();
                    using(MySqlCommand cmd = new MySqlCommand(@"
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
                    _connection))
                    {
                        using (MySqlDataReader reader = cmd.ExecuteReader())
                        {
                            reader.Read(); // )
                            if (!reader.IsDBNull(0))
                            {
                                result = reader.GetString("list");
                            }
                            else
                            {
                                result = "[{\"CENTRO E SARDEGNA\":\"Nessun dato per il giorno selezionato\"},{\"NORD\":\"Nessun dato per il giorno selezionato\"}]";
                            }
                        }
                    }
                }
                return Ok(result);
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - Error in [HttpGet(\"meteo/id\")]. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - Error in [HttpGet(\"meteo/id\")]. Error: " + ex.Message);
                return Ok("{\"meteo_id\": \"Non Okei_mysqlex\"}");
            } catch(Exception ex) {
                _logger.LogWarning(ex.Message);
                return Ok("{\"meteo_id\": \"Non Okei_ex\"}");
            }
            /*
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
            _logger.LogWarning("ValuesController.cs - process powershell output: " + output);
            */
        }

        /**
         * Endpoint GET translate di prova - e' meglio farlo in POST
         * Dati cablati
         */
        [HttpGet("translate1")]
        public ActionResult Get_translate() // ActionResult Get_translate()
        {
            string output = "Default";
            try {
                ProcessStartInfo startInfo = new ProcessStartInfo();
                startInfo.FileName = @"powershell.exe";
                // startInfo.Arguments = @"& 'd:\test.ps1'";
                // PowerShell.exe -ExecutionPolicy Bypass -File .runme.ps1
                // startInfo.Arguments = @"-Command ""echo 'd:\test.ps1'""";
                // startInfo.Arguments = @"-ExecutionPolicy Bypass -File d:\test.ps1";
                startInfo.Arguments = @"-NoLogo -ExecutionPolicy Bypass -Command """ + _translatescript + @" -Param1 'UkVTSURVRSBQSU9HR0UgTkVMTEUgUFJJTUUgT1JFIERFTCBNQVRUSU5PIFNVTExFIEFSRUUgQVBQRU5OSU5JQ0hFIEVNSUxJQU5FIEUgTFVOR08gTEUgWk9ORSBDT1NUSUVSRSBBRFJJQVRJQ0hFLCBNQSBJTiBTVUNDRVNTSVZPIFJBUElETyBNSUdMSU9SQU1FTlRPIENPTiBDSUVMTyBURVJTTy5CRUwgVEVNUE8gU1VMIFJFU1RBTlRFIFNFVFRFTlRSSU9ORSwgQSBQQVJURSBVTiBQTycgREkgTlVCSSBDT01QQVRURSBBVFRFU0UgTkVMTEEgUFJJTUEgUEFSVEUgREVMTEEgTUFUVElOQVRBIFNVTExFIEFSRUUgQUxQSU5FIENPTiBERUJPTEkgTkVWSUNBVEUgQSBBU1NPQ0lBVEUgQSBQQVJUSVJFIERBSSAxMjAwIEEgTUVUUkkuQUwgUFJJTU8gTUFUVElOTyBFIERPUE8gSUwgVFJBTU9OVE8gRk9STUFaSU9ORSBESSBGT1NDSElFIERFTlNFIEUgQkFOQ0hJIERJIE5FQkJJQSBFIFNVTExBIFBJQU5VUkEgRSBQQURBTkE=' -Param2 World""";
                startInfo.RedirectStandardOutput = true;
                startInfo.RedirectStandardError = true;
                startInfo.UseShellExecute = false;
                startInfo.CreateNoWindow = true;
                
                Process process = new Process();
                process.StartInfo = startInfo;
                process.Start();

                output = process.StandardOutput.ReadToEnd().Replace(System.Environment.NewLine, "");
                _logger.LogWarning("ValuesController.cs - translate1 - process powershell output: " + output);

                process.Dispose();
                GC.Collect(); // Just for the diagnostics....
                return Ok("{\"translation\": \"" + output + "\"}");
            }
            catch(InvalidOperationException ex){
                _logger.LogWarning(ex.Message);
                return Ok("{\"translation\": \"" + ex.Message + "\"}");
            }
            catch(Exception ex) {
                _logger.LogWarning(ex.Message);
                return Ok("{\"translation\": \"" + ex.Message + "\"}");
            }

            // _connection.Close();
            // return output;

            // return Ok("{\"expiresAt\": \"2015-11-03T10:15:57.000Z\", \"status\": \"SUCCESS\", \"relayState\": \"/myapp/some/deep/link/i/want/to/return/to\", \"sessionToken\": \"00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe\", \"_embedded\": { \"user\": { \"id\": \"00ub0oNGTSWTBKOLGLNR\", \"passwordChanged\": \"2015-09-08T20:14:45.000Z\", \"profile\": { \"login\": \"dade.murphy@example.com\", \"firstName\": \"Dade\", \"lastName\": \"Murphy\", \"locale\": \"en_US\", \"timeZone\": \"America/Los_Angeles\" } } } } ");
            // return Ok(ff); // new string[] { "value1", "value2_" + product };
        }

        /**
         * Endpoint GET di download file dist/rules/glossario.csv
         * 
         */
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

        /**
         * Endpoint GET meteo di prova - data cablata
         * Tanto per provare
         */
        [HttpGet("sign")]
        public IActionResult Get_sign()
        {
            string result = "{data: 'Nessun segno disponibile'}";
            List<string> res = new List<string>();
            List<Item> res1 = new List<Item>();
            _logger.LogWarning("ValuesController - Chiamata Get_sign");
            try
            {
                using (_connection = new MySqlConnection(this._connectionString))
                {
                    _connection.Open();
                    using(MySqlCommand cmd = new MySqlCommand(@"
                    SELECT
                      id_rai_lis_sign,
                      lemma,
                      lemma_player,
                      lemma_editor,
                      radutzky_code,
                      contesto,
                      progetto,
                      contributo,
                      interprete_lis,
                      animatore,
                      validatore,
                      anno_realizzazione
                    FROM lis_sign
                    ORDER BY IF(lemma RLIKE '^[a-z]', 1, 2), lemma;", _connection))
                    {
                        using (MySqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (
                            reader.Read())
                            {
                                // result = reader.GetString("lemma");
                                if (!reader.IsDBNull(0))
                                {
                                    result = reader.GetString("lemma");
                                    res.Add(reader.GetString("lemma"));
                                    res1.Add(new Item {
                                        Id = reader.GetInt32("id_rai_lis_sign"),
                                        Name = reader.GetString("lemma"),
                                        Name_player = reader.GetString("lemma_player"),
                                        Name_editor = reader.GetString("lemma_editor"),
                                        Code = reader.GetString("radutzky_code"),
                                        Contesto = reader.GetString("contesto"),
                                        Progetto = reader.GetString("progetto"),
                                        Contributo = reader.GetString("contributo"),
                                        Inteprete = reader.GetString("interprete_lis"),
                                        Animatore = reader.GetString("animatore"),
                                        Validatore = reader.GetString("validatore") // ,
                                        // Anno = reader.GetInt32("anno_realizzazione")
                                    });
                                }
                                else
                                {
                                    result = "[{\"SIGN\":\"Nessun segno\"}]";
                                }

                            }
                        }
                    }
                }
                // return Ok(res);
                return Ok(res1);
                // res.Add(reader
                // return new OkObjectResult(new Item { Id = 123, Name = "Hero" });
            } catch (MySqlException ex) {
                _logger.LogWarning("ValuesController - Error in [HttpGet(\"Get_sign\")]. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - Error in [HttpGet(\"Get_sign\")]. Error: " + ex.Message);
                return Ok("{\"sign\": \"Non Okei_mysqlex\"}");
            } catch(Exception ex) {
                _logger.LogWarning(ex.Message);
                return Ok("{\"sign\": \"Non Okei_ex\"}");
            }
        }


        /**
         * Endpoint POST di inserimento nuove voci di menu - di prova, mai usato
         * value - oggetto json di definizione menu
         */
        [HttpPost("menu")]
        public void Post_Menu([FromBody] string value)
        {
            try {
                _connection = new MySqlConnection(this._connectionString);
                _connection.Open();
                
                _logger.LogWarning("ValuesController - Chiamata Post().");
                _logger.LogWarning("ValuesController - value:");
                _logger.LogWarning(value);
                object vmArgs = null;
                vmArgs = JsonConvert.DeserializeObject(value);

                dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
                var idf = results.value;
                // var name= results.Name;

                // object o = JsonConvert.DeserializeObject(json1);
                _logger.LogWarning("ValuesController - vmArgs:");
                _logger.LogWarning(vmArgs.ToString());
                // JavaScriptSerializer js = new JavaScriptSerializer();
                // IDictionary<string, string> rre = js.Deserialize<IDictionary<string, string>>(value);
                using (_connection) {
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = _connection;
                    // string SQL = "INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (@mcUserName, @mcUserPass, @twUserName, @twUserPass)";
                    string SQL = "INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (?auth, ?name_menu, ?url_menu, ?notes)";
                    // string SQL = @"INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (true, 'frefref', 'gf/g/hfhg', 'noteeeergergegee')";
                    command.CommandText = SQL;
                    /*
                    command.Parameters.Add("@mcUserName", true);
                    command.Parameters.Add("@mcUserPass", "test");
                    command.Parameters.Add("@twUserName", "/path/to/menuvalue");
                    command.Parameters.Add("@twUserPass", "note_da_test");
                    */
                    // try AddWithValue
                    command.Parameters.AddWithValue("?auth", true);
                    command.Parameters.AddWithValue("?name_menu", idf);
                    command.Parameters.AddWithValue("?url_menu", "/path/to/menuvalue_1_4");
                    command.Parameters.AddWithValue("?notes", "menu_notes_!_1_4");
                    command.ExecuteNonQuery();
                }
                _connection.Close();
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - Error in [HttpPost(\"menu\")]. Error: " + ex.Message);
            }
        }


        /**
         * Endpoint POST di inserimento nuove voci di settings
         * value - oggetto json di definizione setting
         */
        [HttpPost("setting")]
        public void Post_Setting([FromBody] string value)
        {
            try {
                _connection = new MySqlConnection(this._connectionString);
                _connection.Open();
                
                _logger.LogWarning("ValuesController - Chiamata Post().");
                _logger.LogWarning("ValuesController - value:");
                _logger.LogWarning(value);
                object vmArgs = null;
                vmArgs = JsonConvert.DeserializeObject(value);

                dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
                var idf = results.value;
                // var name= results.Name;

                // object o = JsonConvert.DeserializeObject(json1);
                _logger.LogWarning("ValuesController - vmArgs:");
                _logger.LogWarning(vmArgs.ToString());
                // JavaScriptSerializer js = new JavaScriptSerializer();
                // IDictionary<string, string> rre = js.Deserialize<IDictionary<string, string>>(value);
                using (_connection) {
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = _connection;
                    // string SQL = "INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (@mcUserName, @mcUserPass, @twUserName, @twUserPass)";
                    string SQL = "INSERT INTO lis_setting ( name_setting, value_setting, notes ) VALUES ( ?name_setting, ?value_setting, ?notes )";

                    // string SQL = @"INSERT INTO lis_menu ( auth, name_menu, url_menu, notes ) VALUES (true, 'frefref', 'gf/g/hfhg', 'noteeeergergegee')";
                    command.CommandText = SQL;
                    command.Parameters.AddWithValue("?name_setting", idf);
                    command.Parameters.AddWithValue("?value_setting", "/path/to/menuvalue_1_4");
                    command.Parameters.AddWithValue("?notes", "menu_notes_!_1_4");
                    command.ExecuteNonQuery();
                }
                _connection.Close();
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - Error in [HttpPost(\"setting\")]. Error: " + ex.Message);
            }
        }

        [HttpPost("testpost_0/{id}")]
        // public ApiResponse PushMessage(int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        // public ActionResult<string> Post( int id, [FromBody] string value) // added FromBody as this is how you are sending the data
        public ActionResult<string> Post_test0(int id, [FromBody] string json)
        {
            _logger.LogWarning("ValuesController POST test - post_id: " + id);
            _logger.LogWarning("ValuesController POST test - json: " + json);
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
        public ActionResult<string> Post_test1(int id, [FromBody] string json)
        {
            _logger.LogWarning("ValuesController POST test - post_id: " + id);
            // _logger.LogWarning("ValuesController POST test - value: " + value);
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
        public ActionResult<string> Post_test2([FromBody] string json)
        {
            // _logger.LogWarning("ValuesController POST test - post_id: " + id);
            _logger.LogWarning("ValuesController POST test - value: " + json);
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
        public ActionResult<string> Post_test3([FromBody] PostInfo json)
        {
            // _logger.LogWarning("ValuesController POST test - post_id: " + id);
            _logger.LogWarning("ValuesController POST test - value: " + json);
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

        /**
         * Endpoint POST di inserimento nuove versioni di testi ita/lis
         * ATTENZIONE - questo endpoint viene usato per l'inserimento di coppie di testi ita/lis dal sezione di traduzione
         * del DEliverable 1
         * L'inserimento testi dal deliverable 2 (meteo) viene fatta dal controller del viewmodel relativeo (Dashboard)
         * con una coppia di query quasi identiche - la differenza e' che per il meteo i testi partono gia' da una versione 1 generata dallo scraper,
         * invece qui bisogna creare la versione 1 da zero
         * UPDATE
         * Le query sono state spostate quasi tutte qui nell controller API
         * Questo metodo si occupa sia di inserire i record necessari in caso di inserimento nuovo
         * sia per una nuova versione di testo preesistente (quindi nel meteo, ma anche una nuova versione di testo didattica gia' presente)
         * Se il campo IdTextIta e' 0 e' un nuovo inserimento
         */
        [HttpPost("text_trad")]
        // public string JsonStringBody([FromBody] string value)
        public ActionResult InsertText([FromBody] string value)
        {
            // long lastId;
            long lastTransId;
            long lastTrans2Id;
            long lastItaId;
            long lastLisId;
            _logger.LogWarning("ValuesController text_trad POST - value: " + value);
            dynamic changes = JsonConvert.DeserializeObject<dynamic>(value);
            
            try
            {
                using (_connection = new MySqlConnection(this._connectionString))
                {
                    _connection.Open();
                    using(MySqlCommand command = new MySqlCommand()) {
                        command.Connection = _connection;
                        // int.TryParse(changes.IdTextIta, out int itaId);
                        // int.TryParse(changes.IdTextLis, out int lisId);
                        // int itaId = changes.IdTextIta;
                        // int lisId = changes.IdTextLis;
                        command.Parameters.Clear();

                        _logger.LogWarning("ValuesController text_trad - changes.IdTextIta: " + (int)changes.IdTextIta);
                        // Console.WriteLine(changes.IdTextIta);
                        // _logger.LogWarning("ValuesController text_trad - changes.IdTextLis:");
                        // Console.WriteLine(changes.IdTextLis);
                        // _logger.LogWarning("ValuesController text_trad - changes.TextIta:");
                        // Console.WriteLine(changes.TextIta);

                        if (changes.IdTextIta == 0) {
                          command.CommandText = "INSERT INTO lis_text_ita (id_text_ita, id_user_edit, version, text_ita, notes) VALUES ((SELECT MAX(id_text_ita)+1 FROM (select * from lis_text_ita) AS T1), ?id_user, ?version, ?text, ?notes);";
                          command.Parameters.AddWithValue("?version", (changes.VersionIta + 1)); // 1); // La versione va sempre incrementata! da frontend si arriva con la vrsione corrente che da 0 passa a 1, poi 2 e cosi' via
                          // command.Parameters.AddWithValue("?id_text_ita", (changes.IdTextIta ? changes.IdTextIta : "(SELECT MAX(id_text_ita)+1 FROM (select * from lis_text_ita) AS T1)"));
                          // Cannot implicitly convert type 'Newtonsoft.Json.Linq.JValue' to 'bool'. An explicit conversion exists (are you missing a cast?)
                        } else {
                          command.CommandText = "INSERT INTO lis_text_ita (id_text_ita, id_user_edit, version, text_ita, notes) VALUES (?id_text_ita, ?id_user, ?version, ?text, ?notes);";
                          command.Parameters.AddWithValue("?id_text_ita", changes.IdTextIta);
                          command.Parameters.AddWithValue("?version", (changes.VersionIta + 1)); // 1);
                        }
                        command.Parameters.AddWithValue("?id_user", changes.IdUserEdit);
                        command.Parameters.AddWithValue("?text", changes.TextIta); // Gia' escapato .Replace("'", "''"));
                        command.Parameters.AddWithValue("?notes", changes.NotesIta); // .Replace("'", "''"));
                        command.ExecuteNonQuery();
                        // lastItaId = 0;
                        _logger.LogWarning("ValuesController text_trad POST - INSERT ITA OK");

                        if (changes.IdTextIta == 0) {
                          command.Parameters.Clear();
                          command.CommandText = "SELECT MAX(id_text_ita) AS id_text_ita FROM lis_text_ita;";
                          using (MySqlDataReader reader = command.ExecuteReader())
                          {
                            reader.Read(); // )
                            lastItaId = reader.GetInt32("id_text_ita");
                          }
                        } else {
                          lastItaId = changes.IdTextIta;
                        }

                        command.Parameters.Clear();
                        if (changes.IdTextLis == 0) {
                          command.CommandText = "INSERT INTO lis_text_lis (id_text_lis, id_user_edit, version, text_lis, xml_lis, notes) VALUES ((SELECT MAX(id_text_lis)+1 FROM (select * from lis_text_lis) AS T2), ?id_user, ?version, ?text, '<xml>test</xml>', ?notes);";
                          command.Parameters.AddWithValue("?version", (changes.VersionLis + 1)); // 1);
                        } else {
                          command.CommandText = "INSERT INTO lis_text_lis (id_text_lis, id_user_edit, version, text_lis, xml_lis, notes) VALUES (?id_text_lis, ?id_user, ?version, ?text, '<xml>test</xml>', ?notes);";
                          command.Parameters.AddWithValue("?id_text_lis", changes.IdTextLis);
                          command.Parameters.AddWithValue("?version", (changes.VersionLis + 1)); // 1);
                        }
                        command.Parameters.AddWithValue("?id_user", changes.IdUserEdit);
                        command.Parameters.AddWithValue("?text", changes.TextLis); // .Replace("'", "''"));
                        command.Parameters.AddWithValue("?notes", changes.NotesLis); //.Replace("'", "''"));
                        command.ExecuteNonQuery();
                        _logger.LogWarning("ValuesController text_trad POST - INSERT LIS OK");

                        if (changes.IdTextIta == 0) {

                          command.Parameters.Clear();
                          command.CommandText = "SELECT MAX(id_text_lis) AS id_text_lis FROM lis_text_lis;";
                          using (MySqlDataReader reader = command.ExecuteReader())
                          {
                            reader.Read(); // )
                            lastLisId = reader.GetInt32("id_text_lis");
                          }
                        } else {
                          lastLisId = changes.IdTextLis;
                        }
                        
                        // L'inserimento nella 
                        command.Parameters.Clear();
                        command.CommandText = "INSERT INTO lis_text_trans (id_text_ita, id_text_lis) VALUES (?id_text_ita, ?id_text_lis);";
                        command.Parameters.AddWithValue("?id_text_ita", lastItaId);
                        command.Parameters.AddWithValue("?id_text_lis", lastLisId);
                        command.ExecuteNonQuery();
                        lastTransId = command.LastInsertedId;
                        _logger.LogWarning("ValuesController text_trad POST - INSERT TRANS OK, lastTransId:" + lastTransId);
                        
                        command.Parameters.Clear();
                        command.CommandText = "INSERT INTO lis_text_trans2 (id_text_ita, version_ita, id_text_lis, version_lis) VALUES (?id_text_ita, ?version_ita, ?id_text_lis, ?version_lis);";
                        if (changes.IdTextIta == 0) {
                          command.Parameters.AddWithValue("?version_ita", (changes.VersionIta + 1)); // 1);
                          command.Parameters.AddWithValue("?version_lis", (changes.VersionLis + 1)); // 1);
                        } else {
                          command.Parameters.AddWithValue("?version_ita", (changes.VersionIta + 1)); // 1);
                          command.Parameters.AddWithValue("?version_lis", (changes.VersionLis + 1)); // 1);
                        }
                        command.Parameters.AddWithValue("?id_text_ita", lastItaId);
                        command.Parameters.AddWithValue("?id_text_lis", lastLisId);
                        // ValuesController - Error in [HttpPost"text_trad")]. Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '_binary '5'' at line 1
                        command.ExecuteNonQuery();
                        // dbcmd.ExecuteNonQuery();
                        lastTrans2Id = command.LastInsertedId;
                        _logger.LogWarning("ValuesController text_trad POST - INSERT TRANS2 OK, lastTrans2Id: " + lastTrans2Id);
                    }
                    _connection.Close();
                }
                return Ok("{\"id_text_trans\": \"" + lastTrans2Id + "\",\"id_text_ita\": \"" + lastItaId + "\",\"id_text_lis\": \"" + lastLisId + "\"}");
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - MySQL Error in [HttpPost\"text_trad\")]. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - MySQL Error in [HttpPost(\"text_trad\")]. Error: " + ex.Message);
                return Ok("{\"id_text_trans\": \"Non Okei_mysqlex\"}");
            } catch(Exception ex) {
                _logger.LogWarning("ValuesController - Error in [HttpPost(\"text_trad\")]. Error: " + ex.Message);
                return Ok("{\"id_text_trans\": \"Non Okei_ex\"}");
            }
            // return content;
        }

        /**
         * Endpoint POST di inserimento nuova request
         * value - oggetto json di definizione request
         */
        [HttpPost("request")]
        public ActionResult InsertRequest([FromBody] string value)
        {
            long lastId;
            _logger.LogWarning("ValuesController POST - value: " + value);
            dynamic changes = JsonConvert.DeserializeObject<dynamic>(value);
            // var idf = changes.value;

            // Valutare se rinominare il video:
            // System.IO.File.Move("oldfilename", "newfilename");
            // Attenzione - per farlo bisogna farsi passare solo il nome file senza URL
            try {
                using (_connection = new MySqlConnection(this._connectionString)) {
                    _connection.Open();
                    using(MySqlCommand command = new MySqlCommand()) {
                        command.Connection = _connection;
                        command.Parameters.Clear();
                        command.CommandText = "INSERT INTO lis_request (name_request, id_translation, path_video, notes) VALUES (?name, ?id, ?path, ?notes)";
                        command.Parameters.AddWithValue("?name", changes.name_video);
                        command.Parameters.AddWithValue("?id", changes.id);
                        command.Parameters.AddWithValue("?path", changes.path_video);
                        // command.Parameters.AddWithValue("?url_menu", "/path/to/menuvalue");
                        command.Parameters.AddWithValue("?notes", changes.notes);
                        command.ExecuteNonQuery();
                        lastId = command.LastInsertedId;
                        _logger.LogWarning("ValuesController request POST - INSERT REQUEST OK");
                        // SQL = "INSERT INTO lis_text_lis (id_text_lis, id_user_edit, version, text_lis, xml_lis, notes) VALUES ((select MAX(id_text_lis)+1 from (select * from lis_text_lis) AS T2),2, ?version, 'texttt_lis', '<xml>test</xml>', 'note_lis_HttpPost')";
                        // command.CommandText = SQL;
                        // command.Parameters.AddWithValue("?version", idf); // Gia' specificato sopra - anche se poi magari le versioni potranno essere diverse tra ita e lis
                        // command.Parameters.AddWithValue("?name_menu", "menu_name");
                        // command.Parameters.AddWithValue("?url_menu", "/path/to/menuvalue");
                        // command.Parameters.AddWithValue("?notes", "menu_notes_!");
                        // command.ExecuteNonQuery();
                    }
                    _connection.Close();
                }
                // return Ok("{\"insertRequest\": \"Ok\"}");
                return Ok("{\"id_request\": \"" + lastId + "\"}");
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - Error in [HttpPost\"request\")]. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - Error in [HttpPost(\"request\")]. Error: " + ex.Message);
                return Ok("{\"request\": \"Non Okei_mysqlex\"}");
            } catch(Exception ex) {
                _logger.LogWarning(ex.Message);
                return Ok("{\"request\": \"Non Okei_ex\"}");
            }
            // return content;
        }

        /**
         * Endpoint POST di richiesta traduzione ita/lis tramite script PowerShell
         * json - oggetto json di traduzione
         */
        [HttpPost("translate")]
        public ActionResult Post_translate([FromBody] string json) //  [FromBody] string b)
        {
            _logger.LogWarning("ValuesController.cs - POST translate - value: " + json);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(json);
            var translateText = results.value;
            _logger.LogWarning("ValuesController.cs - POST translate - translateText:");
            Console.WriteLine(translateText);
            try {
                ProcessStartInfo startInfo = new ProcessStartInfo();
                startInfo.FileName = @"powershell.exe";
                startInfo.Arguments = @"-NoLogo -ExecutionPolicy Bypass -Command """ + _translatescript + @" -Param1 '" + translateText + @"' -Param2 'manual'""";
                startInfo.RedirectStandardOutput = true;
                startInfo.RedirectStandardError = true;
                startInfo.UseShellExecute = false;
                startInfo.CreateNoWindow = true;
                
                Process process = new Process();
                process.StartInfo = startInfo;
                process.Start();

                // string 
                string[] output = process.StandardOutput.ReadToEnd().Split(
                    new[] { Environment.NewLine },
                    StringSplitOptions.None
                );
                // var output = process.StandardOutput.ReadToEnd().Split; // .Replace(System.Environment.NewLine, "");
                _logger.LogWarning("ValuesController.cs - POST translate powershell output: " + output[0]);
                
                process.Dispose();
                GC.Collect(); // Just for the diagnostics....

                return Ok("{\"translation\": \"" + output[0] + "\"}");
                // return Ok("{\"expiresAt\": \"2015-11-03T10:15:57.000Z\", \"status\": \"SUCCESS\", \"relayState\": \"/myapp/some/deep/link/i/want/to/return/to\", \"sessionToken\": \"00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe\", \"_embedded\": { \"user\": { \"id\": \"00ub0oNGTSWTBKOLGLNR\", \"passwordChanged\": \"2015-09-08T20:14:45.000Z\", \"profile\": { \"login\": \"dade.murphy@example.com\", \"firstName\": \"Dade\", \"lastName\": \"Murphy\", \"locale\": \"en_US\", \"timeZone\": \"America/Los_Angeles\" } } } } ");
                // return Ok(ff); // new string[] { "value1", "value2_" + product };
            } catch(InvalidOperationException ex){
                _logger.LogWarning("ValuesController - Error in [HttpPost(\"translate\")]. Error: " + ex.Message);
                _logger.LogWarning(ex.Message);
                return Ok("{\"translation\": \"" + ex.Message + "\"}");
            }
            catch(Exception ex) {
                _logger.LogWarning("ValuesController - Error in [HttpPost(\"translate\")]. Error: " + ex.Message);
                _logger.LogWarning(ex.Message);
                return Ok("{\"translation\": \"" + ex.Message + "\"}");
            }
        }


        [HttpPost("preview_test1")]
        public ActionResult Preview_test1([FromBody] string value) //  [FromBody] string b)
        {
            try {
                //_logger.LogWarning("ValuesController POST preview - value: " + value);
                _logger.LogWarning("ValuesController.cs - POST preview - value: " + value);
                dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
                // string sentenceText = results.value; // .Replace("=","");
                // _logger.LogWarning("ValuesController POST publish - value: ");
                // _logger.LogWarning(idf);
                // _logger.LogWarning("ValuesController.cs - POST preview - deserialize result: " + results);

                // return Ok("{\"output_preview\": \"" + sentenceText + "_//video_gen/mp4/output_2sec.mp4\"}");
                return Ok("{\"output_preview\": \"/video_gen/mp4/" + results.tot + "\"}");
                // return Ok("{\"output_preview\": \"/video_gen/mp4/output_5.333sec.mp4\"}");
            } catch(InvalidOperationException ex){
                // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                _logger.LogWarning(ex.Message);
                return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
            }
            catch(Exception ex) {
                // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                _logger.LogWarning(ex.Message);
                return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
            }
        }


        [HttpPost("preview_bak")]
        public ActionResult Preview_bak([FromBody] string value) //  [FromBody] string b)
        {
            //_logger.LogWarning("ValuesController POST preview - value: " + value);
            _logger.LogWarning("ValuesController.cs - POST preview - value: " + value);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
            ChipElement[] chips = JsonConvert.DeserializeObject<ChipElement[]>(JsonConvert.SerializeObject(results.it));

            try {
              string fileName = "sentence_" + DateTime.Now.ToString("MM_dd_yyyy_HH_mm_ss");
              string xmlName = _savePath + @"\" + fileName + "_ok.xml"; // Scrivi direttamente il file xml giusto invece del mockup

              XDocument sentenceDocument = new XDocument(new XDeclaration("1.0", "UTF-8", null));

              XElement root = new XElement("ALEAOutput");

              XElement sentence =
                new XElement("newSentence",
                new XAttribute("italianText", results.tot), 
                new XAttribute("lemmaNumber", results.count),
                new XAttribute("text", results.tot),
                new XAttribute("writtenLISSentence", results.tot));

              foreach (ChipElement y in chips)
              {
                  if (true)
                  {
                      sentence.Add(new XElement("newLemma", 
                          new XAttribute("endTime", ""), 
                          new XAttribute("idAtlasSign", y.id),
                          new XAttribute("lemma", y.name),
                          new XAttribute("startTime", "") ));
                  }
              }
              root.Add(sentence);
              sentenceDocument.Add(root);
              _logger.LogWarning("ValuesController.cs - xml2:");
              var sw1 = new StringWriter();
              root.Save(sw1);
              string result1 = sw1.GetStringBuilder().ToString();
              _logger.LogWarning("ValuesController.cs - result1:" + result1);

              string path = Path.Combine(_savePath, fileName + "_ok.xml");
              sentenceDocument.Save(path);

              try {
                  ProcessStartInfo startInfo = new ProcessStartInfo();
                  startInfo.FileName = @"powershell.exe";
                  startInfo.Arguments = @"-NoLogo -ExecutionPolicy Bypass -Command """ + _udpscript + @" -Param1 '" + xmlName + @"' -Param2 '" + fileName + @"' -Param3 '" + _savePath + @"' -Param4 '" + results.tot + @"'  """;     // results.tot
                  _logger.LogWarning("ValuesController.cs - POST preview startInfo.Arguments: " + startInfo.Arguments);
                  startInfo.RedirectStandardOutput = true;
                  startInfo.RedirectStandardError = true;
                  startInfo.UseShellExecute = false;
                  startInfo.CreateNoWindow = true;
                  
                  Process process = new Process();
                  process.StartInfo = startInfo;
                  process.Start();

                  string standardOutput = process.StandardOutput.ReadToEnd().Replace(System.Environment.NewLine, "");
                  _logger.LogWarning("ValuesController.cs - POST preview powershell StandardOutput: " + standardOutput);

                  string standardError = process.StandardError.ReadToEnd().Replace(System.Environment.NewLine, "");
                  _logger.LogWarning("ValuesController.cs - POST preview powershell StandardError: " + standardError);

                  process.WaitForExit();

                  process.Dispose();
                  GC.Collect(); // Just for the diagnostics....

                  return Ok("{\"output_preview\": \"/video_gen/mp4/" + standardOutput + "\"}");

              } catch(InvalidOperationException ex){
                  // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                  _logger.LogWarning(ex.Message);
                  return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
              } catch(Exception ex) {
                  // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                  _logger.LogWarning(ex.Message);
                  return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
              }

          } catch(InvalidOperationException ex){
              // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
              _logger.LogWarning(ex.Message);
              return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
          }
          catch(Exception ex) {
              // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
              _logger.LogWarning(ex.Message);
              return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
          }
        }
        
        [HttpPost("preview")]
        public ActionResult Preview([FromBody] string value) //  [FromBody] string b)
        {
            //_logger.LogWarning("ValuesController POST preview - value: " + value);
            _logger.LogWarning("ValuesController.cs - POST preview - value: " + value);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
            ChipElement[] chips = JsonConvert.DeserializeObject<ChipElement[]>(JsonConvert.SerializeObject(results.it));

            try {
              string fileName = string.Equals(results.filename,"") ? results.filename : "sentence_" + DateTime.Now.ToString("MM_dd_yyyy_HH_mm_ss");
              // Il nome del file deve arrivare dal frontend, potendo essere scelto dall'utente e dovendo essere diverso tra didattica e meteo // "sentence_" + DateTime.Now.ToString("MM_dd_yyyy_HH_mm_ss");
              // string xmlName = _savePath + @"\" + fileName + "_ok.xml"; // Scrivi direttamente il file xml giusto invece del mockup
              // string pa th = Path.Combine(_savePath, fileName + "_ok.xml");

              // string jj = "hh hh tt nn u e hhhh";
              // string ids = "3,5,7,8,1,34,67,54,24,75,866,34,23,657,876";

              try {
                  ProcessStartInfo startInfo = new ProcessStartInfo();
                  startInfo.FileName = @"powershell.exe";
                  startInfo.Arguments = @"-NoLogo -ExecutionPolicy Bypass -Command """ + _xmlscript + @" -Param1 '" + _savePath + @"' -Param2 '" + fileName + @"' -Param3 '" + results.tot + @"' -Param4 '" + results.tot_id + @"'  """;     // results.tot
                  _logger.LogWarning("ValuesController.cs - POST preview startInfo.Arguments: " + startInfo.Arguments);
                  startInfo.RedirectStandardOutput = true;
                  startInfo.RedirectStandardError = true;
                  startInfo.UseShellExecute = false;
                  startInfo.CreateNoWindow = true;
                  
                  Process process = new Process();
                  process.StartInfo = startInfo;
                  process.Start();

                  string standardOutput_1 = process.StandardOutput.ReadToEnd().Replace(System.Environment.NewLine, "");
                  _logger.LogWarning("ValuesController.cs - POST preview powershell StandardOutput: " + standardOutput_1);

                  string standardError_1 = process.StandardError.ReadToEnd().Replace(System.Environment.NewLine, "");
                  _logger.LogWarning("ValuesController.cs - POST preview powershell StandardError: " + standardError_1);

                  process.WaitForExit();
                  process.Dispose();
                  // GC.Collect(); // Just for the diagnostics....

                  startInfo = new ProcessStartInfo();
                  startInfo.FileName = @"powershell.exe";
                  // @"C:\\Users\\admin\\Videos"
                  startInfo.Arguments = @"-NoLogo -ExecutionPolicy Bypass -Command """ + _udpscript + @" -Param1 '" + standardOutput_1 + @"' -Param2 '" + fileName + @"' -Param3 '" + _savePath + @"' -Param4 '" + results.tot + @"'  """;     // results.tot
                  _logger.LogWarning("ValuesController.cs - POST preview startInfo.Arguments: " + startInfo.Arguments);
                  startInfo.RedirectStandardOutput = true;
                  startInfo.RedirectStandardError = true;
                  startInfo.UseShellExecute = false;
                  startInfo.CreateNoWindow = true;
                  
                  process = new Process();
                  process.StartInfo = startInfo;
                  process.Start();

                  string standardOutput = process.StandardOutput.ReadToEnd().Replace(System.Environment.NewLine, "");
                  _logger.LogWarning("ValuesController.cs - POST preview powershell StandardOutput: " + standardOutput);

                  string standardError = process.StandardError.ReadToEnd().Replace(System.Environment.NewLine, "");
                  _logger.LogWarning("ValuesController.cs - POST preview powershell StandardError: " + standardError);

                  process.WaitForExit();

                  process.Dispose();
                  GC.Collect(); // Just for the diagnostics....
                  return Ok("{\"output_preview\": \"" + _videoUrl + '/' + standardOutput + "\"}");

              } catch(InvalidOperationException ex){
                  // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                  _logger.LogWarning(ex.Message);
                  return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
              } catch(Exception ex) {
                  // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                  _logger.LogWarning(ex.Message);
                  return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
              }

          } catch(InvalidOperationException ex){
              // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
              _logger.LogWarning(ex.Message);
              return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
          }
          catch(Exception ex) {
              // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
              _logger.LogWarning(ex.Message);
              return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
          }
        }


        [HttpPost("publish")]
        public ActionResult Publish([FromBody] string value)
        {
            _logger.LogWarning("ValuesController.cs - POST publish - value: " + value);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(value);

            try {
                  var name = results.name; // "ceeeeee"; // sentence_06_12_2020_14_57_04";
                  var ita = results.ita; // "dcdvv_ gn555grfrfr";
              try {
                  ProcessStartInfo startInfo = new ProcessStartInfo(); // "powershell.exe");
                  startInfo.FileName = @"powershell.exe";
                  
                  /*
                  startInfo.ArgumentList.Add(" -NoLogo ");
                  startInfo.ArgumentList.Add(" -ExecutionPolicy ");
                  startInfo.ArgumentList.Add(" Bypass ");
                  startInfo.ArgumentList.Add(" -Command ");
                  startInfo.ArgumentList.Add("\"" + "\"" + "\"");
                  startInfo.ArgumentList.Add(_zipscript); // + @" -Param1 '" + _savePath + @"' -Param2 '" + fileName + @"' -Param3 '" + results.tot + @"' -Param4 '" + results.tot_id + @"'  """;     // results.tot
                  startInfo.ArgumentList.Add(" -Param1 'C:\\Users\\admin\\Videos\\" + name + "'");
                  startInfo.ArgumentList.Add(" -Param2 '" + ita + "'");
                  startInfo.ArgumentList.Add(" -Param3 'C:\\Users\\admin\\Videos\\'");
                  startInfo.ArgumentList.Add(" -Param4 '" + name + "'");
                  startInfo.ArgumentList.Add(" -Param5 'C:\\Users\\admin\\Videos\\" + name + "'");
                  startInfo.ArgumentList.Add(" -Param6 'C:\\Users\\admin\\Videos\\" + name + "'" + '"' + '"' + '"');
                  
                  startInfo.Arguments = @"-NoLogo -ExecutionPolicy Bypass -Command """ + 
                    _zipscript + 
                    @" -Param1 '" + @"C:\\Users\\admin\\Videos\\" + name + "'"  + 
                    @" -Param2 '" + ita + "'"  +
                    @" -Param3 '" + @"C:\\Users\\admin\\Videos\\" + "'"  + 
                    @" -Param4 '" + name + "'"  +
                    @" -Param5 '" + @"C:\\Users\\admin\\Videos\\" + name + "'"  + 
                    @" -Param6 '" + @"C:\\Users\\admin\\Videos\\" + name + @"'  """;     // results.tot
                  */
                  startInfo.Arguments = @"-NoLogo -ExecutionPolicy Bypass -Command """ + 
                    _zipscript + 
                    @" -Param1 '" + _savePath + @"\\" + name + "'"  + 
                    @" -Param2 '" + ita + "'"  +
                    @" -Param3 '" + _savePath + @"\\" + "'"  + 
                    @" -Param4 '" + name + "'"  +
                    @" -Param5 '" + _savePath + @"\\" + name + "'"  + 
                    @" -Param6 '" + _savePath + @"\\" + name + @"'  """;     // results.tot
                  
                  _logger.LogWarning("ValuesController.cs - POST preview startInfo.Arguments: " + startInfo.Arguments);
                  // _logger.LogWarning("ValuesController.cs - POST preview startInfo.Arguments: " +  String.Join(" ", startInfo.ArgumentList));
                  // ValuesController.cs - POST preview startInfo.Arguments: -NoLogo -ExecutionPolicy Bypass -Command "D:\sentence_zip.ps1 -Param1 ''C:\\Users\\admin\\Videos\\ceeeeee' -Param2 'dcdvv_ gn555grfrfr' -Param3 ''C:\\Users\\admin\\Videos\\' -Param4 'dcdvv_ gn555grfrfr' -Param5 ''C:\\Users\\admin\\Videos\\ceeeeee' -Param6 ''C:\\Users\\admin\\Videos\\ceeeeee'  "

                  startInfo.RedirectStandardOutput = true;
                  startInfo.RedirectStandardError = true;
                  startInfo.UseShellExecute = false;
                  startInfo.CreateNoWindow = true;
                  
                  Process process = new Process();
                  process.StartInfo = startInfo;
                  process.Start();

                  // process.WaitForExit();
                  process.WaitForExit(1000 * 60 * 1);    // Wait up to five minutes

                  string standardOutput = process.StandardOutput.ReadToEnd().Replace(System.Environment.NewLine, "");
                  _logger.LogWarning("ValuesController.cs - POST publish powershell StandardOutput: " + standardOutput);

                  string standardError = process.StandardError.ReadToEnd().Replace(System.Environment.NewLine, "");
                  _logger.LogWarning("ValuesController.cs - POST publish powershell StandardError: " + standardError);

                  process.Dispose();
                  GC.Collect(); // Just for the diagnostics....
                  return Ok("{\"output_publish\": \"" + standardOutput.Replace("\\\\", "\\") + "\"}");

              } catch(InvalidOperationException ex){
                  // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                  _logger.LogWarning(ex.Message);
                  return Ok("{\"output_publish\": \"" + ex.Message + "\"}");
              } catch(Exception ex) {
                  // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                  _logger.LogWarning(ex.Message);
                  return Ok("{\"output_publish\": \"" + ex.Message + "\"}");
              }

          } catch(InvalidOperationException ex){
              // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
              _logger.LogWarning(ex.Message);
              return Ok("{\"output_publish\": \"" + ex.Message + "\"}");
          }
          catch(Exception ex) {
              // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
              _logger.LogWarning(ex.Message);
              return Ok("{\"output_publish\": \"" + ex.Message + "\"}");
          }
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
            _logger.LogWarning("ValuesController - upload uploadFileSize:" + uploadFileSize);
            string uploadFilePath = "";
            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    _logger.LogWarning("ValuesController - upload: " + formFile);
                    _logger.LogWarning("ValuesController - upload: " + formFile);
                    uploadFilePath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot", "dist/rules/glossario.csv");
                    
                    // Path.GetTempFileName();
                    using (var stream = System.IO.File.Create(uploadFilePath))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                } else {
                    _logger.LogWarning("ValuesController - upload: no files");
                    _logger.LogWarning("ValuesController - upload KO:");
                    return Ok(new { count = 0, uploadFileSize = 0, uploadFilePath = "no files" });
                }
            }
            // Process uploaded files
            // Don't rely on or trust the FileName property without validation.
            return Ok(new { count = files.Count, uploadFileSize, uploadFilePath });
        }
        
        // PUT api/values/menu/5
        [HttpPut("menu/{id}")]
        // public void Put(int id, [FromBody] string value)
        // public void UpdateMenu(int id, [FromBody] string value)
        public ActionResult UpdateMenu(int id, [FromBody] string value)
        {
          _logger.LogWarning("ValuesController PUT menu/{id} - querystring id: " + id);
          _logger.LogWarning("ValuesController PUT menu/{id} - body value: " + value);
          dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
          var idf = results.value;
          try {
            _connection = new MySqlConnection(this._connectionString);
            _connection.Open();
            using (_connection) {
              MySqlCommand command = new MySqlCommand();
              command.Connection = _connection;
              // string SQL = "UPDATE lis_menu ( auth, name_menu, url_menu, notes ) SET auth = ?auth, name_menu = ?name_menu, url_menu = ?url_menu, notes = ?notes WHERE id_menu = ?id)";
              string SQL = "UPDATE lis_request SET notes = 'Cancellata' WHERE id_request = ?id;";
              // menu/{id}
              command.CommandText = SQL;
              // command.Parameters.AddWithValue("?auth", true);
              // command.Parameters.AddWithValue("?name_menu", "menu_name");
              // command.Parameters.AddWithValue("?url_menu", "/path/to/menuvalue_new");
              // command.Parameters.AddWithValue("?notes", "menu_notes_!_new");
              command.Parameters.AddWithValue("?id", idf);
              command.ExecuteNonQuery();
              _connection.Close();
            }
              // return Ok("{\"insertRequest\": \"Ok\"}");
              return Ok("{\"ok_upd_request\": \"" + idf + "\"}");
          } catch (MySqlException ex) {
              // Log.Info("Error in adding mysql row. Error: " + ex.Message);
              _logger.LogWarning("ValuesController - Error in PUT menu/{id}. Error: " + ex.Message);
              _logger.LogWarning("ValuesController - Error in PUT menu/{id}. Error: " + ex.Message);
              return Ok("{\"upd_request\": \"Non Okei_mysqlex\"}");
          } catch(Exception ex) {
              _logger.LogWarning(ex.Message);
              return Ok("{\"upd_request\": \"Non Okei_ex\"}");
          }
          // return content;
        }

        // PUT api/values/setting/5
        [HttpPut("setting/{id}")]
        // public void Put(int id, [FromBody] string value)
        public void UpdateSetting(string id, [FromBody] string value)
        {
            _logger.LogWarning("ValuesController PUT - post_id: " + id);
            _logger.LogWarning("ValuesController PUT - value: " + value);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
            var idf = results.value;

            try {
                _connection = new MySqlConnection(this._connectionString);
                _connection.Open();
                using (_connection) {
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = _connection;
                    string SQL = "UPDATE lis_setting SET value_setting = ?value WHERE name_setting = ?name;";
                    command.CommandText = SQL;
                    // command.Parameters.AddWithValue("?auth", true);
                    command.Parameters.AddWithValue("?value", idf); //"menu_name");
                    command.Parameters.AddWithValue("?name", id);
                    // command.Parameters.AddWithValue("?notes", "menu_notes_!_new");
                    // command.Parameters.AddWithValue("?id", id);
                    command.ExecuteNonQuery();
                }
                _connection.Close();
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - Error in [HttpPut(\"setting\")]. Error: " + ex.Message);
            }
        }

        // DELETE api/values/5
        [HttpDelete("menu/{id}")]
        public void Delete(int id)
        {
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
