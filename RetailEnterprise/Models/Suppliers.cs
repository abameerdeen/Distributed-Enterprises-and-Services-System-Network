﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace RetailEnterprise.Models
{
    [Table("Suppliers")]
    public class Supplier
    {
        [Key]
        public string SupplierId { get; set; }

        public string SupplierName { get; set; }

        public string SupplierAddress { get; set; }

        public float?  Rating { get; set; }

        public string BusinessPhoneNumber { get; set; }

        public string Status { get; set; }

        public string BRCNumber { get; set; }

        public string Category { get; set; }

        public string Currency { get; set; }

        public string Country { get; set; }

        public string Region { get; set; }

        public ICollection<Quotation> Quotations { get; set; }

    }
}