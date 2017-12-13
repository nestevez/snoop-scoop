using System;
using System.Web;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using System.IO;


namespace ApiCaller
{
    public class ApiCaller
    {
        public static async void MakeRequest(string ConnectionString, string PolicyText)
        {
            var client = new HttpClient();
            var queryString = HttpUtility.ParseQueryString(string.Empty);

            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", ConnectionString);

            var uri = "https://westus.api.cognitive.microsoft.com/linguistics/v1.0/analyze?" + queryString;
            HttpResponseMessage response;

            string MessageBody =
                "{'language': 'en', 'analyzerIds': ['08ea174b-bfdb-4e64-987e-602f85da7f72'],'text':'this is a test string'}";

            var PolicyJson = JsonConvert.SerializeObject(MessageBody);

            byte[] byteData = Encoding.UTF8.GetBytes(MessageBody);

            using (HttpContent content = new ByteArrayContent(byteData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                response = await client.PostAsync(uri, content);
                string StringResponse = await response.Content.ReadAsStringAsync();
                List<Dictionary<string, object>> JsonResponse = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(StringResponse);
                var parsedResponse = new Dictionary<string, object>();
                // TODO: add a return value, change type signature away from void.
            }
        }
    }
}