﻿using System;
using System.Net.Http.Headers;
using System.Text;
using System.Net.Http;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ApiCaller;
using snoop_scoop;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace snoop_scoop.Controllers
{
    [Route("api/[controller]")]
    public class AnalyzeController : Controller
    {
        // GET: api/analyze
        [HttpGet]
        public IEnumerable<string> Get()
        {
            Console.WriteLine("stuff");
            string ConnectionString = Startup.Configuration["ConnectionString"];
            List<TextToken> ParsedTokens = (List<TextToken>)TextAnalysis.MakeRequest(ConnectionString, "this is some test text").Result;
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
            Console.WriteLine(value);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}