﻿using dotnetify_react_template.server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reactive.Linq;
using System.Reactive;
using System.Text;

namespace dotnetify_react_template
{
  public interface IEmployeeService
  {
    IList<EmployeeModel> GetAll();
    LisRequest GetRequest(int id);
    IList<LisRequest> GetRequests();
    IList<LisRequestTrans> GetRequestsTrans(int id);
    IList<LisSetting> GetAllSet();
    EmployeeModel GetById(int id);
    string getCs();
    string getUrl();
    string getEmail();
    string getFtp();
    string get1ed();
    string get2ed();
    string get3ed();
    int Add(EmployeeModel record);
    void Update(EmployeeModel record);
    void Delete(int id);
    // string _connectionString;
  }

  public class EmployeeModel
  {
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PaginaTelevideo { get; set; }
	  public string[] Estrazioni { get; set; }
	  public string IndirizzoFTP { get; set; }
    public string IndirizzoEmail { get; set; }
    public int ReportTo { get; set; }
    public string FullName => $"{FirstName} {LastName}";
  }

  public class EmployeeService : IEmployeeService
  {
    private List<EmployeeModel> _employees;
    // private List<LisRequest> _requests;
    // private List<LisSetting> _settings;
    private int _newId;
    
    private string _url = "";
    private string _email = "";
    private string _ftp = "";
    private string _1ed = "";
    private string _2ed = "";
    private string _3ed = "";

    private MySqlConnection _connection;
    // private string _cs = @"server=localhost;port=3306;database=lis2;user=root;password=root";
    // private string _connectionString;
    private string _connectionString { get; set; }

    // La stringa di connessione MySQL viene passata a questo componente da Startup
    // Il metodo seguente serve per passarla ad altri componenti che possono averne bisogno, anchese bisognerebbe centralizzare qui
    public string getCs() { return this._connectionString; }
    public string getUrl() { return this._url; }
    public string getEmail() { return this._email; }
    public string getFtp() { return this._ftp; }
    public string get1ed() { return this._1ed; }
    public string get2ed() { return this._2ed; }
    public string get3ed() { return this._3ed; }
    // private readonly IHttpContextAccessor _httpContextAccessor;      
    // IHttpContextAccessor httpContextAccessor, 
    public EmployeeService(string connectionString) // IServiceCollection services, IConfiguration configuration)
    {
      // _httpContextAccessor = httpContextAccessor;
      // Console.WriteLine("EmployeeService.cs - _httpContextAccessor.HttpContext.User.Identity.Name ----------- " + this._httpContextAccessor.HttpContext.User.Identity.Name);
      _connectionString = connectionString; // configuration.GetValue<string>("ConnectionStrings:lis");
      // throw new FileNotFoundException();
      /*
      IDisposable writer = new FileSystemObservable(@"D:\", "*.*", false)
        .CreatedFiles
        .Where(x => (new FileInfo(x.FullPath)).Length > 0)
        .Select(x => x.Name)
        .Subscribe(Console.WriteLine);
      // Console.ReadLine();
      * /

      FileSystemWatcher fsw = new FileSystemWatcher(@"C:\Users\Public", "*.*");
      fsw.EnableRaisingEvents = true;
      // Use the FromEventPattern operator to setup a subscription to the Created event
      IObservable<EventPattern<FileSystemEventArgs>> fswCreated = Observable.FromEventPattern<FileSystemEventArgs>(fsw, "Created");
      fswCreated.Subscribe(pattern => Console.WriteLine("{0} was created in {1}.", pattern.EventArgs.Name, ((FileSystemWatcher)pattern.Sender).Path));
      // Use the FromEventPattern operator to setup a subscription to the Renamed event
      IObservable<EventPattern<RenamedEventArgs>> fswRenamed = Observable.FromEventPattern<RenamedEventArgs>(fsw, "Renamed");
      fswRenamed.Subscribe(pattern => Console.WriteLine("{0} was renamed to {1} in {2}.", pattern.EventArgs.OldName, 
        pattern.EventArgs.Name, ((FileSystemWatcher)pattern.Sender).Path));
      */
      _employees = JsonConvert.DeserializeObject<List<EmployeeModel>>(this.GetEmbeddedResource("employees.json"));
      // _requests = new LisRequestDBContext(_connectionString).GetLisRequests();
      // _settings = new LisSettingDBContext(_connectionString).GetLisSettings();
      _newId = _employees.Count;
      try {
        _connection = new MySqlConnection(_connectionString);
        _connection.Open();
        using (_connection)
        {
          // MySqlCommand _cmd = new MySqlCommand(@"SET @N = 0; SELECT @N := @N +1 AS number, name_setting, value_setting FROM lis_setting", _connection);
          // MySqlCommand _cmd = new MySqlCommand(@"SET @N = 0; SELECT name_setting, value_setting FROM lis_setting UNION ALL SELECT concat((@N := @N +1), '_ed') AS name_setting, name_edition AS value_setting FROM lis_edition WHERE id_edition IN (1,3);", _connection);
          MySqlCommand _cmd = new MySqlCommand(@"SELECT name_setting, value_setting FROM lis_setting UNION ALL SELECT CONCAT(id_edition, '_ed') AS name_setting, name_edition AS value_setting FROM lis_edition;", _connection); //  WHERE id_edition IN (1,3)
          using (MySqlDataReader _reader = _cmd.ExecuteReader())
          {
            while (_reader.Read())
            {
              // product = reader.GetString("product");
              // _product = _reader.GetString("value_setting");
              if (_reader.GetString("name_setting") == "url")   _url = _reader.GetString("value_setting");   // _employees.ForEach(emp => {emp.PaginaTelevideo = _product;} );
              if (_reader.GetString("name_setting") == "email") _email = _reader.GetString("value_setting"); // _employees.ForEach(emp => {emp.IndirizzoEmail = _product;} );
              if (_reader.GetString("name_setting") == "ftp")   _ftp = _reader.GetString("value_setting");   // _employees.ForEach(emp => {emp.IndirizzoFTP = _product;} );
              if (_reader.GetString("name_setting") == "1_ed")  _1ed = _reader.GetString("value_setting");   // _employees.ForEach(emp => {emp.IndirizzoFTP = _product;} );
              if (_reader.GetString("name_setting") == "2_ed")  _2ed = _reader.GetString("value_setting");   // _employees.ForEach(emp => {emp.IndirizzoFTP = _product;} );
              if (_reader.GetString("name_setting") == "3_ed")  _3ed = _reader.GetString("value_setting");   // _employees.ForEach(emp => {emp.IndirizzoFTP = _product;} );
            }
          }
        }
        // _employees.ForEach(emp => {emp.IndirizzoEmail = _product;} );
        Console.WriteLine("EmployeeService - SELECT name_setting, value_setting FROM lis_setting OK...\n");
      } catch (MySqlException ex) {
        // Log.Info("Error in adding mysql row. Error: " + ex.Message);
        Console.WriteLine("EmployeeService - Error in MySQL. Error: " + ex.Message);
      } catch(Exception ex) {
        Console.WriteLine(ex.Message);
      }
    }

    public IList<EmployeeModel> GetAll() => _employees; // .ForEach(emp => {emp.IndirizzoEmail = _product;} ); //  .ForEach(x => { if(x.RemoveMe) someList.Remove(x); }); 
    public LisRequest GetRequest(int id) => new LisRequestDBContext(_connectionString).GetLisRequest(id); // _requests;
    public IList<LisRequest> GetRequests() => new LisRequestDBContext(_connectionString).GetLisRequests(); // _requests;
    public IList<LisRequestTrans> GetRequestsTrans(int id) => new LisRequestDBContext(_connectionString).GetLisRequestsTrans(id); // _requests;
    public IList<LisSetting> GetAllSet() => new LisSettingDBContext(_connectionString).GetLisSettings(); // _settings;
    public EmployeeModel GetById(int id) => _employees.FirstOrDefault(i => i.Id == id);
    // public EmployeeModel GetById(int id) => _employees.FirstOrDefault(i => i.Id == id);
    public int Add(EmployeeModel record)
    {
      record.Id = ++_newId;
      _employees.Add(record);
      return record.Id;
    }
    public void Update(EmployeeModel record)
    {
      // record.FirstName = "Gigiu";
      // record.PaginaTelevideo = "https://gtrhrht.cob.bu/hgrthr";
      // record.IndirizzoEmail = "teeeee@teeee.com";
      var idx = _employees.FindIndex(i => i.Id == record.Id);
      if (idx >= 0)
        _employees[idx] = record;
      new LisSettingDBContext(_connectionString).UpdateLisSettings(record.PaginaTelevideo, record.IndirizzoEmail, record.IndirizzoFTP);
    }

    public void Delete(int id) => _employees.Remove(_employees.FirstOrDefault(i => i.Id == id));

    private string GetEmbeddedResource(string resourceName)
    {
      var assembly = GetType().Assembly;
      var name = assembly.GetManifestResourceNames().Where(i => i.EndsWith(resourceName, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
      if (string.IsNullOrEmpty(name))
        throw new FileNotFoundException();

      using (var reader = new StreamReader(assembly.GetManifestResourceStream(name), Encoding.UTF8))
        return reader.ReadToEnd();

      // var fsw = new FileSystemWatcher(resourceName);
      // fsw.Changed += TheFileChanged;
    }

    private void TheFileChanged(object sender, FileSystemEventArgs e)
    {
      if (e.ChangeType == WatcherChangeTypes.Changed)
      {
        var info = new FileInfo(e.FullPath);
        var theSize = info.Length;
      }
    }
  }
    
  class FileSystemObservable
  {
    private readonly FileSystemWatcher fileSystemWatcher;
    public FileSystemObservable(string directory, string filter, bool includeSubdirectories)
    {
      fileSystemWatcher = new FileSystemWatcher(directory, filter)
      {
        EnableRaisingEvents = true,
        IncludeSubdirectories = includeSubdirectories
      };
      CreatedFiles = 
        Observable.FromEventPattern<FileSystemEventHandler, FileSystemEventArgs>(
          h => fileSystemWatcher.Created += h,
          h => fileSystemWatcher.Created -= h)
        .Select(x => x.EventArgs);

      Errors = 
        Observable.FromEventPattern<ErrorEventHandler, ErrorEventArgs>(
          h => fileSystemWatcher.Error += h,
          h => fileSystemWatcher.Error -= h)
        .Select(x => x.EventArgs);
    }
    public IObservable<FileSystemEventArgs> CreatedFiles { get; private set; }
    public IObservable<ErrorEventArgs> Errors { get; private set; }
    // In addition to this CreatedFiles and Errors need to be defined as IObservable<EventPattern<FileSystemEventArgs>> and IObservable<EventPattern<ErrorEventArgs>> – Dev Dec 2 '12 at 14:38 
    // public IObservable<EventPattern<FileSystemEventArgs>> CreatedFiles { get; private set; }      
    // public IObservable<EventPattern<ErrorEventArgs>> Errors { get; private set; }
  }

}
