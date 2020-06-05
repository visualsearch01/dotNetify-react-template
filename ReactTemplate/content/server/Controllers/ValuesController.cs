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
        private readonly string _udpscript;
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
          var myUser = HttpContext.User;
          // _logger.LogWarning("ValuesController     - myUser:::::::::::::::::::::::::::::::::::::::::::::::::::::: " + HttpContext.User.Name);
          _logger.LogWarning("ValuesController     - myUser:::::::::::::::::::::::::::::::::::::::::::::::::::::: " + myUser.Identity);
          // _logger.LogWarning("ValuesController     - myUser.Nmae::::::::::::::::::::::::::::::::::::::::::::::::: " + myUser.Identities.FirstOrDefault().NameIdentifier);
          
          System.Security.Claims.ClaimsIdentity principal = myUser.Identities.FirstOrDefault() as System.Security.Claims.ClaimsIdentity;
          if (null != principal)
          {
            _logger.LogWarning("ValuesController     - userprincipal not null");
            foreach (Claim claim in principal.Claims)
            {
              Console.WriteLine("ValuesController.cs ---------- CLAIM TYPE: " + claim.Type + "; CLAIM VALUE: " + claim.Value + "</br>");
            }
          }
          return myUser.Identities.Any(x => x.IsAuthenticated);
        }

        // public ValuesController(IConfiguration configuration, ILogger<ValuesController> logger)
        public ValuesController(IPrincipalAccessor principalAccessor, IHttpContextAccessor bb, ILiveDataService liveDataService, IUserRepository _userRepository, IConfiguration configuration, ILogger<ValuesController> logger) // {
        // public ValuesController(IPrincipalAccessor principalAccessor, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ILogger<ValuesController> logger)
        // public ValuesController(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ILogger<ValuesController> logger)
        {
          hh = _userRepository;
          _hhh = bb;
          _nn = principalAccessor;
          // IHttpContextAccessor httpContextAccessor, 
          // User.FindFirst(ClaimTypes.NameIdentifier).Value
          // EDIT for constructor
          // Below code works:
          // public Controller(IHttpContextAccessor httpContextAccessor)
          // {

          // var user = await this.LoggedIn();
          // var user = httpContextAccessor.HttpContext.User; //.FindFirst(ClaimTypes.NameIdentifier).Value;
          // var email = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

          _logger = logger;
          // _logger.LogWarning("ValuesController     - userId:::::::::::::::::::::::::::::::::::::::::::::::::::::: " + httpContextAccessor.HttpContext.User);
          /*
          _logger.LogWarning("ValuesController     - userId:::::::::::::::::::::::::::::::::::::::::::::::::::::: " + HttpContext.User);
          _logger.LogWarning("ValuesController     - email :::::::::::::::::::::::::::::::::::::::::::::::::::::: " + email);
          Console.WriteLine("ValuesController.cs - httpContextAccessor.HttpContext.User.Identity.Name ----------- " + user.Identity.Name);

          ClaimsPrincipal principal = user.Identity as ClaimsPrincipal;
          if (null != principal)
          {
            _logger.LogWarning("ValuesController     - userprincipal not null");
            foreach (Claim claim in principal.Claims)
            {
              Console.WriteLine("ValuesController.cs ---------- CLAIM TYPE: " + claim.Type + "; CLAIM VALUE: " + claim.Value + "</br>");
            }
          }
          */
          /*
          var userIdentity = principalAccessor.Principal.Identity as ClaimsIdentity;
          foreach (Claim claim in userIdentity.Claims)  
          {  
            _logger.LogInformation("ValuesController ::::::::::::::::::::::::::: CLAIM TYPE: " + claim.Type + "; CLAIM VALUE: " + claim.Value); //  + "</br>");
          }
          */

          // }
          // IConfiguration configuration, ILogger<ValuesController> logger)
          // _connectionString = configuration.GetConnectionString("ConnectionStrings:lis");
          // Console.WriteLine("ValuesController.cs - costruttore, configurazione: " + configuration.ToString());

          var pathBase = HttpContext; // .Request.PathBase;
          _logger.LogWarning("ValuesController.cs - costruttore, HttpContext: " + HttpContext); //_configuration["ConnectionStrings:lis"]);


          // _logger.LogWarning("ValuesController.cs - costruttore, HttpContext.Trace: " + HttpContext.TraceIdentifier);

          // _logger.LogWarning("ValuesController.cs - costruttore, this.Error: " + this.Error());

          _connectionString = configuration.GetConnectionString("lis"); //  _configuration.GetValue<string>("ConnectionStrings:lis");
          _logger.LogWarning("ValuesController.cs - costruttore, stringa connessione DB MySQL: " + _connectionString); //_configuration["ConnectionStrings:lis"]);

          _translatescript = configuration.GetValue<string>("Scripts:translate");
          _logger.LogWarning("ValuesController.cs - costruttore, script Powershell di translate: " + _translatescript); //_configuration["ConnectionStrings:lis"]);

          _udpscript  = configuration.GetValue<string>("Scripts:sentence_udp");
          _logger.LogWarning("ValuesController.cs - costruttore, script Powershell di udp: " + _udpscript); //_configuration["ConnectionStrings:lis"]);

          _savePath = configuration.GetValue<string>("Paths:sentences");
          _logger.LogWarning("ValuesController.cs - costruttore, path Powershell di save: " + _savePath); //_configuration["ConnectionStrings:lis"]);

        }

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
                Console.WriteLine("ValuesController - Error in [HttpGet(\"meteo\")]. Error: " + ex.Message);
                return Ok("{\"meteo\": \"Non Okei_mysqlex\"}");
            } catch(Exception ex) {
                Console.WriteLine(ex.Message);
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
          // Console.WriteLine("ValuesControllerhboard - Nameeeeee -------------------------: " + this._hhh.HttpContext.User.Claims.Last(i => i.Type == ClaimTypes.NameIdentifier).Value);
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
                Console.WriteLine("ValuesController - Error in [HttpGet(\"meteo/id\")]. Error: " + ex.Message);
                return Ok("{\"meteo_id\": \"Non Okei_mysqlex\"}");
            } catch(Exception ex) {
                Console.WriteLine(ex.Message);
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
            Console.WriteLine("ValuesController.cs - process powershell output: " + output);
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
                Console.WriteLine("ValuesController.cs - translate1 - process powershell output: " + output);

                process.Dispose();
                GC.Collect(); // Just for the diagnostics....
                return Ok("{\"translation\": \"" + output + "\"}");
            }
            catch(InvalidOperationException ex){
                Console.WriteLine(ex.Message);
                return Ok("{\"translation\": \"" + ex.Message + "\"}");
            }
            catch(Exception ex) {
                Console.WriteLine(ex.Message);
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
                Console.WriteLine("ValuesController - Error in [HttpGet(\"Get_sign\")]. Error: " + ex.Message);
                return Ok("{\"sign\": \"Non Okei_mysqlex\"}");
            } catch(Exception ex) {
                Console.WriteLine(ex.Message);
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
         */
        [HttpPost("text_trad")]
        // public string JsonStringBody([FromBody] string value)
        public ActionResult InsertText([FromBody] string value)
        {
            long lastId;
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
                        Console.WriteLine("ValuesController text_trad - changes.IdTextIta: " + changes.IdTextIta);
                        Console.WriteLine("ValuesController text_trad - changes.IdTextLis: " + changes.IdTextLis);
                        // int.TryParse(changes.IdTextIta, out int itaId);
                        // int.TryParse(changes.IdTextLis, out int lisId);
                        // int itaId = changes.IdTextIta;
                        // int lisId = changes.IdTextLis;
                        command.Parameters.Clear();
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
                        Console.WriteLine("ValuesController text_trad POST - INSERT ITA OK");

                        command.Parameters.Clear();
                        command.CommandText = "SELECT MAX(id_text_ita) AS id_text_ita FROM lis_text_ita;";
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                          reader.Read(); // )
                          lastItaId = reader.GetInt32("id_text_ita");
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
                        Console.WriteLine("ValuesController text_trad POST - INSERT LIS OK");

                        command.Parameters.Clear();
                        command.CommandText = "SELECT MAX(id_text_lis) AS id_text_lis FROM lis_text_lis;";
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                          reader.Read(); // )
                          lastLisId = reader.GetInt32("id_text_lis");
                        }
                        
                        // L'inserimento nella 
                        command.Parameters.Clear();
                        command.CommandText = "INSERT INTO lis_text_trans (id_text_ita, id_text_lis) VALUES (?id_text_ita, ?id_text_lis);";
                        command.Parameters.AddWithValue("?id_text_ita", lastItaId);
                        command.Parameters.AddWithValue("?id_text_lis", lastLisId);
                        command.ExecuteNonQuery();
                        Console.WriteLine("ValuesController text_trad POST - INSERT TRANS OK");
                        
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
                        lastId = command.LastInsertedId;
                        Console.WriteLine("ValuesController text_trad POST - INSERT TRANS2 OK, lastId: " + lastId);
                    }
                    _connection.Close();
                }
                return Ok("{\"id_text_trans\": \"" + lastId + "\",\"id_text_ita\": \"" + lastItaId + "\",\"id_text_lis\": \"" + lastLisId + "\"}");
            } catch (MySqlException ex) {
                // Log.Info("Error in adding mysql row. Error: " + ex.Message);
                _logger.LogWarning("ValuesController - MySQL Error in [HttpPost\"text_trad\")]. Error: " + ex.Message);
                Console.WriteLine("ValuesController - MySQL Error in [HttpPost(\"text_trad\")]. Error: " + ex.Message);
                return Ok("{\"id_text_trans\": \"Non Okei_mysqlex\"}");
            } catch(Exception ex) {
                Console.WriteLine("ValuesController - Error in [HttpPost(\"text_trad\")]. Error: " + ex.Message);
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
                        Console.WriteLine("ValuesController request POST - INSERT REQUEST OK");
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
                Console.WriteLine("ValuesController - Error in [HttpPost(\"request\")]. Error: " + ex.Message);
                return Ok("{\"request\": \"Non Okei_mysqlex\"}");
            } catch(Exception ex) {
                Console.WriteLine(ex.Message);
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
            Console.WriteLine("ValuesController.cs - POST translate - translateText: " + translateText);
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

                string output = process.StandardOutput.ReadToEnd().Replace(System.Environment.NewLine, "");
                Console.WriteLine("ValuesController.cs - POST translate powershell output: " + output);
                
                process.Dispose();
                GC.Collect(); // Just for the diagnostics....

                return Ok("{\"translation\": \"" + output + "\"}");
                // return Ok("{\"expiresAt\": \"2015-11-03T10:15:57.000Z\", \"status\": \"SUCCESS\", \"relayState\": \"/myapp/some/deep/link/i/want/to/return/to\", \"sessionToken\": \"00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe\", \"_embedded\": { \"user\": { \"id\": \"00ub0oNGTSWTBKOLGLNR\", \"passwordChanged\": \"2015-09-08T20:14:45.000Z\", \"profile\": { \"login\": \"dade.murphy@example.com\", \"firstName\": \"Dade\", \"lastName\": \"Murphy\", \"locale\": \"en_US\", \"timeZone\": \"America/Los_Angeles\" } } } } ");
                // return Ok(ff); // new string[] { "value1", "value2_" + product };
            } catch(InvalidOperationException ex){
                _logger.LogWarning("ValuesController - Error in [HttpPost(\"translate\")]. Error: " + ex.Message);
                Console.WriteLine(ex.Message);
                return Ok("{\"translation\": \"" + ex.Message + "\"}");
            }
            catch(Exception ex) {
                _logger.LogWarning("ValuesController - Error in [HttpPost(\"translate\")]. Error: " + ex.Message);
                Console.WriteLine(ex.Message);
                return Ok("{\"translation\": \"" + ex.Message + "\"}");
            }
        }


        [HttpPost("preview1")]
        public ActionResult Preview1([FromBody] string value) //  [FromBody] string b)
        {
            try {
                //_logger.LogWarning("ValuesController POST preview - value: " + value);
                Console.WriteLine("ValuesController.cs - POST preview - value: " + value);
                dynamic results = JsonConvert.DeserializeObject<dynamic>(value);
                // string sentenceText = results.value; // .Replace("=","");
                // _logger.LogWarning("ValuesController POST publish - value: ");
                // _logger.LogWarning(idf);
                Console.WriteLine("ValuesController.cs - POST preview - deserialize result: " + results);

                // return Ok("{\"output_preview\": \"" + sentenceText + "_//video_gen/mp4/output_2sec.mp4\"}");
                return Ok("{\"output_preview\": \"/video_gen/mp4/" + results.tot + "\"}");
                // return Ok("{\"output_preview\": \"/video_gen/mp4/output_5.333sec.mp4\"}");
            } catch(InvalidOperationException ex){
                // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                Console.WriteLine(ex.Message);
                return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
            }
            catch(Exception ex) {
                // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                Console.WriteLine(ex.Message);
                return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
            }
        }


        [HttpPost("preview")]
        public ActionResult Preview([FromBody] string value) //  [FromBody] string b)
        {
            //_logger.LogWarning("ValuesController POST preview - value: " + value);
            Console.WriteLine("ValuesController.cs - POST preview - value: " + value);
            dynamic results = JsonConvert.DeserializeObject<dynamic>(value);

            // dynamic obj = JsonConvert.DeserializeObject<dynamic>(message);
            ChipElement[] chips = JsonConvert.DeserializeObject<ChipElement[]>(JsonConvert.SerializeObject(results.it));

            // ret.tot = event.target.value.replace(/\s\s+/g, ' ').trim();
            // ret.it = [];

            // string sentenceText = results.value; // .Replace("=","");
            // _logger.LogWarning("ValuesController POST publish - value: ");
            // _logger.LogWarning(idf);
            // Console.WriteLine("ValuesController.cs - POST preview - sentenceText enc base64 UTF8: " + sentenceText);

            /*
            : Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddleware[1]
                An unhandled exception has occurred while executing the request.
            Microsoft.CSharp.RuntimeBinder.RuntimeBinderException: The best overloaded method match for 'System.Convert.FromBase64String(string)' has some invalid arguments
            at CallSite.Target(Closure , CallSite , Type , Object )
            at dotnetify_react_template.server.Controllers.ValuesController.Preview(String value) in c:\Users\admin\source\Workspaces\dotnetify-react-demo-vs2017\ReactTemplate\content\server\Controllers\ValuesController.cs:line 671
            */

            /*
            string returnValue;
            try {
                int mod4 = sentenceText.Length % 4;
                if (mod4 > 0)
                {
                    sentenceText += new string('=', 4 - mod4);
                }

                byte[] encodedDataAsBytes = System.Convert.FromBase64String(sentenceText);
                
                // var str = "eyJpc3MiOiJodHRwczovL2lkZW50aXR5LXN0YWdpbmcuYXNjZW5kLnh5eiIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHktc3RhZ2luZy5hc2NlbmQueHl6L3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjY5OTRBNEE4LTBFNjUtNEZFRC1BODJCLUM2ODRBMEREMTc1OCIsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJzdWIucmVhZCIsImRhdGEud3JpdGUiLCJkYXRhLnJlYWQiLCJhbGcuZXhlY3V0ZSJdLCJzdWIiOiIzNzdjMDk1Yi03ODNiLTQ3ZTctOTdiMS01YWVkOThjMDM4ZmMiLCJhbXIiOiJleHRlcm5hbCIsImF1dGhfdGltZSI6MTQwNzYxNTUwNywiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMDg0MGM3NjAtNmY3Yi00NTU2LWIzMzctOGMwOTBlMmQ0NThkLyIsIm5hbWUiOiJwa3NAYXNjZW5kLnh5eiIsImV4cCI6MTQwNzgzNjcxMSwibmJmIjoxNDA3ODMzMTExfQ";
                
                returnValue = System.Text.Encoding.UTF8.GetString(encodedDataAsBytes);
            }
            catch(Exception ex) {
                _logger.LogWarning("ValuesController - Error in [HttpPost(\"preview\")]. Error: " + ex.Message);
                Console.WriteLine("ValuesController - Error in [HttpPost(\"preview\")]. Error: " + ex.Message);
                // TESTTTTT______mostra perfetto bambino alto tutti_e_due ciascuno spiegare accordo esperienza suo avere
                byte[] encodedDataAsBytes = System.Convert.FromBase64String("VEVTVFRUVFRfX19fX19tb3N0cmEgcGVyZmV0dG8gYmFtYmlubyBhbHRvIHR1dHRpX2VfZHVlIGNpYXNjdW5vIHNwaWVnYXJlIGFjY29yZG8gZXNwZXJpZW56YSBzdW8gYXZlcmU=");
                returnValue = System.Text.Encoding.UTF8.GetString(encodedDataAsBytes);
            }
            */
            /*
            string base64 = "YWJjZGVmPT0=";
            byte[] bytes = Convert.FromBase64String(base64);
            At this point, bytes will be a byte[] (not a string). If we know that the byte array represents a string in UTF8, then it can be converted back to the string form using:

            string str = Encoding.UTF8.GetString(bytes);
            Console.WriteLine(str);
            */

            // Console.WriteLine("ValuesController.cs - POST preview - sentenceText dec base64 UTF8: " + returnValue);

            try {
              /*
              string xml = @"
                  <?xml version=""1.0"" encoding=""UTF-8""?>
                  <ALEAOutput>
                      <newSentence italianText=""" + results.tot + @""" lemmaNumber=""11"" text="""" writtenLISSentence=""" + results.tot + @""">
                          <newLemma endTime="""" idAtlasSign=""01459"" lemma=""" + results.it[0].name + @""" startTime="""" />
                          <newLemma endTime="""" idAtlasSign=""03116"" lemma=""perfetto"" startTime="""" />
                          <newLemma endTime="""" idAtlasSign=""00247"" lemma=""bambino"" startTime="""" />
                          <newLemma endTime="""" idAtlasSign=""03006"" lemma=""alto"" startTime="""" />
                          <newLemma endTime="""" idAtlasSign=""02477"" lemma=""tutti_e_due"" startTime="""" />
                          <newLemma endTime="""" idAtlasSign=""00487"" lemma=""ciascuno"" startTime="""" />
                          <newLemma endTime="""" idAtlasSign=""02266"" lemma=""spiegare"" startTime="""" />
                          <newLemma endTime="""" idAtlasSign=""00025"" lemma=""accordo"" startTime="""" />
                          <newLemma endTime="""" idAtlasSign=""00835"" lemma=""esperienza"" startTime="""" />
                          <newLemma endTime="""" idAtlasSign=""02826"" lemma=""suo"" startTime="""" />
                          <newLemma endTime="""" idAtlasSign=""00224"" lemma=""avere"" startTime="""" />
                      </newSentence>
                  </ALEAOutput>
              ";
              */
              string fileName = "sentence_" + DateTime.Now.ToString("MM_dd_yyyy_HH_mm_ss");
              // string xmlName = _savePath + @"\" + fileName + ".xml";
              // System.IO.File.WriteAllText(xmlName, xml);

              string xmlName = _savePath + @"\" + fileName + "_ok.xml"; // Scrivi direttamente il file xml giusto invece del mockup
              // System.IO.File.WriteAllText(xmlName, xml); // Disabilita scrittura mockup

              /*
              <?xml version="1.0" encoding="UTF-8"?>
              <ALEAOutput>
                  <newSentence italianText="mattino presto mattino piemonte sud metri nuvolosita neve vento leggero" lemmaNumber="11" text="" writtenLISSentence="mattino presto mattino piemonte sud metri nuvolosita neve vento leggero">
                      <newLemma endTime="" idAtlasSign="01459" lemma="mattino" startTime="" />
                      <newLemma endTime="" idAtlasSign="03116" lemma="perfetto" startTime="" />
                      <newLemma endTime="" idAtlasSign="00247" lemma="bambino" startTime="" />
                      <newLemma endTime="" idAtlasSign="03006" lemma="alto" startTime="" />
                      <newLemma endTime="" idAtlasSign="02477" lemma="tutti_e_due" startTime="" />
                      <newLemma endTime="" idAtlasSign="00487" lemma="ciascuno" startTime="" />
                      <newLemma endTime="" idAtlasSign="02266" lemma="spiegare" startTime="" />
                      <newLemma endTime="" idAtlasSign="00025" lemma="accordo" startTime="" />
                      <newLemma endTime="" idAtlasSign="00835" lemma="esperienza" startTime="" />
                      <newLemma endTime="" idAtlasSign="02826" lemma="suo" startTime="" />
                      <newLemma endTime="" idAtlasSign="00224" lemma="avere" startTime="" />
                  </newSentence>
              </ALEAOutput>
              */
              XDocument sentenceDocument = new XDocument(new XDeclaration("1.0", "UTF-8", null));

              // At this point RejectedXmlList.Root is still null, so add a unique root element.
              XElement root = new XElement("ALEAOutput");

              XElement sentence =
                new XElement("newSentence",
                new XAttribute("italianText", results.tot), 
                new XAttribute("lemmaNumber", results.count),
                new XAttribute("text", results.tot),
                new XAttribute("writtenLISSentence", results.tot));

              // RejectedXmlList.Add(roo);
              // Add elements for each Parameter to the root element
              // foreach (Parameter Myparameter in Parameters)
              /*
                              e":"","validatore":""},{"id":573,"name":"pioggia","name_player":"pioggia.lis","name_editor":"28600-pioggia-","code":"","contesto":"","progetto":"","contributo":"","inteprete":"","animatore":"","validatore":""},{"id":240,"name":"diminuire","name_player":"diminuire.lis","name_editor":"11950-diminuire-","code":"","contesto":"","progetto":"","contributo":"","inteprete":"","animatore":"","validatore":""},{"id":729,"name":"tempo","name_player":"tempo.lis","name_editor":"36400-tempo-","code":"","contesto":"","progetto":"","contributo":"","inteprete":"","animatore":"","validatore":""},{"id":165,"name":"brutto","name_player":"brutto.lis","name_editor":"08200-brutto-","code":"","contesto":"","progetto":"","contributo":"","inteprete":"","animatore":"","validatore":""},{"id":118,"name":"area","name_player":"area.lis","name_editor":"05850-area-","code":"","contesto":"","progetto":"","contributo":"","inteprete":"","animatore":"","validatore":""},{"id":92,"name":"altro","name_player":"altro.lis","name_editor":"04550-altro-","code":"","contesto":"","progetto":"","contributo":"","inteprete":"","animatore":"","validatore":""}],"count":12}
              Cannot convert type 'Newtonsoft.Json.Linq.JObject' to 'dotnetify_react_template.server.Controllers.ChipElement'
              infoinfo: Microsoft.AspNetCore.Mvc.Internal.ControllerActionInvoker[2]
                  Executed action method dotnetify_react_template.server.Controllers.ValuesController.Preview (dotnetify_react_template), returned result Microsoft.AspNetCore.Mvc.OkObjectResult in 488.147ms.
              : Microsoft.AspNetCore.Mvc.Internal.ControllerActionInvoker[2]
                  Executed action method dotnetify_react_template.server.Controllers.ValuesController.Preview (dotnetify_react_template), returned result Microsoft.AspNetCore.Mvc.OkObjectResult in 488.147ms.
              infoinfo: Microsoft.AspNetCore.Mvc.Infrastructure.ObjectResultExecutor[1]
              */

              foreach (ChipElement y in chips)
              {
                  if (true)
                  {
                      // XElement xelement = new XElement(Myparameter.ParameterName, CurrentData.ToString());
                      // RejectedXmlList.Root.Add(xelement);
                      sentence.Add(new XElement("newLemma", 
                          new XAttribute("endTime", ""), 
                          new XAttribute("idAtlasSign", y.id),
                          new XAttribute("lemma", y.name),
                          new XAttribute("startTime", "") ));
                  }
              }
              root.Add(sentence);
              sentenceDocument.Add(root);
              Console.WriteLine("ValuesController.cs - xml2:");
              // Console.WriteLine(RejectedXmlList);
              var sw1 = new StringWriter();
              root.Save(sw1);
              string result1 = sw1.GetStringBuilder().ToString();
              Console.WriteLine(result1);

              // The XDeclaration will be available when you use one of the XDocument.Save methods. For example:

              string path = Path.Combine(_savePath, fileName + "_ok.xml");
              sentenceDocument.Save(path);

              /*
              <?xml version="1.0" encoding="utf-8"?>
              <ALEAOutput>
              <newSentence italianText="mattino presto mattino piemonte sud metri nuvolosita neve vento leggero" lemmaNumber="10" text="mattino presto mattino piemonte sud metri nuvolosita neve vento leggero" writtenLISSentence="mattino presto mattino piemonte sud metri nuvolosita neve vento leggero">
                  <newLemma endTime="" idAtlasSign="440" lemma="mattino" startTime="" />
                  <newLemma endTime="" idAtlasSign="595" lemma="presto" startTime="" />
                  <newLemma endTime="" idAtlasSign="440" lemma="mattino" startTime="" />
                  <newLemma endTime="" idAtlasSign="571" lemma="piemonte" startTime="" />
                  <newLemma endTime="" idAtlasSign="702" lemma="sud" startTime="" />
                  <newLemma endTime="" idAtlasSign="449" lemma="metri" startTime="" />
                  <newLemma endTime="" idAtlasSign="508" lemma="nuvolosita" startTime="" />
                  <newLemma endTime="" idAtlasSign="491" lemma="neve" startTime="" />
                  <newLemma endTime="" idAtlasSign="794" lemma="vento" startTime="" />
                  <newLemma endTime="" idAtlasSign="398" lemma="leggero" startTime="" />
              </newSentence>
              </ALEAOutput>
              */

              try {
                  ProcessStartInfo startInfo = new ProcessStartInfo();
                  startInfo.FileName = @"powershell.exe";
                  startInfo.Arguments = @"-NoLogo -ExecutionPolicy Bypass -Command """ + _udpscript + @" -Param1 '" + xmlName + @"' -Param2 '" + fileName + @"' -Param3 '" + _savePath + @"' -Param4 '" + results.tot + @"'  """;     // results.tot
                  Console.WriteLine("ValuesController.cs - POST preview startInfo.Arguments: " + startInfo.Arguments);
                  startInfo.RedirectStandardOutput = true;
                  startInfo.RedirectStandardError = true;
                  startInfo.UseShellExecute = false;
                  startInfo.CreateNoWindow = true;
                  
                  Process process = new Process();
                  process.StartInfo = startInfo;
                  process.Start();

                  /*
                  Process p = new Process();
                  p.StartInfo.RedirectStandardOutput = true;
                  p.StartInfo.RedirectStandardError = true;         
                  p.StartInfo.UseShellExecute = false; 

                  StringBuilder sb = new StringBuilder("/COVERAGE ");
                  sb.Append("helloclass.exe");
                  p.StartInfo.FileName = "vsinstr.exe";
                  p.StartInfo.Arguments = sb.ToString();
                  p.Start();

                  string stdoutx = p.StandardOutput.ReadToEnd();         
                  string stderrx = p.StandardError.ReadToEnd();             
                  p.WaitForExit();

                  Console.WriteLine("Exit code : {0}", p.ExitCode);
                  Console.WriteLine("Stdout : {0}", stdoutx);
                  Console.WriteLine("Stderr : {0}", stderrx);
                  */
                  string standardOutput = process.StandardOutput.ReadToEnd().Replace(System.Environment.NewLine, "");
                  Console.WriteLine("ValuesController.cs - POST preview powershell StandardOutput: " + standardOutput);

                  string standardError = process.StandardError.ReadToEnd().Replace(System.Environment.NewLine, "");
                  Console.WriteLine("ValuesController.cs - POST preview powershell StandardError: " + standardError);

                  process.WaitForExit();

                  process.Dispose();
                  GC.Collect(); // Just for the diagnostics....

                  // return Ok("{\"output_preview\": \"" + sentenceText + "_//video_gen/mp4/output_2sec.mp4\"}");
                  return Ok("{\"output_preview\": \"/video_gen/mp4/" + standardOutput + "\"}");
                  // return Ok("{\"output_preview\": \"/video_gen/mp4/output_5.333sec.mp4\"}");

              } catch(InvalidOperationException ex){
                  // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                  Console.WriteLine(ex.Message);
                  return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
              } catch(Exception ex) {
                  // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
                  Console.WriteLine(ex.Message);
                  return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
              }

          } catch(InvalidOperationException ex){
              // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
              Console.WriteLine(ex.Message);
              return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
          }
          catch(Exception ex) {
              // _logger.LogWarning("ValuesController - Error in [HttpPost(\"output_preview\")]. Error: " + ex.Message);
              Console.WriteLine(ex.Message);
              return Ok("{\"output_preview\": \"" + ex.Message + "\"}");
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
            Console.WriteLine("ValuesController - upload uploadFileSize:" + uploadFileSize);
            string uploadFilePath = "";
            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    _logger.LogWarning("ValuesController - upload: " + formFile);
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
                    _logger.LogWarning("ValuesController - upload: no files");
                    Console.WriteLine("ValuesController - upload KO:");
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
              Console.WriteLine("ValuesController - Error in PUT menu/{id}. Error: " + ex.Message);
              return Ok("{\"upd_request\": \"Non Okei_mysqlex\"}");
          } catch(Exception ex) {
              Console.WriteLine(ex.Message);
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
