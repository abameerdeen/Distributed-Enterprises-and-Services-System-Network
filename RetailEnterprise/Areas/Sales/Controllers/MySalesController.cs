﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using RetailEnterprise.Models;
using RetailEnterprise.DAL;
using Microsoft.AspNet.Identity;
using RetailEnterprise.Areas.Sales.Models;
using RetailEnterprise.Areas.Sales.Controllers;

namespace RetailEnterprise.Areas.Sales.Controllers
{

    public class MySalesController : Controller
    {
        
        private ApplicationDbContext db = new ApplicationDbContext();

        /*
         * @purpose - Show view to add a new sale to the system
         */
        [Authorize]
        public ActionResult AddNewSale(string id)
        {
            AddNewSaleViewModel model = new AddNewSaleViewModel();
            model.ProductId = db.Products;
            model.CustomerId = db.Customers;
            return View(model);
        }

        /*
         * @purpose - Show all sales and the user will be able to set the sales status to return
         */
        [Authorize]
        public ActionResult ProcessSales()
        {
            //ProcessSalesViewModel model = new ProcessSalesViewModel();
            //model.SalesId = db.Sales;
            //return View(model);
            return View();
        }

        //public ActionResult PlacedOrders()
        //{
        //    string userId = User.Identity.GetUserId();
        //    PlacedOrdersView model = new PlacedOrdersView();
        //    model.Customer = db.Customers.Find(userId);
        //    model.Sales = db.Sales.Where(r => r.CustomerId==userId);

        //    return View(model);
        //}
        //public ActionResult Create()
        //{
        //    string userId = User.Identity.GetUserId();
        //    CreateRetailOrder createRetailOrder = new CreateRetailOrder();
        //    createRetailOrder.ProductId = db.Products.Where(p => p.ApplicationUserId == userId);
        //    return View(createRetailOrder);
        //}

        //public ActionResult ViewHistory()
        //{
        //    string userId = User.Identity.GetUserId();
        //    var orders = db.Sales.Where(r => r.RetailerId==userId);
        //    var orderList = orders.ToList();
        //    ViewBag.orders = orderList;
        //    return View();
        //}

        //public ActionResult Edit()
        //{
        //    string userId = User.Identity.GetUserId();
        //    var orders = db.Sales.Where(r => r.RetailerId == userId);
        //    var orderList = orders.ToList();
        //    ViewBag.orders = orderList;
        //    ViewBag.userId = userId;
        //    return View();
        //}

        //// GET: Products
        //public ActionResult Index()
        //{
        //    return View();
        //}

        //// GET: Products/Details/5
        //public ActionResult Details(int id)
        //{
        //    return View();
        //}


        //// POST: Products/Create
        //[HttpPost]
        //public ActionResult Create(FormCollection collection)
        //{
        //    try
        //    {
        //        // TODO: Add insert logic here

        //        return RedirectToAction("Index");
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        //// GET: Products/Edit/5
        //public ActionResult Edit(int id)
        //{
        //    return View();
        //}

        //// POST: Products/Edit/5
        //[HttpPost]
        //public ActionResult Edit(int id, FormCollection collection)
        //{
        //    try
        //    {
        //        // TODO: Add update logic here

        //        return RedirectToAction("Index");
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        //// GET: Products/Delete/5
        //public ActionResult Delete(int id)
        //{
        //    return View();
        //}

        //// POST: Products/Delete/5
        //[HttpPost]
        //public ActionResult Delete(int id, FormCollection collection)
        //{
        //    try
        //    {
        //        // TODO: Add delete logic here

        //        return RedirectToAction("Index");
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}
    }
}
