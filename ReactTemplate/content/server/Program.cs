using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace dotnetify_react_template
{
   public class Program
   {


   public class Parameter
   {
      public string ParameterName { get; set; }
   }
   public static void Main(string[] args)
   {
      String name = "Morten";
      Int32 age = 30;
      String city = "Copenhagen";
      String country = "Denmark";
      XElement xml = new XElement("Method", 
            new XAttribute("ID", 1), 
            new XAttribute("Cmd", "New"),
            new XElement("Field", 
               new XAttribute("Name", "Name"), 
               name),
            new XElement("Field", 
               new XAttribute("Name", "Age"), 
               age),
            new XElement("Field", 
               new XAttribute("Name", "City"), 
               city),
            new XElement("Field", 
               new XAttribute("Name", "Country"), 
               country)
      );
      Console.WriteLine("Program.cs - xml:");
      Console.WriteLine(xml);

      XDocument encodedDoc8 = new XDocument(  
         new XDeclaration("1.0", "utf-8", "yes"),  
            new XElement("ALEAOutput",
               new XElement("newSentence",
                  new XAttribute("italianText", "dsdsd"), 
                  new XAttribute("lemmaNumber", "11"),
                  new XAttribute("text", "ergergergerge"),
                  new XAttribute("writtenLISSentence", "dsffwefwefwfwefwefw"),
                  new XElement("newLemma", 
                     new XAttribute("endTime", ""), 
                     new XAttribute("idAtlasSign", "0001"),
                     new XAttribute("lemma", "pinnffff"),
                     new XAttribute("startTime", "")
            ))));
      Console.WriteLine("Program.cs - xml1:");
      // Console.WriteLine(encodedDoc8);
      var sw = new StringWriter();
      encodedDoc8.Save(sw);
      string result = sw.GetStringBuilder().ToString();
      Console.WriteLine(result);



      var Parameters = new List<Parameter>
      {
         new Parameter { ParameterName = "co" },
         new Parameter { ParameterName = "o2" },
         new Parameter { ParameterName = "foo" },
         new Parameter { ParameterName = "bar" },
      };

      var CurrentData = 2;

      // Allocate the XDocument and add an XML declaration.  
      XDocument RejectedXmlList = new XDocument(new XDeclaration("1.0", "utf-8", null));

      // At this point RejectedXmlList.Root is still null, so add a unique root element.
      XElement roo = new XElement("ALEAOutput");

      XElement sent = new XElement("newSentence",
                  new XAttribute("italianText", "dsdsd"), 
                  new XAttribute("lemmaNumber", "11"),
                  new XAttribute("text", "ergergergerge"),
                  new XAttribute("writtenLISSentence", "dsffwefwefwfwefwefw"));

      // RejectedXmlList.Add(roo);

      // Add elements for each Parameter to the root element
      foreach (Parameter Myparameter in Parameters)
      {
            if (true)
            {
               XElement xelement = new XElement(Myparameter.ParameterName, CurrentData.ToString());
               // RejectedXmlList.Root.Add(xelement);

               sent.Add(new XElement("newLemma", 
                     new XAttribute("endTime", CurrentData.ToString()), 
                     new XAttribute("idAtlasSign", CurrentData.ToString()),
                     new XAttribute("lemma", CurrentData.ToString()),
                     new XAttribute("startTime", CurrentData.ToString()) ));

            }
      }
      roo.Add(sent);
      RejectedXmlList.Add(roo);
      Console.WriteLine("Program.cs - xml2:");

      // Console.WriteLine(RejectedXmlList);


      var sw1 = new StringWriter();
      RejectedXmlList.Save(sw1);
      string result1 = sw1.GetStringBuilder().ToString();
      Console.WriteLine(result1);



      /*
      XDocument encodedDoc8_1 = new XDocument(  
         new XDeclaration("1.0", "utf-8", "yes"));
      Console.WriteLine("Program.cs - xml:");
      Console.WriteLine(encodedDoc8_1);
      */
      /*
      Program.cs - xml: <Method ID="1" Cmd="New">
      <Field Name="Name">Morten</Field>
      <Field Name="Age">30</Field>
      <Field Name="City">Copenhagen</Field>
      <Field Name="Country">Denmark</Field>
      </Method>
      */
      BuildWebHost(args).Run();
   }

   public static IWebHost BuildWebHost(string[] args) =>
         WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>()
            .UseUrls("http://0.0.0.0:5000") // Url raggiungibile anche dall'esterno
            .Build();
   }
}
