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
using Newtonsoft.Json.Linq;
using System.IO;


namespace ApiCaller
{
    public class TextAnalysis
    {
        public static async Task<IList<TextToken>> MakeRequest(string ConnectionString, string PolicyText)
        {
            var client = new HttpClient();
            var queryString = HttpUtility.ParseQueryString(string.Empty);

            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", ConnectionString);

            var uri = "https://westus.api.cognitive.microsoft.com/linguistics/v1.0/analyze?" + queryString;
            HttpResponseMessage response;

            string MessageBody =
                "{'language': 'en', 'analyzerIds': ['08ea174b-bfdb-4e64-987e-602f85da7f72'],'text':'This is a test string. Other things go here.'}";

            var PolicyJson = JsonConvert.SerializeObject(MessageBody);

            byte[] byteData = Encoding.UTF8.GetBytes(MessageBody);

            using (HttpContent content = new ByteArrayContent(byteData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                response = await client.PostAsync(uri, content);
                string StringResponse = await response.Content.ReadAsStringAsync();
                JToken RawResponse = JArray.Parse(StringResponse)[0]["result"][0]["Tokens"];
                IList<TextToken> Results = new List<TextToken>();
                foreach (JToken token in RawResponse)
                {
                    TextToken nextToken = token.ToObject<TextToken>();
                    Results.Add(nextToken);
                }
                return Results;
            }
        }
    }
    public class TextToken
    {
        public int Len { get; set; }
        public string NormalizedToken { get; set; }
        public int Offset { get; set; }
        public string RawToken { get; set; }
    }
}