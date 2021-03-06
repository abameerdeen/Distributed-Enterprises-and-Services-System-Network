﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RetailEnterprise.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RetailEnterprise.Areas.PurchaseOrders.Models
{
    public class CreatePurchaseOrderView
    {
        public IEnumerable<Product> ProductId { get; set; }

        public IEnumerable<Supplier> SupplierId { get; set; }
    }
    public class ViewAllMyRecievedOrders
    {
        public IEnumerable<Order> Orders { get; set; }
    }

    public class OrderView
    {
        public int OrderId { get; set; }
        public string CustomerId { get; set; }
    }

    public class AddPurchaseOrderViewModel
    {
        [Display(Name="Choose Product")]
        public IEnumerable<Product> ProductId;
    }

    [NotMapped]
    public class ProductsInPurchaseOrderView : ProductInPurchaseOrder
    {
        public string   ProductName { get; set; }
    }

}