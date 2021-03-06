//var viewControllerRoute; // this will be used to keep track of what content must be there in the .content-wrapper
//var tables = [];
//var selectedValueIn = {}; // in case if there is a value index selected in a table.
//var afterSelection = function () { console.log("unimplemented afterselection function"); };
//var afterSubmit = function () { console.log("unimplemented afterSubmit function"); };


// TABLE PROCESSING FUNCTIONS
/*
@purpose - initiating a selectable data table
@user - any
@parameters 
- tableSelector - id attribute of the target table
- parameters    - parameters that need to be sent to the DataTable function
- onSelection, onUnselection - funcitons that need to be called when a row has been selected or unselected.
*/
function initiateTable1(tableSelector, parameters, onSelection, onUnSelection) {

    var table = $("#" + tableSelector).DataTable(parameters);

    $("#" + tableSelector).on('click', 'tr', function () {

        // unselect all the siblings
        $(this).siblings().each( 
            function () {
                $(this).removeClass("selected")
            }
            );
        $(this).toggleClass("selected");

        if ($(this).hasClass("selected")) {
            onSelection();
        } else {
            onUnSelection();
        }
        return false;
    });

    return table;
}

/*
The older version of the above function, use is not recomended
@parameters 
- parameters - that needs to be sent into the DataTable() function. Must be a raw object.
*/
function initiateTable(tableSelector, parameters) {

    // initiating the data table
    var table = $("#" + tableSelector).DataTable(parameters);

    // making the table selectable
    $("#" + tableSelector).on('click', 'tr', function () {


        $(this).siblings().each( // and all the siblings unselected
            function () {
                $(this).removeClass("selected")
                console.log("row unselected:");
            }
            );
        console.log("row selected:");
        $(this).toggleClass("selected");

    }
    );

    return table;
}

/*
@purpose - updating a table from a json object recieved from the API
@parameters 
table - the DataTable object
- apiUrl - URL of the API
*/
function updateTable(table, apiUrl) {
    table.clear();

    // undefined legth property error appear if used datatable ajax functionality
    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: "json"
    }
        ).done(function (dataSet) {
            // iniitiation of table
            table.rows.add(dataSet).draw();
        });
    table.on('click', 'tr', function () {

        $(this).siblings().each( // and all the siblings unselected
            function () {
                $(this).removeClass("selected")
            }
            );
        $(this).toggleClass("selected");
    });
}

/*
- afterSelection - since there will be different rows after updating we need to redo the event binding.
                    there won't be a need for this if we initiate the table as it binds the event to the <tbody> instead of <tr>
*/
function updateTableFromApi(table, apiUrl, afterSelection) {
    table.clear();

    // undefined legth property error appear if used datatable ajax functionality
    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: "json"
    }
        ).done(function (dataSet) {
            // iniitiation of table
            table.rows.add(dataSet).draw();
        });
    //var eventListenerSelection = function () {

    //    var selectedIndex = $(this).index(); // this index must be selected 

    //    $(this).siblings().each( // and all the siblings unselected
    //        function () {
    //            $(this).removeClass("selected")
    //        }
    //        );
    //    $(this).toggleClass("selected");
    //    afterSelection();
    //}
    //table.off('click', 'tr', eventListenerSelection);
    //table.on('click', 'tr', eventListenerSelection);
}

/*
Another version of above function version of above function.
*/
function updateTableFromApi1(table, apiUrl, afterSelection, afterUnselection) {
    table.clear();

    // undefined legth property error appear if used datatable ajax functionality
    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: "json"
    }
        ).done(function (dataSet) {
            // iniitiation of table
            table.rows.add(dataSet).draw();
        });
    table.on('click', 'tr', function () {

        var selectedIndex = $(this).index(); // this index must be selected 

        $(this).siblings().each( // and all the siblings unselected
            function () {
                $(this).removeClass("selected")
            }
            );
        $(this).toggleClass("selected");
        if ($(this).hasClass("selected")) {
  //          afterSelection();
        } else {
//            afterUnselection();
        }
    });
}

/*
Another version of above function version of above function.
*/
function loadTableFromApi(tableId, apiUrl, columns) {

    $(document).ready(function () {
        $.ajax({
            url: apiUrl,
            type: "GET",
            dataType: "json"
        }
        ).done(function (dataSet) {
            var tableIndex = tableId.replace('#', '');

            // iniitiation of table
            tables[tableIndex] = $(tableId).DataTable({
                data: dataSet,
                "columns": columns
            });

            var tbody = tableId + " tbody";
            $(tbody).on('click', 'tr', function () {
                // unselect all the selected columns of the table

                var selectedIndex = $(this).index();

                $(this).siblings().each(
                    function () {
                        $(this).removeClass("selected")
                    }
                    );
                $(this).toggleClass("selected");

                var data = tables[tableIndex].row(selectedIndex).data();

                selectedValueIn[tableIndex] = data.VendorId;

                afterSelection();
            });
        });
    });
}

/*
@purpose - initiating a data table which takes inputs from a form and updates a form on selection
@parameters- 
-tableSelector  - table selector of the DataTable
-parameters     - parameters that needs to be sent into the DataTable function
-formSelector   - id of the form that is in sync with the table
@return - the DT object
*/
function initiateSynchronousTable(tableSelector, parameters, formSelector) {

    // Initiating the DT
    var table = $("#" + tableSelector).DataTable(parameters);

    // making the DT selectable
    $("#" + tableSelector).on('click', 'tr', function () {

        $(this).siblings().each( // and all the siblings unselected
            function () {
                $(this).removeClass("selected")
            }
            );
        $(this).toggleClass("selected");
        if ($(this).hasClass("selected")) {
            // get selected row data
            var data = table.row($(this).index()).data();
            // update the form
            setFormValues($(formSelector));
        } else {
            // reset the form
            resetForm($(formSelector));
        }

    });
    return table;
}
/*
@purpose - get the selected data records primary key
@assumptions - first column of the table contains the key , .selected class is used
@parameteres - 
-table - the JQuery object of the table
@returns - the selected row key value
*/
function getTableSelectedRowKey(table) {
    var selectedKey;
    table.children("tbody").children(".selected").each(function () {
        selectedKey = $(this).children().first().html();
    });
    return selectedKey;
}

/*
@purpose - get the selected row's index value
@assumptions - .selected class is used
@paramters -
-table - JQuery object of the table
@returns - index of the selected column of the table
*/
function getTableSelectedRowIndex(table) {
    var selectedIndex;
    table.children("tbody").children(".selected").each(function () {
        selectedIndex = $(this).index();

    });
    return selectedIndex;
}

/*
@purpose - get table row data into an object
@parameters -
-table  -DT object
@return
-- each row in an internal object
    [   
        {columnData1, columnData2},
        {columnData1, columnData2}
    ]
*/
function getTableData(table) {
    var tableData = table.rows().data();
    var rowData = {};

    var i = 0;// current iteration index
    for (var row in tableData) {
        // rowdata has unwanted objects, we are skipping them using length attribute limit
        if (i < tableData.length) {
            rowData[i] = tableData[i];
        } else {
            break;
        }
        i++;
    }
    return rowData;
}

/*
@purpose - Initiate buttons to processe data loaded into a DT
This function needs to be modified
*/
function initiateTableActionButtons() {
    $("#action-buttons").css("pointer-events", "none");
    $("#action-buttons").children().each(function () {
        $(this).on('click', function () { // editor-forms
            // hiding all the forms
            $("#editor-forms").children().each(function () {
                $(this).addClass("hidden");
            });

            // resetting the colors of buttons to btn-primary
            $("#action-buttons").children().each(function () {
                $(this).removeClass("btn-warning").addClass("btn-primary");
            });

            // setting the selected button color to btn-warning
            $(this).addClass("btn-warning");

            var form = $(this).attr("for");
            $("#" + form).removeClass("hidden");

        });
    });
}

//FORM PROCESSING FUNCITONS
/*
@purpose - get values of the form in a jason object.
@assumptions - each form field has a name attribute which is taken as the name of the object data. HTML5 validation is in place.
@parameters 
- formId - "id" attribute of the form
@returns - an object containing name-value pairs of each <input> an <select> elements
*/
function getFormValues(formId) {
    var formSelector = "#" + formId + " .form-control";
    var nameAndValues = {};
    $("#" + formId + " select option:selected").each(function () {
        nameAndValues[$(this).parent().attr("id")] = $(this).html();
    });

    $(formSelector).each(function () {
        nameAndValues[$(this).attr("name")] = $(this).val();
    });
    return nameAndValues;
}

/*
A version of the above function
@parameters
-form  - a jquery object of the form
*/
function getFormData(form) {
    var data = {};
    form.children("input").each(function (item) {
        data[$(this).attr("name")] = $(this).val();
        $(this).val("");
    });

    form.children("option:selected").each(function () {
        data[$(this).parent().attr("id")] = $(this).attr("val");
    });
    return data;
}

/*
@purpose - set form values using an array of data.
@parameters
-form   - a jquery object of the form
-data   - a javascript object which contains name value pairs. each name is related to a form field's name attribute and will 
be updated accordingly.
*/
function setFormValues(form, data) {
    $(form.selector + " input").each(function () {

        $(this).val(data[$(this).attr("name")]);
    }
    );
}

/*
@purpose    - resetting a form's values to empty strings
@assumtions - fields won't throw incompatible errors.
@parameters 
-form   - a jquery form object
*/
function resetForm(form) {
    $(form.selector + " input").each(function () {
        $(this).val("");
    }
       );
}

/*
@purpose - to update a list box. for each call of this function, new elements will be appended to the list box.
@parameters - 
-apiUrl             -URL of the API
-listBoxSelector    -Selector of the Listbox.
-ValueId            -what is the name of the value we should use to update the list box
*/
function loadListBoxFromArray(apiUrl, listBoxSelector, ValueId) {
    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: "json"
    }
        ).done(function (listItems) {
            $.each(listItems, function (item) {
                $(listBoxSelector).append('<option value="' + this[ValueId] + '">' + this + '</option>');
            });
        });
}

/*
@purpose - loading a list box from an api.
use is not recomended where performance is a key. Because this will need additional overhead of processing from the server and client side.
*/
function loadListBox(apiUrl, listBoxSelector, Value, OptionText) {
    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: "json"
    }
        ).done(function (vendors) {
            $.each(vendors, function (item) {
                $(listBoxSelector).append('<option value="' + this[Value] + '">' + this[OptionText] + '</option>');
            });
        }
            );
}

/*
Another version of the above function
*/
function loadListBoxFromApi(apiUrl, listBoxSelector, Id, OptionText) {
    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: "json"
    }
        ).done(function (items) {
            $.each(items, function (item) {
                $(listBoxSelector).append('<option value="' + this[Id] + '">' + this[OptionText] + '</option>');
            });
        }
            );
}

/*
@purpose    - Synchronizing a form with a table back and forth.
On "submission" of the form the form data, the table will be checked if it already has the data in it. If it has, replace it with new data
or else add a new row.
@paramters  - 
formId - the form selector
table - the DT object
tableIndexColumn    - the primary index column's data id
beforeSubmit    - the function that must execute before processing form data on form submit event.
onCompletion    - the funciton that must be executed after adding a row to the table
*/
function syncFormWithTable(formId, table, tableIndexColumn, beforeSubmit, onCompletion) {

    $("#" + formId).on("submit", function (event) {
        beforeSubmit();
        var data = {};
        data = getFormValues(formId);

        var rowdata = table.rows().data(); // row data of the table

        var i = 0; // for iteration
        for (var material in rowdata) {
            // rowdata has unwanted objects, we are skipping them using length attribute limit
            if (i < rowdata.length) {
                // if table already has the material, remove it.
                if (rowdata["" + i + ""]["" + tableIndexColumn + ""] == data["" + tableIndexColumn + ""]) {

                    // get the index
                    var index = table.row(material).index();
                    var index = parseInt(index);

                    table.row(index).remove();
                    break;
                }
            } else {
                break;
            }
            i++;
        }

        // add material to the row
        table.row.add(data).draw(false);
        onCompletion();
        event.preventDefault();
    });
}

/*-
@purpose - ajaxification of a form
deprecated with the use of PJAX libary
*/
function bindajaxformsubmitevent(AjaxFormId, formPostUrl, afterSubmission) {

    $(document).ready(function () {
        var afterSubmit = afterSubmission;
        AjaxFormId = "#" + AjaxFormId;

        $(AjaxFormId).unbind().submit(function (event) {

            // get the form data
            var formdata = {};
            var inputsSelector = AjaxFormId + " .form-control";

            $(inputsSelector).each(function () {
                formdata[$(this).attr("name")] = $(this).val();
            });
            // send json object to the formPostUrl
            $.ajax({
                type: 'post', // define the type of http verb we want to use (post for our form)
                url: formPostUrl, // the url where we want to post
                data: formdata, // our data object
                datatype: 'json', // what type of data do we expect back from the server
                encode: true
            })
                // in the case of succesfull form submission
                .done(function (data) {
                    if (afterSubmit != null) {
                        afterSubmit(data);
                    }
                    // here we will handle errors and validation messages. Error handling better done in the failure event
                });
            return false;
        });
    });
}

/*
@purpose - creating and submitting an object as given below
[
-- constructed using form data
name1:value1,
name2:value2,
--- constructed using table data
name3 :    {
    name4:value4,
    name5:value5
    },
    {
    name4:value4,
    name5:value5
    }
]

@paramters 
-buttonId       - the button on which's click the object should be created and sent.
-table          - the table that provides data
-tableDataName  - =name3 , as given above
-formId         - selector of the form/ assumed it is an ID attribute
-apiUrl         - the API URL to which the form needs to be submitted.
-beforeSubmit   - function to execute before starting the processing.
-onCompletion   - the function to execute on completion of the processing
*/
function sendComplexObjectOnClick(buttonId, table, tableDataName, formId, apiUrl, beforeSubmit, onCompletion) {

    $("#" + buttonId).on('click', function (event) {
        beforeSubmit();
        var submitData = {}; // the data that will be sent using ajax

        var tableData = getTableData(table); // the table that will be attached to the data

        table.fnDestroy();

        $("#" + formId + " .form-control").each(function () {
            submitData[$(this).attr2("name")] = $(this).val();
            $(this).val("");
        });

        submitData["" + tableDataName + ""] = tableData; // adding the materials in datatable

        $.ajax({
            type: 'post',
            url: apiUrl,
            data: JSON.stringify(submitData), // need to be strigified to avoid browser hang
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                onCompletion();
            }
        });
        event.preventDefault();
    });
}


// LOCAL STORAGE PROCESSING

/*
@purpose    - get local storage data value using the key
@parameters -
-key        -the key of the required value in the LS
@returns    - the value.
*/
function getLocalStorageData(key) {
    if (localStorage) {
        if (localStorage.getItem(key)) {
            //set local storage 'object' to save products retailer choose
            return JSON.parse(localStorage.getItem(key));
        } else {
            console.log("Local Storage empty or not accessible : key : " + key);
        }
    } else {
        console.log("Browser doesn't have local storage");
    }
    return;
}

/*
@purpose - adding a product to a Quote
the quote is saved in the LS as a name value pair. The value part is updated by this method. 
if "Quotation" doesn't exist in the LS, then create it. The value is of below format
[
storeId1 : {
          productId : {
              name : product1Name,
              quantity : quantity,
              price : price
              },
          productId : {
              name : product1Name,
              quantity : quantity,
              price : price
              }
          },
storeId2 : {
          productId : {
              name : product1Name,
              quantity : quantity,
              price : price
              },
          productId : {
              name : product1Name,
              quantity : quantity,
              price : price
              }
          }
]
@assumptions - validations are done at html level
@paramters
-wholesalerId - the store Id
-product - the product object which has this format,
{
productId   : 111 ,
Quantity    : 10,
UnitPrice   : 300
}
@outcomes
- if the browser doesn't support the localstorage, shout to the console.
- if the Quotation item doesn't exist in LS, create and continue.
- if wholesaler already exist in the LS, update it.
- if doésn't exist, create it and enter the product value in it.
*/
function addToQuote(product, wholesalerId) {
    var Quotation = {};
    var ProductsInQuotation = {};
    if (localStorage) {
        if (!localStorage.getItem('Quotation')) {
            // if the localstorage for Quotation is not created already, create it
            localStorage.setItem('Quotation', JSON.stringify({}));
        }
        Quotation = JSON.parse(localStorage.getItem('Quotation'));
        if (Quotation[wholesalerId]) {
            // quotation with the wholesaler exist already, we assume that the Products in Quotation object is created already
            ProductsInQuotation = Quotation[wholesalerId]["ProductsInQuotation"]
        } else {
            // this is a new quotation for this wholesaler
            Quotation[wholesalerId] = {};
            Quotation[wholesalerId]["ProductsInQuotation"] = {};
        }

    } else {
        console.log("Browser doesn't support local storage method");
        return;
    }

    // check if the product already exist
    if (ProductsInQuotation[product.ProductId]) {
        ProductsInQuotation[product.ProductId]["Quantity"] = parseInt(ProductsInQuotation[product.ProductId]["Quantity"]) + parseInt(product.Quantity); // new quantity
        ProductsInQuotation[product.ProductId]["UnitPrice"] = parseInt(product.UnitPrice); // new price

        Quotation[wholesalerId]["ProductsInQuotation"] = ProductsInQuotation;
        console.log(Quotation);
        localStorage.setItem('Quotation', JSON.stringify(Quotation));
        return;
    }

    ProductsInQuotation[product.ProductId] = product;
    Quotation[wholesalerId]["ProductsInQuotation"] = ProductsInQuotation;

    localStorage.setItem('Quotation', JSON.stringify(Quotation));

    console.log(Quotation);
}

/*
@purpose - adding a product to a Order Cart which has multiple sub carts in it. Used for wholesale Orders. Functionality is similar to above. 
Order Cart is saved in the LS as a single name value pair. The value part is updated by this method. 
if "Orders" doesn't exist in the LS, then create it. The value is of below format
[
storeId1 : {
          productId : {
              name : product1Name,
              quantity : quantity
              },
          productId : {
              name : product1Name,
              quantity : quantity
              }
          },
storeId2 : {
          productId : {
              name : product1Name,
              quantity : quantity
              },
          productId : {
              name : product1Name,
              quantity : quantity
              }
          }
]
@assumptions - validations are done at html level
@paramters
-wholesalerId - the store Id / just used, can rename it to make it much suitable
-product - the product object which has this format,
{
productId   : 111 ,
Quantity    : 10,
}
@outcomes
- if the browser doesn't support the localstorage, shout to the console.
- if the Orders item doesn't exist in LS, create and continue.
- if seller already exist in the LS, update it.
- if doésn't exist, create it and enter the product value in it.
*/
function addToOrder(product, wholesalerId) {
    var Order = {};
    var ProductsInOrder = {};
    if (localStorage) {
        if (!localStorage.getItem('Order')) {
            // if the localstorage for order is not created already, create it
            localStorage.setItem('Order', JSON.stringify({}));
        }
        Order = JSON.parse(localStorage.getItem('Order'));
        if (Order[wholesalerId]) {
            // order with the wholesaler exist already, we assume that the Products in order object is created already
            ProductsInOrder = Order[wholesalerId]["ProductsInOrder"]
        } else {
            // this is a new order for this wholesaler
            Order[wholesalerId] = {};
            Order[wholesalerId]["ProductsInOrder"] = {};
        }


    } else {
        console.log("Browser doesn't support local storage method");
        return;
    }

    // check if the product already exist
    if (ProductsInOrder[product.ProductId]) {
        ProductsInOrder[product.ProductId]["Quantity"] = parseInt(ProductsInOrder[product.ProductId]["Quantity"]) + parseInt(product.Quantity); // new quantity
        ProductsInOrder[product.ProductId]["UnitPrice"] = parseInt(product.UnitPrice); // new price

        Order[wholesalerId]["ProductsInOrder"] = ProductsInOrder;
        console.log(Order);
        localStorage.setItem('Order', JSON.stringify(Order));
        return;
    }

    ProductsInOrder[product.ProductId] = product;
    Order[wholesalerId]["ProductsInOrder"] = ProductsInOrder;

    localStorage.setItem('Order', JSON.stringify(Order));

    console.log(Order);
}

/*
Same as above, but used for retail order cart
*/
function addToRetailOrder(product, retailerId) {
    var retailOrder = {};
    var ProductsInRetailOrder = {};
    if (localStorage) {
        if (!localStorage.getItem('retailOrder')) {
            // if the localstorage for retailOrder is not created already, create it
            localStorage.setItem('retailOrder', JSON.stringify({}));
        }
        retailOrder = JSON.parse(localStorage.getItem('retailOrder'));
        if (retailOrder[retailerId]) {
            // retailOrder with the wholesaler exist already, we assume that the Products in retailOrder object is created already
            ProductsInRetailOrder = retailOrder[retailerId]["ProductsInRetailOrder"]
        } else {
            // this is a new retailOrder for this wholesaler
            retailOrder[retailerId] = {};
            retailOrder[retailerId]["ProductsInRetailOrder"] = {};
        }


    } else {
        console.log("Browser doesn't support local storage method");
        return;
    }

    // check if the product already exist
    if (ProductsInRetailOrder[product.ProductId]) {
        ProductsInRetailOrder[product.ProductId]["Quantity"] = parseInt(ProductsInRetailOrder[product.ProductId]["Quantity"]) + parseInt(product.Quantity); // new quantity
        ProductsInRetailOrder[product.ProductId]["UnitPrice"] = parseInt(product.UnitPrice); // new price

        retailOrder[retailerId]["ProductsInRetailOrder"] = ProductsInRetailOrder;
        console.log(retailOrder);
        localStorage.setItem('retailOrder', JSON.stringify(retailOrder));
        return;
    }

    ProductsInRetailOrder[product.ProductId] = product;
    retailOrder[retailerId]["ProductsInRetailOrder"] = ProductsInRetailOrder;

    localStorage.setItem('retailOrder', JSON.stringify(retailOrder));

    console.log(retailOrder);
}

/*
@purpose - sends a data object to the server
@parameters -
apiUrl - URL of the API
data  - the data objecr to be sent
onSuccess - a function to execute in case of success
onFailure - a function to execute in case of an error
*/
function sendObjectToServer(apiUrl, data, onSuccess, onFailure) {

    $.ajax({
        type: 'post',
        url: apiUrl,
        data: JSON.stringify(data), // need to be strigified to avoid browser hang
        dataType: 'json',
        async : false ,
        contentType: 'application/json',
        success: function (response) {
            onSuccess();
        },
        error: function (response) {
            onFailure();
        }
    });
}

/*
@purpose - show a modal message
@parameters
-title - title of a message,string
-body - message body string
*/
function showModalMessage(title, body) {

    $("#modal-message-title").html(title)
    $("#modal-message-body").html(body);
    $("#modal-message").modal('show');

}


/*
http://stackoverflow.com/questions/16858954/how-to-properly-use-jspdf-library - copied from this place

tableId - table id
*/

//function demoFromHTML(tableId) {
//    var pdf = new jsPDF('p', 'pt', 'letter');
//    // source can be HTML-formatted string, or a reference
//    // to an actual DOM element from which the text will be scraped.
//    source = $(tableId)[0];

//    // we support special element handlers. Register them with jQuery-style 
//    // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
//    // There is no support for any other type of selectors 
//    // (class, of compound) at this time.
//    specialElementHandlers = {
//        // element with id of "bypass" - jQuery style selector
//        '#bypassme': function (element, renderer) {
//            // true = "handled elsewhere, bypass text extraction"
//            return true
//        }
//    };
//    margins = {
//        top: 80,
//        bottom: 60,
//        left: 40,
//        width: 522
//    };
//    // all coords and widths are in jsPDF instance's declared units
//    // 'inches' in this case
//    pdf.fromHTML(
//        source, // HTML string or DOM elem ref.
//        margins.left, // x coord
//        margins.top, { // y coord
//            'width': margins.width, // max width of content on PDF
//            'elementHandlers': specialElementHandlers
//        },

//        function (dispose) {
//            // dispose: object with X, Y of the last line add to the PDF 
//            //          this allow the insertion of new lines after html
//            pdf.save('Test.pdf');
//        }, margins
//    );
//}



/*
Converts a table data to Json data
*/
// This function will return table data in an Array format
function tableToJson(table) {
    var data = [];

    // first row needs to be headers
    var headers = getHeaders(table);
    // go through cells
    for (var i = 0; i < table.rows.length; i++) {

        var tableRow = table.rows[i];
        var rowData = [];

        for (var j = 0; j < tableRow.cells.length; j++) {

            rowData[headers[j]] = tableRow.cells[j].innerHTML;

        }

        data.push(rowData);
    }

    return data;
}

function getHeaders(tableId) {
    var table = $(tableId).get(0);
    var headers = [];
    for (var i = 0; i < table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
    }
    return headers;

}


/*@purpose - generate a report using data in the element
@parameters
element - the element which triggered this event
@assumptions - all the attributes in the element are specified
*/
function generate(element) {

    var tableId = $("#"+element.id).attr("data-table"); // Id of the table where we are going to extract data from

    var columns = getHeaders(tableId);

    var data = tableToJson($(tableId).get(0), columns);

    var doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, data);
    doc.save("Report.pdf");
}