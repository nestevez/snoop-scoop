using System;
using System.Web;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;


namespace ApiCaller
{
    public class ApiCaller
    {
        public static async Task PolicyParsingRequest(string ConnectionString, string PolicyText)
        {
            using(var client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", ConnectionString);

                    var QueryParameters = new Dictionary();
                    var uri = "https://westus.api.cognitive.microsoft.com/linguistics/v1.0/analyze?";
                    var BodyText = new
                    {
                        language = "en",
                        analyzerIds = "08ea174b-bfdb-4e64-987e-602f85da7f72",
                        text = PolicyText
                    };
                    Json(BodyText)
                    Console.WriteLine("Body:", BodyText);
                    byte[] EncodedText = Encoding.UTF8.GetBytes(BodyText.ToString());
                    var content = new ByteArrayContent(EncodedText);
                    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                    HttpResponseMessage response = await client.PostAsync(uri, content);
                    response.EnsureSuccessStatusCode();
                     
                }
                catch (HttpRequestException exception)
                {
                    Console.WriteLine($"Request exception: {exception.Message}");
                }
            }
        }
    }
}
