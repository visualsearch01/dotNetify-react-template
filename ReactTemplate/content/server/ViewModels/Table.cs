using DotNetify;
using DotNetify.Routing;
using DotNetify.Security;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using dotnetify_react_template.server.Models;
namespace dotnetify_react_template
{
  [Authorize]
  public class Table : BaseVM, IRoutable
  {
    private readonly IEmployeeService _employeeService;
    private readonly int _recordsPerPage = 8;
    ILogger _logger;
    public RoutingState RoutingState { get; set; }
    private string _connectionString; // { get; set; }
    // private MySqlConnection connection;
    public string Mode = "didattica";
    public class EmployeeInfo
    {
      public int Id { get; set; }
      public string FirstName { get; set; }
      public string LastName { get; set; }
    }
    /*
    public class SettingInfo
    {
      public int Id { get; set; }
      public string FirstName { get; set; }
      public string LastName { get; set; }
      public string PaginaTelevideo { get; set; }
      public string IndirizzoFTP { get; set; }
      public string IndirizzoEmail { get; set; }
    }
    */

    // If you use CRUD methods on a list, you must set the item key prop name of that list
    // by defining a string property that starts with that list's prop name, followed by "_itemKey".
    // public string Employees_itemKey => nameof(EmployeeInfo.Id); // The nameof operator obtains the name of a variable, type, or member as the string constant

    /**
     * La classe Table e' il viewmodel della vista che carica una lista di request in formato tabellare
     * inizialmente il formato e' unico, ora lavora in due modalita': meteo e didattica
     * In base alla modalita' estrae le request solo meteo o solo didattica
     *
     */
    public Table(IEmployeeService employeeService, ILogger<Table> logger)
    {
      _employeeService = employeeService;
      _logger = logger;
      _connectionString = employeeService.getCs();
      // Changed(nameof(Employees));
      /*
      try {
        // var RouteHome = this.GetRoute(nameof(AppLayout._routes.Home)); // this.GetRoute(AppLayout._routes.TablePage_1, $"{AppLayout.TablePage_1Path}/56");
        // _logger.LogWarning("Table.cs - RouteHome:");
        // _logger.LogWarning(RouteHome);
        var Route_1 = this.GetRoute(nameof(AppLayout._routes.TablePage_1), $"{AppLayout.TablePage_1Path}/56");
        _logger.LogWarning("Table.cs - Route_1:");
        _logger.LogWarning(Route_1);
      } catch(Exception ex) {
        _logger.LogWarning("Table.cs Route Exception - " + ex.Message);
      }
      */
      Mode = "didattica";
      this.OnRouted((sender, e) =>
      {
        _logger.LogWarning("TablePage - sender: " + sender);
        _logger.LogWarning("TablePage - e: " + e);
        var param = e?.From?.Replace($"{AppLayout.TablePagePath}/", "");
        if (int.TryParse(param, out int id))
        {
            _logger.LogWarning("TablePage - int.TryParse OK, id: " + id);
            // LoadRequest(id);
        } else {
            _logger.LogWarning("TablePage - e.From string OK, param: " + param);
            Mode = param;
            Changed(nameof(Mode));
            PushUpdates();
        }
      });
    }

    // Il metodo Employees originale e' stato rinominato e il nuovo metodo con questo nome ritorna le request
    public IEnumerable<EmployeeInfo> Employees => PaginateEmployee(
      _employeeService
        .GetAll()
        .Select(i => new EmployeeInfo
        {
          Id = i.Id,
          FirstName = i.FirstName,
          LastName = i.LastName
        })
    );
      
    public IEnumerable<LisRequestTrans> Requests => PaginateRequest(
      // try {
        new LisRequestDBContext(_connectionString)
          .GetLisRequestsTrans(2)
          // _employeeService
          //     .GetLisRequestsTrans()
          // .GetAllReq()
          /*
          IdRequest = reader.GetInt32("id_request"),
          IdTranslation = reader.GetInt32("id_translation"),
          PathVideo = reader.GetString("path_video"),
          Notes = reader.GetString("notes")
          */
          .Where(i => (Mode == "didattica" ? string.Equals(i.ForecastArea, "") : !string.Equals(i.ForecastArea, "")))
          // .Where(i => (string.Equals(i.ForecastArea, Filter)))
          .Select(i => new LisRequestTrans(){
              ForecastDate = i.ForecastDate, // "2020-01-01",
              ForecastArea = i.ForecastArea, // "NORD",
              VersionITA = i.VersionITA, // IdRequest,
              TextITA = i.TextITA,
              TextLIS = i.TextLIS,
              Status = "OK",
              // PathVideo = i.PathVideo, // Video,
              LisRequest = new LisRequest(){
                IdRequest = i.LisRequest.IdRequest,
                IdTranslation = i.LisRequest.IdTranslation,
                PathVideo = i.LisRequest.PathVideo, // "", // reader.GetString("path_video"),
                Notes = i.LisRequest.Notes,
                NameRequest = i.LisRequest.NameRequest,
                TimeRequest = i.LisRequest.TimeRequest,
                IdTranslationNavigation = new LisTextTrans(){
                  IdTextTrans = i.LisRequest.IdTranslationNavigation.IdTextTrans,
                  IdTextIta = i.LisRequest.IdTranslationNavigation.IdTextIta,
                  IdTextLis = i.LisRequest.IdTranslationNavigation.IdTextLis
                }
              },
              // LisRequest.Notes = i->LisRequest.Notes,
              Route = 
              // this.GetRoute(nameof(AppLayout._routes.TablePage_1), $"{AppLayout.TablePage_1Path}/{i.LisRequest.IdRequest.ToString()}")
              // Route = new AppLayout().ggg()
              // this.Redirect
              // new Route(){"TablePage_1", AppLayout.TablePage_1Path, $"{AppLayout.TablePage_1Path}/{i.VersionITA}"}
              // Route = this.Redirect(AppLayout.FormPagePath, i.Id.ToString())
              // Route = this.Redirect("Dashboard", "Meteo")
                string.Equals(i.ForecastArea, "") ?
                  this.Redirect(AppLayout.TablePage_1Path, i.LisRequest.IdRequest.ToString()) :
                  this.Redirect(AppLayout.DashboardPath, i.LisRequest.IdRequest.ToString())
          })
      // } catch(Exception ex) {
      //  _logger.LogWarning("IEnumerable<LisRequestTrans> Requests => PaginateRequest Ex - Error: " + ex.Message);
      // }
    );

    /*
      {
        Id = i.IdRequest,
        FirstName = i.PathVideo,
        LastName = i.Notes
      }));
    */
    /*
    public Action<string> Add => fullName =>
    {
      var names = fullName.Split(new char[] { ' ' }, 2);
      var newRecord = new EmployeeModel
      {
        FirstName = names.First(),
        LastName = names.Length > 1 ? names.Last() : ""
      };

      this.AddList(nameof(Employees), new EmployeeInfo
      {
        Id = _employeeService.Add(newRecord),
        FirstName = newRecord.FirstName,
        LastName = newRecord.LastName
      });

      SelectedPage = GetPageCount(_employeeService.GetAll().Count);
    };

    public Action<EmployeeInfo> Update => changes =>
    {
      var record = _employeeService.GetById(changes.Id);
      if (record != null)
      {
        record.FirstName = changes.FirstName ?? record.FirstName;
        record.LastName = changes.LastName ?? record.LastName;
        _employeeService.Update(record);
        ShowNotification = true;
      }
    };

    public Action<int> Remove => id =>
    {
      _employeeService.Delete(id);
      this.RemoveList(nameof(Employees), id);
      ShowNotification = true;
      Changed(nameof(SelectedPage));
      Changed(nameof(Employees));
    };
    */

    // Whether to show notification that changes have been saved.
    // Once this property is accessed, it will revert itself back to false.
    private bool _showNotification;
    public bool ShowNotification
    {
      get
      {
        var value = _showNotification;
        _showNotification = false;
        return value;
      }
      set
      {
        _showNotification = value;
        Changed(nameof(ShowNotification));
      }
    }

    public int[] Pages
    {
      get => Get<int[]>();
      set
      {
        Set(value);
        SelectedPage = 1;
        // Filter = "";
      }
    }

    public int SelectedPage
    {
      get => Get<int>();
      set
      {
        Set(value);
        Changed(nameof(Requests));
      }
    }

    public string Filter
    {
      get => Get<string>();
      set
      {
        Set(value);
        // Changed(nameof(Filter));
        Changed(nameof(Requests));
      }
    }

    private IEnumerable<EmployeeInfo> PaginateEmployee(IEnumerable<EmployeeInfo> employees)
    {
      // Use base method to check whether user has changed the SelectedPage property value by clicking a pagination button.
      if (this.HasChanged(nameof(SelectedPage)))
        return employees.Skip(_recordsPerPage * (SelectedPage - 1)).Take(_recordsPerPage);
      else
      {
        // Pages = Enumerable.Range(1, GetPageCount(employees.Count())).ToArray();
        return employees.Take(_recordsPerPage);
      }
    }

    private IEnumerable<LisRequestTrans> PaginateRequest(IEnumerable<LisRequestTrans> requests)
    {
      // Use base method to check whether user has changed the SelectedPage property value by clicking a pagination button.
      _logger.LogWarning("Table.cs - Filter:" + Filter);
      if (this.HasChanged(nameof(SelectedPage)))
        return requests
          .Where(i => (String.IsNullOrEmpty(Filter) ? true : i.LisRequest.NameRequest.Contains(Filter, StringComparison.InvariantCultureIgnoreCase)))
          // .Where(i => (Filter ? string.Equals(i.ForecastArea, Filter) : true) )
          .Skip(_recordsPerPage * (SelectedPage - 1))
          .Take(_recordsPerPage);
      else
      {
        // L'unico punto che conta le pagine deve essere quello dove vengono contate sulla lista che conta, non su employees
        Pages = Enumerable.Range(1, GetPageCount(requests
        .Where(i => (String.IsNullOrEmpty(Filter) ? true : i.LisRequest.NameRequest.Contains(Filter, StringComparison.InvariantCultureIgnoreCase)))
        .Count())).ToArray();
        return requests
          .Where(i => (String.IsNullOrEmpty(Filter) ? true : i.LisRequest.NameRequest.Contains(Filter, StringComparison.InvariantCultureIgnoreCase)))
          // .Where(i => (Filter ? string.Equals(i.ForecastArea, Filter) : true) )
          .Take(_recordsPerPage);
      }
    }
    private int GetPageCount(int records) => (int)Math.Ceiling(records / (double)_recordsPerPage);
  }

  [Authorize]
  public class Table_1 : BaseVM, IRoutable
  {
    private string _connectionString; // { get; set; }
    ILogger _logger;
    private readonly IEmployeeService _employeeService;
    private LisRequestTrans Reqtrans; // => new LisRequestTrans(){};
    
    public RoutingState RoutingState { get; set; }
    public string Mode = "dizionario";

    // Gli id e le versioni dei testi vanno gestiti da backend
    // perche' quando si arriva da un video nella lista
    // bisogna ricreare i dati presenti al momento del save/request
    // e ripartire da quelli
    public int ita_id = 0;
    public int ita_edit_version = 0;

    public int lis_id = 0;
    public int lis_edit_version = 0;

    public string ita_edit;
    public string lis_edit;

    public string videoUrl;

    public string TextITA;
    public string TextLIS;
    // {this.state.TextLIS}
    public Table_1(IEmployeeService employeeService, ILogger<Table_1> logger)
    {
      Mode = "dizionario";
      _employeeService = employeeService;
      _logger = logger;
      _connectionString = employeeService.getCs();
      this.OnRouted((sender, e) =>
      {
        _logger.LogWarning("TablePage_1 - sender: " + sender);
        _logger.LogWarning("TablePage_1 - e: " + e);
        // TablePage_1 - sender: DotNetify.Routing.RoutingState
        // TablePage_1 - e: DotNetify.Routing.RoutedEventArgs
        var param = e?.From?.Replace($"{AppLayout.TablePage_1Path}/", "");
        /*
        if(g is string)
        {
            _logger.LogWarning("TablePage_1 - e.From string OK");
            Mode = g;
            Changed(nameof(Mode));
            PushUpdates();
        } else {
        */
        if (string.Equals(param, "")){
          _logger.LogWarning("TablePage_1 - e.From param vuoto");
          Reqtrans = new LisRequestTrans(){};
          ita_edit = "";
          lis_edit = "";
        }
        else if (int.TryParse(param, out int id))
        {
            _logger.LogWarning("TablePage_1 - int.TryParse OK, id: " + id);
            Mode = "traduzione";
            LoadRequest(id);

            // if(id == 1)
            //   Mode = "dizionario";
            // if(id == 2)
            //    Mode = "traduzione";
            // Changed(nameof(Reqtrans));
            // PushUpdates();
        } else {
            _logger.LogWarning("TablePage_1 - e.From string OK, param: " + param);
            Mode = param;
            Reqtrans = new LisRequestTrans(){};
            ita_edit = "";
            lis_edit = "";
            // Changed(nameof(Mode));
            // PushUpdates();
        }
        // }
      });
    }

    private void LoadRequest(int id)
    {
      // var record = 
      // _employeeService.GetById(id);
      Reqtrans = new LisRequestDBContext(_connectionString).GetLisRequestTrans(id); // GetLisRequest(id);

      TextITA = Reqtrans.TextITA; // "FirstName";
      TextLIS = Reqtrans.TextLIS; // "FirstName";                            
      ita_edit = Reqtrans.TextITA;
      lis_edit = Reqtrans.TextLIS;

      ita_id = Reqtrans.IdITA;
      ita_edit_version = Reqtrans.VersionITA;

      lis_id = Reqtrans.IdLIS;
      lis_edit_version = Reqtrans.VersionLIS;

      videoUrl = Reqtrans.LisRequest.PathVideo;

      // if (record != null)
      // {
      //   FirstName = record.PathVideo;
        // LastName = record.LastName;
        // PaginaTelevideo = record.PaginaTelevideo;
        // IndirizzoFTP = record.IndirizzoFTP;
        // IndirizzoEmail = record.IndirizzoEmail;
        // Id = record.Id;
      // }
    }
  }
}
