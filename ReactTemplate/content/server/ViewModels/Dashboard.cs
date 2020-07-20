using DotNetify;
using DotNetify.Routing;
using DotNetify.Security;
using dotnetify_react_template.server.Models;
using Microsoft.AspNetCore.Http;

using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Security.Claims;

namespace dotnetify_react_template
{
  [Authorize]
  public class Dashboard : BaseVM, IRoutable
  {
    private IDisposable _subscription;
    private string _connectionString; // { get; set; }
    public RoutingState RoutingState { get; set; }
    
    public class Person { public int Id { get; set; } public string Name { get; set; } }
    public Person User1 { get; set; } = new Person(); // new{"fdfdf"});

    public LisRequestTrans Reqtrans; // => new LisRequestTrans(){};
    // public string TextITA;
    // public string TextLIS;

    public string TextITA
    {
      get => Get<string>();
      set => Set(value);
    }

    public string TextLIS
    {
      get => Get<string>();
      set => Set(value);
    }
    
    public string ita_edit;
    public string lis_edit;

    public int VersionITA;
    public int VersionLIS;

    public int num1 { get; set; }

    public string Pick_date_b;

    // public DateTime Pick_date => DateTime.Now;
    // public string Pick_date_c;
    // public DateTime Pick_date;
    // public DateTime Pick_date_nn = DateTime.Now;       // returns current date and time
    // public DateTime todaysDate = DateTime.Today;          // returns today's date
    // public DateTime currentDateTimeUTC = DateTime.UtcNow; // returns current UTC date and time
    /*
    public string SelectedDate
    {
      get => Get<string>();
      set
      {
        Set(value);
        Changed(nameof(Pick_date_c));
      }
    }
    */
    // public DateTime Pick_date; //  => DateTime.Now;

    public int Edition_b = 3;
    public int Area_b = 4;
    public int OffsetDay_b = 1;

    // Prove fatte per vedere se e' possibile passare al frontend degli oggetti invece che solo tipi primitivi
    public object RequestData;
    public dynamic Color = new ExpandoObject();
    public Dictionary<string, string> Dicty; // = new Dictionary<string, string>(){};

    public class Activity
    {
      public string PersonName { get; set; }
      public Route Route { get; set; }
      public string Status { get; set; }
    }

    public class Activity_text
    {
      public int IdUserEdit { get; set; }
      public int IdTextIta { get; set; }
      public int VersionIta { get; set; }
      // public string  { get; set; }
      public string TextIta { get; set; }
      public string NotesIta { get; set; }

      public int IdTextLis { get; set; }
      public int VersionLis { get; set; }
      // public string  { get; set; }
      public string TextLis { get; set; }
      public string NotesLis { get; set; }
    }

    // Start e Stop sono due metodi che dovrebbero servire a far partire un websocket che tenga traccia della dimensione sempre crescente
    // di un file video che rappresenta l'anteprima di una sequenza segni che si sta creando
    // UPDATE il nome del file che andrebbe osservato come dimensione viene generato nell'endpoint preview, che viene chiamato DOPO aver fatto partire gli observable
    // Quindi e' forse il caso di riorganizzare il tutto
    // eventualmente facendosi passare il nome del file in qualche modo PRIMA di definire gli observable
    public Action<Activity_text> StartObserve => changes => {
      _subscription = // null;
        Observable
        .Interval(TimeSpan.FromMilliseconds(200)) // 200
        .StartWith(0)
        .Subscribe(_ => PushUpdates());
    };

    public Action<Activity_text> StopObserve => changes => {
      _subscription?.Dispose(); // = null;
    };

    public Dashboard(ILiveDataService liveDataService, IUserRepository _userRepository) {
      
      _connectionString = liveDataService.getCs();
      AddProperty<string>("Download").SubscribeTo(liveDataService.Download);
      AddProperty<string>("Upload").SubscribeTo(liveDataService.Upload);
      AddProperty<string>("Latency").SubscribeTo(liveDataService.Latency);
      AddProperty<int>("Users").SubscribeTo(liveDataService.Users);
      AddProperty<int[]>("Traffic").SubscribeTo(liveDataService.Traffic);
      AddProperty<int[]>("ServerUsage").SubscribeTo(liveDataService.ServerUsage);
      AddProperty<int[]>("Utilization").SubscribeTo(liveDataService.Utilization);

      AddProperty<Activity[]>("RecentActivities").SubscribeTo(liveDataService.RecentActivity
      .Select(value => {
        var activities = new Queue<Activity>(Get<Activity[]>("RecentActivities")?.Reverse() ?? new Activity[] { });
        activities.Enqueue(new Activity
        {
          PersonName = value.PersonName,
          Status = value.Status,
          Route = this.Redirect(AppLayout.FormPagePath, value.Id.ToString())
        });

        if (activities.Count > 4)
          activities.Dequeue();
        return activities.Reverse().ToArray();
      }));

      ReactiveProperty<string> firstName = AddProperty("FirstName", "Hello");
      ReactiveProperty<string> lastName = AddProperty("LastName", "World");

      AddProperty<string>("FullName").SubscribeTo(Observable.CombineLatest(firstName, lastName, (fn, ln) => $"{fn} {ln}"));

      _subscription = null;

      ita_edit = "";
      lis_edit = "";

      Pick_date_b = "2015-05-03";

      this.OnRouted((sender, e) =>
      {
        Console.WriteLine("Dashboard - Nameeeeee -------------------------: " + _userRepository.GetUserNetworkId());
        Console.WriteLine("Dashboard - sender: " + sender);
        Console.WriteLine("Dashboard - e: " + e);
        Console.WriteLine("Dashboard - User1.Id = " + this.User1.Id); // afsfsdfg"; //  = new Person("test_person");
        Console.WriteLine("Dashboard - User1.Name = " + this.User1.Name); // afsfsdfg"; //  = new Person("test_person");
        Console.WriteLine("Dashboard - num1 = " + this.num1); // afsfsdfg"; //  = new Person("test_person");

        Pick_date_b = "2015-05-09";
        // Pick_date = new DateTime(2015, 12, 31);
        // SelectedDate = "2015-05-03";
        /*
        var param = e?.From?.Replace($"{AppLayout.DashboardPath}/", "");
        if (string.Equals(param, "")){
          Console.WriteLine("Dashboard - e.From param vuoto");
          Reqtrans = new LisRequestTrans(){};
          ita_edit = "";
          lis_edit = "";
          // Pick_date_b = "";
        }
        else if (int.TryParse(param, out int id))
        {
          Console.WriteLine("Dashboard - int.TryParse OK, id: " + id);
          // LoadRequest(id);
          Console.WriteLine("Dashboard - Color.Red: " + Color.Red);
        } else {
          Console.WriteLine("Dashboard - e.From string OK, param: " + param);
          Reqtrans = new LisRequestTrans(){};
          ita_edit = "";
          lis_edit = "";
          // Pick_date_b = "";
        }
        Changed(nameof(Pick_date_b));
        */
      });
    }

    
    
    private void LoadRequest(int id) {
      Reqtrans = new LisRequestDBContext(_connectionString).GetLisRequestTrans(id); // GetLisRequest(id);
      TextITA = Reqtrans.TextITA; // "FirstName";
      TextLIS = Reqtrans.TextLIS; // "FirstName";
      ita_edit = Reqtrans.TextITA;
      lis_edit = Reqtrans.TextLIS;

      Pick_date_b = Reqtrans.ForecastDate;
      // Pick_date = Reqtrans.ForecastDate;
      Console.WriteLine("Dashboard LoadRequest - Pick_date_b: " + Pick_date_b);
      VersionITA = Reqtrans.VersionITA;
      Color.Red = Reqtrans.VersionITA;
    }

    public override void Dispose()
    {
      _subscription?.Dispose();
      base.Dispose();
    }
  }
}
