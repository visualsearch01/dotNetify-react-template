using DotNetify;
using DotNetify.Routing;
using DotNetify.Security;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using dotnetify_react_template.server.Models;
namespace dotnetify_react_template
{
   [Authorize]
   public class Table : BaseVM
   {
      private readonly IEmployeeService _employeeService;
      private readonly int _recordsPerPage = 8;
      private string _connectionString; // { get; set; }
      // private MySqlConnection connection;

      public class EmployeeInfo
      {
         public int Id { get; set; }
         public string FirstName { get; set; }
         public string LastName { get; set; }
      }

      public class Info
      {
         public int Id { get; set; }
         public string FirstName { get; set; }
         public string LastName { get; set; }
         public string PaginaTelevideo { get; set; }
         public string IndirizzoFTP { get; set; }
         public string IndirizzoEmail { get; set; }
      }

      // If you use CRUD methods on a list, you must set the item key prop name of that list
      // by defining a string property that starts with that list's prop name, followed by "_itemKey".
      public string Employees_itemKey => nameof(EmployeeInfo.Id); // The nameof operator obtains the name of a variable, type, or member as the string constant

      public Table(IEmployeeService employeeService)
      {
         _employeeService = employeeService;
         _connectionString = employeeService.getCs();
         // Changed(nameof(Employees));
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
              }));
      
      public IEnumerable<RequestInfo> Requests => PaginateRequest(
          new LisRequestDBContext(_connectionString).GetLisRequestInfo()
          // _employeeService
          //     .GetRequestInfo()
              // .GetAllReq()
              .Select(i => new RequestInfo
               {
                  Date = i.Date, // "2020-01-01",
                  Area = "NORD",
                  Version = i.Version, // IdRequest,
                  Path = i.Path, // Video,
                  Notes = i.Notes,
                  Status = "OK"
              }));
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

      private IEnumerable<RequestInfo> PaginateRequest(IEnumerable<RequestInfo> requests)
      {
         // Use base method to check whether user has changed the SelectedPage property value by clicking a pagination button.
         if (this.HasChanged(nameof(SelectedPage)))
            return requests.Skip(_recordsPerPage * (SelectedPage - 1)).Take(_recordsPerPage);
         else
         {
            // L'unico punto che conta le pagine deve essere quello dove vengono contate sulla lista che conta, non su employees
            Pages = Enumerable.Range(1, GetPageCount(requests.Count())).ToArray();
            return requests.Take(_recordsPerPage);
         }
      }

      private int GetPageCount(int records) => (int)Math.Ceiling(records / (double)_recordsPerPage);
   }

   [Authorize]
   public class Table_1 : BaseVM, IRoutable
   {
      private readonly IEmployeeService _employeeService;
      public RoutingState RoutingState { get; set; }
      public Table_1(IEmployeeService employeeService)
      {
         _employeeService = employeeService;
         this.OnRouted((sender, e) =>
         {
            Console.WriteLine("TablePage_1 - sender: " + sender);
            Console.WriteLine("TablePage_1 - e: " + e);
         });
      }
   }
}
