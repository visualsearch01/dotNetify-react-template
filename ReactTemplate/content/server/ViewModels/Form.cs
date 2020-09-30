using DotNetify;
using DotNetify.Routing;
using DotNetify.Security;
using Microsoft.Extensions.Logging;
using dotnetify_react_template.server.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace dotnetify_react_template
{
  [Authorize]
  public class Form : BaseVM, IRoutable
  {
    private readonly IEmployeeService _employeeService;
    public RoutingState RoutingState { get; set; }
    ILogger _logger;
    private string _connectionString; // { get; set; }
    public class EmployeeInfo
    {
      public int Id { get; set; }
      public string Name { get; set; }
      public Route Route { get; set; }
    };
    
    public class SavedEmployeeInfo
    {
      public int Id { get; set; }
      public string FirstName { get; set; }
      public string LastName { get; set; }
      public string PaginaTelevideo { get; set; }
      public string IndirizzoFTP { get; set; }
      public string IndirizzoEmail { get; set; }
    };

    public IEnumerable<LisSetting> Settings => 
      new LisSettingDBContext(_connectionString)
        .GetLisSettings()
        .Select(i => new LisSetting(){
          IdSetting = i.IdSetting,
          NameSetting = i.NameSetting,
          ValueSetting = i.ValueSetting,
          Notes = i.Notes
        });

    public IEnumerable<EmployeeInfo> Employees =>
      _employeeService
        .GetAll()                        // Usa idrettamente la lista di employees e non la lista di settings - 
        .OrderBy(i => i.LastName)
        .Select(i => new EmployeeInfo
        {
          Id = i.Id,
          Name = i.FullName,
          Route = this.Redirect(AppLayout.FormPagePath, i.Id.ToString())
        });
    
    
    public int Id
    {
      get => Get<int>();
      set => Set(value);
    }
    public string FirstName
    {
      get => Get<string>();
      set => Set(value);
    }
    public string LastName
    {
      get => Get<string>();
      set => Set(value);
    }
    public string PaginaTelevideo
    {
      get => Get<string>();
      set => Set(value);
    }
    public string IndirizzoFTP
    {
      get => Get<string>();
      set => Set(value);
    }
    public string IndirizzoEmail
    {
      get => Get<string>();
      set => Set(value);
    }
    public string Edition1
    {
      get => Get<string>();
      set => Set(value);
    }
    public string Edition2
    {
      get => Get<string>();
      set => Set(value);
    }
    public string Edition3
    {
      get => Get<string>();
      set => Set(value);
    }
    public Action<int> Cancel => id => LoadEmployee(id);
    public Action<SavedEmployeeInfo> Save => changes =>
    {
      _logger.LogWarning("Form.cs - Save changes:");
      _logger.LogWarning(changes.PaginaTelevideo);
      _logger.LogWarning(changes.IndirizzoEmail);
      _logger.LogWarning(changes.IndirizzoFTP);
      new LisSettingDBContext(_connectionString).UpdateLisSettings(changes.PaginaTelevideo, changes.IndirizzoEmail, changes.IndirizzoFTP);
      /*
      var record = _employeeService.GetById(changes.Id);
      if (record != null)
      {
        record.FirstName = changes.FirstName;
        record.LastName = changes.LastName;
        record.PaginaTelevideo = changes.PaginaTelevideo;
        record.IndirizzoFTP = changes.IndirizzoFTP;
        record.IndirizzoEmail = changes.IndirizzoEmail;
        _employeeService.Update(record);
        Changed(nameof(Employees));
      }
      */
    };
    public Form(IEmployeeService employeeService, ILogger<Form> logger)
    {
      _employeeService = employeeService;
      _logger = logger;
      _connectionString = employeeService.getCs();

      // PaginaTelevideo = _employeeService.getUrl(); // "fffff";
      FirstName = _employeeService.get1ed();
      LastName = _employeeService.get3ed();
      
      PaginaTelevideo = _employeeService.getUrl();
      IndirizzoFTP = _employeeService.getFtp();
      IndirizzoEmail = _employeeService.getEmail();

      Edition1 = _employeeService.get1ed();
      Edition2 = _employeeService.get2ed();
      Edition3 = _employeeService.get3ed();

      // La pagina Form carica direttamente i dati senza dover fare una chiamata API
      // perche' durante l'OnRouted del costruttore carica direttamente i dati dell'Employee 1
      this.OnRouted((sender, e) =>
      {
        Console.WriteLine("Form.cs - Costruttore - sender: " + sender);
        Console.WriteLine("Form.cs - Costruttore - e: " + e);
        Changed(nameof(Settings));
        if (int.TryParse(e?.From?.Replace($"{AppLayout.FormPagePath}/", ""), out int id))
          LoadEmployee(id);
      });
    }
    private void LoadEmployee(int id)
    {
      var record = _employeeService.GetById(id);
      if (record != null)
      {
        FirstName = record.FirstName;
        LastName = record.LastName;
        PaginaTelevideo = record.PaginaTelevideo;
        IndirizzoFTP = record.IndirizzoFTP;
        IndirizzoEmail = record.IndirizzoEmail;
        Id = record.Id;
      }
    }
  }
}
