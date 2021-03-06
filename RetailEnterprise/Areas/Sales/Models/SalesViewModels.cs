﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RetailEnterprise.Models;
namespace RetailEnterprise.Areas.Sales.Models
{
    public class AddNewSaleViewModel
    {
        public IEnumerable<Product> ProductId { get; set; }

        public IEnumerable<Customer> CustomerId { get; set; }
    }
    public class ProcessSalesViewModel 
    {
        
        public IEnumerable<Sale> SalesId { get; set; }
    }
    
    public class CreateRetailOrder
    {
        public Account Retailer { get; set; }

        public Customer Customer { get; set; }

        public IEnumerable<Product> ProductId { get; set; }
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
    public class PlacedOrdersView
    {
        public IEnumerable<Sale> Sales { get; set; }

        public Customer Customer{ get; set; }
    }
}