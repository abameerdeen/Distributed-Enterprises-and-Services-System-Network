﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RetailEnterprise.Models;
namespace RetailEnterprise.Areas.Quotations.Models
{
    //public class SentQuotationsViewModel
    //{
    //   public Wholesaler Wholesaler { get; set; }

    //   public IEnumerable<Quotation> SentQuotations {get ; set;}
    //}

    public class RecievedQuotationsViewModel
    {
        public Account Retailer { get; set; }

        public IEnumerable<Quotation> RecievedQuotations { get; set; }
    }

    //public class SendQuotationsViewModel
    //{
    //    public Quotation Quotation { get; set; }
    //}

    public class RequestedQuotationsViewModel
    {
    }
    //public class RequestQuotationViewModel 
    //{
    //    public Wholesaler Wholesaler { get; set; }

    //    public Account Account { get; set; }
    //}

}