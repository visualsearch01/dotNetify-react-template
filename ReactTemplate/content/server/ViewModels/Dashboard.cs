using DotNetify;
using DotNetify.Routing;
using DotNetify.Security;
using dotnetify_react_template.server.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace dotnetify_react_template
{
  [Authorize]
  public class Dashboard : BaseVM, IRoutable
  {
    private IDisposable _subscription;
    private string _connectionString; // { get; set; }
    // private MySqlConnection _connection;

    public RoutingState RoutingState { get; set; }
    
    // public string[] ServerUsageLabel => new string[] { "Nord", "Centro e Sardegna", "Sud e Sicilia", "Temperature", "Venti", "Mari", "Italia +2", "Italia +3", "exch", "demo" };
    // public string[] UtilizationLabel => new string[] { "08:30", "17:30", "18:30" };

    // public string VideoPoster => "dist/6e6432a4ede73a7d3e1459eb7ffd3fbe.jpg";
    // public string VideoSrc    => @"..\..\..\..\..\..\Videos\servizio-tg1-gates-mpg.mp4";
    // public string VideoSrc    => @"../../../../../../Videos/servizio-tg1-gates-mpg.mp4";
    // public string VideoSrc    => "servizio-tg1-gates-mpg.mp4"; // http://localhost:5000/video_gen/mp4/servizio-tg1-gates-mpg.mp4
    // public string VideoSrc    => "/video_gen/mp4/servizio-tg1-gates-mpg.mp4";
    // public string VideoSrc    => "dist/videos/output.mp4";
    
    // public int VideoProgress => 0;

    // Prova per cercare di mandare al client un oggetto invece di dover mandare tutte le proprieta' come tipi primitivi
    public class Person { public string Name { get; set; } }
    public Person User1 { get; set; } = new Person(); // new{"fdfdf"});
    
    public LisRequestTrans Reqtrans; // => new LisRequestTrans(){};
    public string TextITA;
    public string TextLIS;
    public int VersionITA;
    public int VersionLIS;

    public string Pick_date_b;
    public int Edition_b;
    public int Area_b;
    public int OffsetDay_b;

    // Prove fatte per vedere se e' possibile passare al frontend degli oggetti invece che solo tipi primitivi
    public object RequestData;
    public dynamic Color = new ExpandoObject();
    public Dictionary<string, string> Dicty; // = new Dictionary<string, string>(){};

    // La classe Activity e' una sottoclasse usata (dalla versione originale del programma dotnetify) che identifica una delle persone
    // presenti nel file JSON di mockup e la Route che viene eseguita cliccando sul nome
    public class Activity
    {
      public string PersonName { get; set; }
      public Route Route { get; set; }
      public string Status { get; set; }
    }

    // Ne e' stato creato un clone che rappresenta una versione testi ita/lis per una certa data che si vuole salvare
    // In seguito questo approccio e' stato dismesso per usare solo endpoint API
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
    /*
    public Action<Activity_text> Save => changes => {
      Console.WriteLine("Dashboard.cs - Action<Activity_text> Save..");
      Console.WriteLine("Dashboard.cs - Il testo con IdTextIta: {0} e TextIta: {1} e' stato ricevuto dal backend e sta per essere salvato su DB MySQL.\n", changes.IdTextIta, changes.TextIta);
      try {
        using (_connection = new MySqlConnection(this._connectionString)) {
          _connection.Open();
          using(MySqlCommand command = new MySqlCommand()) {
            command.Connection = _connection;
            command.Parameters.Clear();
            // string SQL = "INSERT INTO lis_text_ita (id_text_ita, id_user_edit, version, text_ita, notes) VALUES ((select MAX(id_text_ita)+1 from (select * from lis_text_ita) AS T1), ?id_user, ?version, '?text', '?notes')";
            command.CommandText = "INSERT INTO lis_text_ita (id_text_ita, id_user_edit, version, text_ita, notes) VALUES (?id_text_ita, ?id_user, ?version, ?text, ?notes);";
            // command.CommandText = SQL;
            command.Parameters.AddWithValue("?id_text_ita", changes.IdTextIta);
            command.Parameters.AddWithValue("?id_user", changes.IdUserEdit);
            command.Parameters.AddWithValue("?version", (changes.VersionIta + 1));
            command.Parameters.AddWithValue("?text", changes.TextIta); // Gia' escapato .Replace("'", "''"));
            command.Parameters.AddWithValue("?notes", changes.NotesIta); // .Replace("'", "''"));
            command.ExecuteNonQuery();
            Console.WriteLine("Dashboard.cs Save - INSERT ITA OK");
            command.Parameters.Clear();
            command.CommandText = "INSERT INTO lis_text_lis (id_text_lis, id_user_edit, version, text_lis, xml_lis, notes) VALUES (?id_text_lis, ?id_user, ?version, ?text, '<xml>test</xml>', ?notes);";
            // command.CommandText = SQL;
            command.Parameters.AddWithValue("?id_text_lis", changes.IdTextLis);
            command.Parameters.AddWithValue("?id_user", changes.IdUserEdit);
            command.Parameters.AddWithValue("?version", (changes.VersionLis + 1));
            command.Parameters.AddWithValue("?text", changes.TextLis); // .Replace("'", "''"));
            command.Parameters.AddWithValue("?notes", changes.NotesLis); //.Replace("'", "''"));
            command.ExecuteNonQuery();
            Console.WriteLine("Dashboard.cs Save - INSERT LIS OK");
          }
          _connection.Close();
        }
        / *   
        } catch (MySqlException ex) {
          // Log.Info("Error in adding mysql row. Error: " + ex.Message);
          Console.WriteLine("Dashboard.cs - Error in INSERT. Error: " + ex.Message);
        }
        * /
      } catch (MySqlException ex) {
        // Log.Info("Error in adding mysql row. Error: " + ex.Message);
        Console.WriteLine("Dashboard.cs Save - MySQL Error. Error: " + ex.Message);
      } catch(Exception ex) {
        Console.WriteLine("Dashboard.cs Save - Error: " + ex.Message);
      }
         
      / *
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
      * /
    };
    */

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

    public Dashboard(ILiveDataService liveDataService) {
      // this.Dict = new Dictionary<string,string>();
      User1.Name = "afsfsdfg"; //  = new Person("test_person");
      // _connectionString
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


      // https://github.com/dsuryd/dotNetify/blob/master/DevApp.ViewModels/Docs/Reactive.md
      // We turn the FirstName and LastName properties into ReactiveProperty objects, which means they can be subscribed on. They are dynamically added into the view model with the AddProperty method.
      // The property FullName doesn't directly receive data from the client, but it subscribes to the other reactive properties using SubscribeTo, and does further transformation with them with the APIs provided by System.Reactive.LINQ.

      ReactiveProperty<string> firstName = AddProperty("FirstName", "Hello");
      ReactiveProperty<string> lastName = AddProperty("LastName", "World");

      AddProperty<string>("FullName")
        .SubscribeTo(Observable.CombineLatest(firstName, lastName, (fn, ln) => $"{fn} {ln}"));

      // var pauser = new Rx.Subject();
      // var pauser = new Subject<bool>();
      /*
      var subscription = values.Pausable(pauser).Subscribe(v => Console.WriteLine(v));

      values.OnNext(0);
      pauser.OnNext(false);
      values.OnNext(1);
      values.OnNext(2);
      pauser.OnNext(true);
      values.OnNext(3);
      values.OnNext(4);
      values.OnNext(5);
      pauser.OnNext(false);
      values.OnNext(6);
      pauser.OnNext(true);
      values.OnNext(7);

      subscription.Dispose();

      pauser.OnNext(false);
      values.OnNext(8);
      pauser.OnNext(true);
      values.OnNext(9);
      */
      // Regulate data update interval to no less than every 200 msecs.
      _subscription = null;
      // Observable
      // .Interval(TimeSpan.FromMilliseconds(200)) // 200
      // .StartWith(0)
      // .Subscribe(_ => PushUpdates());
      // .Pausable(pauser);
      // _subscription.Unsubscribe();

      // To begin the flow
      // pauser.onNext(true); // or source.resume();

      // To pause the flow at any point
      // pauser.onNext(false);  // or source.pause();
      this.OnRouted((sender, e) =>
      {
        Console.WriteLine("Dashboard - sender: " + sender);
        Console.WriteLine("Dashboard - e: " + e);
        // Dashboard - sender: DotNetify.Routing.RoutingState
        // Dashboard - e: DotNetify.Routing.RoutedEventArgs
        var param = e?.From?.Replace($"{AppLayout.DashboardPath}/", "");
        /*
        if(g is string)
        {
            Console.WriteLine("Dashboard - e.From string OK");
            Mode = g;
            Changed(nameof(Mode));
            PushUpdates();
        } else {
        */
        if (string.Equals(param, "")){
          Console.WriteLine("Dashboard - e.From param vuoto");
          Reqtrans = new LisRequestTrans(){};
        }
        else if (int.TryParse(param, out int id))
        {
          // Dictionar = new Dictionary<string,string>();
          Console.WriteLine("Dashboard - int.TryParse OK, id: " + id);
          // RequestData = 
          LoadRequest(id);
          // dynamic colors = new ExpandoObject();
          Console.WriteLine(Color.Red);
          // Console.WriteLine("Dashboard - LoadRequest RequestData.VersionITA: " + RequestData.VersionITA);
          // Changed(nameof(RequestData));
          // if(id == 1)
          //   Mode = "dizionario";
          // if(id == 2)
          //    Mode = "traduzione";
          // Changed(nameof(Reqtrans));
          // PushUpdates();
        } else {
          Console.WriteLine("Dashboard - e.From string OK, param: " + param);
          Reqtrans = new LisRequestTrans(){};
          // Changed(nameof(Mode));
          // PushUpdates();
        }
        // }
      });
    }

    private void LoadRequest(int id) {
      // var record = 
      // _employeeService.GetById(id);
      Reqtrans = new LisRequestDBContext(_connectionString).GetLisRequestTrans(id); // GetLisRequest(id);
      TextITA = Reqtrans.TextITA; // "FirstName";
      TextLIS = Reqtrans.TextLIS; // "FirstName";
      VersionITA = Reqtrans.VersionITA;
      Color.Red = Reqtrans.VersionITA;

      // Dictionar.Add("VersionITA", Reqtrans.VersionITA.ToString());
      /*
      return new {
        TextITA = Reqtrans.TextITA,
        TextLIS = Reqtrans.TextLIS,
        VersionITA = Reqtrans.VersionITA
      };
      */
      // var colors = new { Yellow = ConsoleColor.Yellow, Red = ConsoleColor.Red };
      

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

    public override void Dispose()
    {
      _subscription?.Dispose();
      base.Dispose();
    }
  }
}
