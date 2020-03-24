using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reactive;
using System.Reactive.Linq;

namespace dotnetify_react_template
{
   public interface ILiveDataService
   {
      IObservable<string> Download { get; }
      IObservable<string> Upload { get; }
      IObservable<string> Latency { get; }
      IObservable<int> Users { get; }
      IObservable<int[]> Traffic { get; }
      IObservable<int[]> ServerUsage { get; }
      IObservable<int[]> Utilization { get; }
      IObservable<Activity> RecentActivity { get; }
      string getCs();
   }

   public class Activity
   {
      public int Id { get; set; }
      public string PersonName { get; set; }
      public string Status { get; set; }
   }

   public class MockLiveDataService : ILiveDataService
   {
      private string filePath = @"C:\Users\Public\output.mp4"; // File mp4 di test per mockup player atlas
      // System.Diagnostics.Process proc = System.Diagnostics.Process.GetCurrentProcess();

      System.Diagnostics.Process p = System.Diagnostics.Process.GetCurrentProcess();
      private long ram;
      
      // PerformanceCounter PC = new PerformanceCounter();
      FileSystemWatcher fileSystemWatcher_create; // = new FileSystemWatcher(Path.GetDirectoryName(filePath), "*.*");
      FileSystemWatcher fileSystemWatcher_change; // = new FileSystemWatcher(Path.GetDirectoryName(filePath), Path.GetFileName(filePath));
      // private int memsize = 0; // memsize in Megabyte

      private readonly Random _random = new Random();
      private readonly Dictionary<int, string> _activities = new Dictionary<int, string> {
            {1, "Offline"},
            {2, "Active"},
            {3, "Busy"},
            {4, "Away"},
            {5, "In a Call"}
        };
      public IObservable<string> Download { get; }
      public IObservable<string> Upload { get; }
      public IObservable<string> Latency { get; }
      public IObservable<int> Users { get; }
      public IObservable<int[]> Traffic { get; }
      public IObservable<int[]> ServerUsage { get; }
      public IObservable<int[]> Utilization { get; }
      public IObservable<Activity> RecentActivity { get; }
      public string _connectionString { get; set; }
      
      public string getCs() { return this._connectionString; }

      public MockLiveDataService(IEmployeeService employeeService)
      {
         _connectionString = employeeService.getCs();

         fileSystemWatcher_create = new FileSystemWatcher(Path.GetDirectoryName(filePath), "*.*");
         fileSystemWatcher_change = new FileSystemWatcher(Path.GetDirectoryName(filePath), Path.GetFileName(filePath));

         if(!System.IO.File.Exists(filePath)) {
            Console.WriteLine("MockLiveDataService.cs - Il file '{0}') nella directory '{1}' non esiste ancora, touch..", Path.GetFileName(filePath), Path.GetDirectoryName(filePath));
            System.IO.File.Create(filePath);
            System.IO.File.SetLastWriteTimeUtc(filePath, DateTime.UtcNow);
         } else {
            Console.WriteLine("MockLiveDataService.cs - Il file '{0}') nella directory '{1}' esiste, Ok prosecuzione..", Path.GetFileName(filePath), Path.GetDirectoryName(filePath));
         }

         fileSystemWatcher_create.EnableRaisingEvents = true;
         fileSystemWatcher_change.EnableRaisingEvents = true;
         //***************************************************************************************//
         //*** Use the FromEventPattern operator to setup a subscription to the Created event. ***//
         //***************************************************************************************//
         IObservable<EventPattern<FileSystemEventArgs>> fswCreated = Observable.FromEventPattern<FileSystemEventArgs>(fileSystemWatcher_create, "Created");
         IObservable<EventPattern<FileSystemEventArgs>> fswChanged = Observable.FromEventPattern<FileSystemEventArgs>(fileSystemWatcher_change, "Changed");
         Console.WriteLine("MockLiveDataService.cs - MockLiveDataService(IEmployeeService employeeService)...\n");
         // Download = fswCreated
         // Download = fswChanged // fswCreated
            // .Select(pattern => $"{pattern.EventArgs.Name} - {(((FileSystemWatcher)pattern.Sender).Path)}");
            // .Select(pattern => $"{pattern.EventArgs.ChangeType} - {(((FileSystemWatcher)pattern.Sender).Path)}");
         // Download = fswCreated
         Download = fswChanged // fswCreated
            // .Select(pattern => $"{pattern.EventArgs.Name} - {(((FileSystemWatcher)pattern.Sender).Path)}");
            .Select(pattern => $"{pattern.EventArgs.ChangeType} - {new FileInfo(filePath).Length} - {   (((FileSystemWatcher)pattern.Sender).Filter)   }");
         
         Upload = fswCreated
         // Download = fswChanged // fswCreated
            // .Select(pattern => $"{pattern.EventArgs.Name} - {(((FileSystemWatcher)pattern.Sender).Path)}")
            .Select(pattern => $"{pattern.EventArgs.ChangeType} - {  (((FileSystemWatcher)pattern.Sender).Filter) }");
         /*
         Download = Observable
            .Interval(TimeSpan.FromMilliseconds(900))
            .StartWith(0)
            .Select(_ => $"{Math.Round(_random.Next(15, 30) + _random.NextDouble(), 1)} Mb/s");
         
         Upload = Observable
            .Interval(TimeSpan.FromMilliseconds(800))
            .StartWith(0)
            .Select(_ => $"{Math.Round(_random.Next(5, 7) + _random.NextDouble(), 1)} Mb/s");
         */

         // PC.CategoryName = "Process";
         // PC.CounterName = "Working Set - Private";
         // PC.InstanceName = proc.ProcessName;
         // memsize = Convert.ToInt32(PC.NextValue()) / (int)(1024);
         // Console.WriteLine($"MEMSIZE: {memsize/1024/1024} MB");
         // PC.Close();
         // PC.Dispose();
/*
         foreach (Process pr in Process.GetProcesses())
         {
            try
            {
                  Console.WriteLine("App Name: {0}, Process Name: {1}", Path.GetFileName(pr.MainModule.FileName), pr.ProcessName);
            }
            catch { }
         }
*/
         // To get FFPLAY.EXE processes
         var processes = Process.GetProcessesByName("ffplay");
         foreach (var process in processes)
         {
            Console.WriteLine("ffplay PID={0}", process.Id);
            Console.WriteLine("ffplay Process Handle={0}", process.Handle);
            Console.WriteLine("ffplay ram={0}", process.WorkingSet64);
         }

         ram = p.WorkingSet64;
         Console.WriteLine($"RAM di questo processo: {ram/1024/1024} MB");

         Latency = Observable
            .Interval(TimeSpan.FromSeconds(1))
            .StartWith(0)

            .Select(_ => $"{ram/1024/1024} MB");

            // .Select(_ => $"{_random.Next(50, 200)} ms");

         Users = Observable
            .Interval(TimeSpan.FromMilliseconds(1200))
            .StartWith(0)
            .Select(_ => _random.Next(200, 300));

         Traffic = Observable
            .Interval(TimeSpan.FromMilliseconds(600))
            .StartWith(0)
            .Select(_ => Enumerable.Range(1, 7).Select(i => _random.Next(1000, 10000)).ToArray());

         ServerUsage = Observable
            .Interval(TimeSpan.FromMilliseconds(400))
            .StartWith(0)
            .Select(_ => Enumerable.Range(1, 10).Select(i => _random.Next(1, 100)).ToArray());

         Utilization = Observable
            .Interval(TimeSpan.FromMilliseconds(800))
            .StartWith(0)
            .Select(_ => Enumerable.Range(1, 3).Select(i => _random.Next(1, 100)).ToArray());

         RecentActivity = Observable
            .Interval(TimeSpan.FromSeconds(2))
            .StartWith(0)
            .Select(_ => GetRandomEmployee(employeeService))
            .Select(employee => new Activity
            {
               Id = employee.Id,
               PersonName = employee.FullName,
               Status = _activities[_random.Next(1, 6)]
            })
            .StartWith(
               Enumerable.Range(1, 4)
               .Select(_ => GetRandomEmployee(employeeService))
               .Select(employee => new Activity
               {
                  Id = employee.Id,
                  PersonName = employee.FullName,
                  Status = _activities[_random.Next(1, 6)],
               })
               .ToArray()
            );
      }
      
      private EmployeeModel GetRandomEmployee(IEmployeeService employeeService) 
      {
         EmployeeModel record;
         while ((record = employeeService.GetById(_random.Next(1, 20))) == null );
         return record;
      }
   }
}
