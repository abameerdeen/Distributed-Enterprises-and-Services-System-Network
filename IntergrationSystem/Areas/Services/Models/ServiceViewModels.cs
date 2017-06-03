﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using IntegrationSystem.Models;

namespace IntegrationSystem.Areas.Services.Models
{
    public class AddServiceViewModel
    {
        public string Type { get; set; }

        public string Uri { get; set; }
    }

    public class AddServiceToAccountViewModel
    {
       public IEnumerable<Service> ServiceId{ get; set; }
    }
}