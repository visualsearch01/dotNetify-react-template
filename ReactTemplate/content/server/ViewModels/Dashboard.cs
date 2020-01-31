using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using DotNetify;
using DotNetify.Routing;
using DotNetify.Security;
using MySql.Data.MySqlClient;

namespace dotnetify_react_template
{
   [Authorize]
   public class Dashboard : BaseVM, IRoutable
   {
      private IDisposable _subscription;

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

      private MySqlConnection connection;
      private string cs = @"server=localhost;port=3306;database=lis2;user=root;password=root";

      public RoutingState RoutingState { get; set; }
      public string[] ServerUsageLabel => new string[] { "Nord", "Centro e Sardegna", "Sud e Sicilia", "Temperature", "Venti", "Mari", "Italia +2", "Italia +3", "exch", "demo" };
      public string[] UtilizationLabel => new string[] { "08:30", "17:30", "18:30" };

      public Action<Activity_text> Save => changes =>
      {
         Console.WriteLine("Dashboard.cs - Action<Activity_text> Save..");
         Console.WriteLine("Dashboard.cs - Il testo con IdTextIta: {0} e TextIta: {1} e' stato ricevuto dal backend e sta per essere salvato su DB MySQL.\n", changes.IdTextIta, changes.TextIta);
         try {
            connection = new MySqlConnection(cs);
            connection.Open();
            using (connection) {
               MySqlCommand command = new MySqlCommand();
               command.Connection = connection;
               command.Parameters.Clear();
               // string SQL = "INSERT INTO lis_text_ita (id_text_ita, id_user_edit, version, text_ita, notes) VALUES ((select MAX(id_text_ita)+1 from (select * from lis_text_ita) AS T1), ?id_user, ?version, '?text', '?notes')";
               string SQL = "INSERT INTO lis_text_ita (id_text_ita, id_user_edit, version, text_ita, notes) VALUES ( ?id_text_ita, ?id_user, ?version, ?text, ?notes)";
               command.CommandText = SQL;
               command.Parameters.AddWithValue("?id_text_ita", changes.IdTextIta);
               command.Parameters.AddWithValue("?id_user", changes.IdUserEdit);
               command.Parameters.AddWithValue("?version", changes.VersionIta + 1);
               command.Parameters.AddWithValue("?text", changes.TextIta); // Gia' escapato .Replace("'", "''"));
               command.Parameters.AddWithValue("?notes", changes.NotesIta); // .Replace("'", "''"));
               command.ExecuteNonQuery();
               command.Parameters.Clear();
               SQL = "INSERT INTO lis_text_lis (id_text_lis, id_user_edit, version, text_lis, xml_lis, notes) VALUES ( ?id_text_lis, ?id_user, ?version, ?text, '<xml>test</xml>', ?notes)";
               command.CommandText = SQL;
               command.Parameters.AddWithValue("?id_text_lis", changes.IdTextLis);
               command.Parameters.AddWithValue("?id_user", changes.IdUserEdit);
               command.Parameters.AddWithValue("?version", changes.VersionLis + 1);
               command.Parameters.AddWithValue("?text", changes.TextLis); // .Replace("'", "''"));
               command.Parameters.AddWithValue("?notes", changes.NotesLis); //.Replace("'", "''"));
               command.ExecuteNonQuery();
            }
            connection.Close();
         } catch (MySqlException ex) {
            // Log.Info("Error in adding mysql row. Error: " + ex.Message);
            Console.WriteLine("Dashboard.cs -  - Error in INSERT. Error: " + ex.Message);
         }
         
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

      public Dashboard(ILiveDataService liveDataService)
      {
         AddProperty<string>("Download").SubscribeTo(liveDataService.Download);
         AddProperty<string>("Upload").SubscribeTo(liveDataService.Upload);
         AddProperty<string>("Latency").SubscribeTo(liveDataService.Latency);
         AddProperty<int>("Users").SubscribeTo(liveDataService.Users);
         AddProperty<int[]>("Traffic").SubscribeTo(liveDataService.Traffic);
         AddProperty<int[]>("ServerUsage").SubscribeTo(liveDataService.ServerUsage);
         AddProperty<int[]>("Utilization").SubscribeTo(liveDataService.Utilization);

         AddProperty<Activity[]>("RecentActivities").SubscribeTo(liveDataService.RecentActivity.Select(value =>
         {
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

         // Regulate data update interval to no less than every 200 msecs.
         _subscription = Observable
            .Interval(TimeSpan.FromMilliseconds(200))
            .StartWith(0)
            .Subscribe(_ => PushUpdates());
      }

      public override void Dispose()
      {
         _subscription?.Dispose();
         base.Dispose();
      }
   }
}
