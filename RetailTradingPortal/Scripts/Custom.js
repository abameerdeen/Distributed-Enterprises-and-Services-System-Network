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

    $("#" + tableSelector+" tbody").on('click', 'tr', function () {

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

    if (typeof (parameters.fullreport) !='undefined') {

        var multiselectId = "multiselect-box-"+tableSelector;
        var tableResetId = "table-reset" + tableSelector;
        var tableLengthId = "table-length";

        // get all the headers and populate the select box       
        var headers = getHeaders(tableSelector);
        // go through every column and add a <option tag for the select box>
        var options = '<div class="options-container">'
        for (var i = 0; i < headers.length  ; i++) {
            options = options + '<option value="' + i + '">' + headers[i] + '</option>';

        }
        options = options + '</div>';

        var reportName = "Report";
        if (typeof (parameters.reportname) !== 'undefined') {
            reportName = parameters.reportname;
        }

        var multiselectbox = '<div class="multiselect btn col-md-4" id="' + multiselectId + '" multiple="multiple" data-target="multi-0"><div class="title noselect"><span class="text">Choose fields</span><span class="close-icon material-icons">remove_circle</span><span class="expand-icon material-icons">add_circle</span></div></div>';
        var resetButton = '<div class="btn btn-reset pull-right" id="table-reset"><i class="material-icons">cached</i></div>';
        var getReport = '<a href="#" id="generate-report-button" data-table="'+tableSelector+'" report-name="'+reportName+'" class="btn report-button col-md-3">Get report</a>';
        var lengthChange = '<input class ="col-md-3" type="number"  min="1" id="table-length"/>';

        $("#" + tableSelector).parent().parent().append(lengthChange);
        $("#" + tableSelector).parent().parent().append(multiselectbox);
        $("#" + tableSelector).parent().parent().append(getReport);
        $("#" + tableSelector).parent().parent().append(resetButton);

        
        $('#' + multiselectId).append(options);

        $('#' + tableSelector).parent().siblings(".report-button").on('click', function (event) {
            generateReport(
                {
                    "tableId": tableSelector,
                    "reportName" : reportName
                }
                );
        });

        // attach onclick table manipulator event
        $('#' + multiselectId + " .options-container").children().each(function (element) {
            $(this).on("click", function () {
                var columnIndex = $(this).val();
                var column = table.column(columnIndex);
                $(this).toggleClass("selected");
                table.column($(this).val()).visible($(this).hasClass("selected"))
                // get all the selected column index list        
                $(this).siblings().each(function (){
                    table.column($(this).val()).visible($(this).hasClass("selected"))
                });
            });


        });

        //initiate multiselect
        var multi = new Multiselect('#' + multiselectId);
        // attach close icon event

        $("#"+multiselectId).children(".title").children("span.text").on('click', function () {
            $(this).parent().parent().toggleClass("active");
            if ($(this).parent().parent().hasClass("active")) {
                $(this).siblings(".expand-icon").html("remove_circle");

            } else {
                $(this).siblings(".expand-icon").html("add_circle");

            }
            multi.open();
        });


        $("#"+multiselectId).children(".title").children("span.expand-icon").on('click', function () {
            $(this).parent().parent().toggleClass("active");
            if ($(this).parent().parent().hasClass("active")) {
                $(this).html("remove_circle");
                
            } else {
                $(this).html("add_circle");
                
            }
            multi.open();
        });

        $("#" + multiselectId).children(".title").children(".close-icon").on('click', function () {
            for (var i = 0; i < headers.length  ; i++) {
                var column = table.column(i);
                // Toggle the visibility
                column.visible(true);
            }
        })

        $("#"+tableResetId).on('click', function () {
            for (var i =0; i < headers.length ; i++) {
                console.log("debug");
                table.column(i).visible(true);
            }

            $("#"+multiselectId+" .options-container > option").each(function () {
                $(this).removeClass("selected");
            });

            table.search('').columns().search('').draw();

            $('#' + tableSelector + ' tfoot th input').each(function () {
                $(this).val('');
            });

            table.page.len(20).draw();
            $("#"+tableLengthId).val('');
        });

        // adding a input box to search column
        var columnIndex = 0;
            $('#'+tableSelector +' tfoot th').each(function () {
                var title = $(this).text();
                $(this).html('<input column-index="' + columnIndex + '" type="text" />');
                columnIndex++;
            });

        // attaching the search event listener
            $('#' + tableSelector + ' tfoot th input').on('keyup change',function () {
                table.column($(this).attr("column-index")).search($(this).val()).draw(false);
            });

            $('#'+tableLengthId).on('keyup change', function () {
                table.page.len($(this).val()).draw();
            }); 
    }

    return table;
}

/*
The older version of the above function, use is not recomended
@parameters 
- parameters - that needs to be sent into the DataTable() function. Must be a raw object.
*/
function initiateTable(tableSelector, parameters) {

    // initiating the data table
    var table = $("#" + tableSelector+" tbody").DataTable(parameters);

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
function getFormInputValues(formId) {
    var formSelector = "#" + formId + " input";
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
    var submitButton;
    $(form.selector + " input").each(function () {
        if ($(this).attr('type') == "submit") {
            
        } else {
        $(this).val(data[$(this).attr("name")]);
        }
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
            //set local storage 'object' to save products Enterprise choose
            return JSON.parse(localStorage.getItem(key));
        } else {
            console.log("Local Storage empty or not accessible : key : " + key);
            return null;
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
function addToRetailOrder(product, EnterpriseId) {
    var retailOrder = {};
    var ProductsInRetailOrder = {};
    if (localStorage) {
        if (!localStorage.getItem('retailOrder')) {
            // if the localstorage for retailOrder is not created already, create it
            localStorage.setItem('retailOrder', JSON.stringify({}));
        }
        retailOrder = JSON.parse(localStorage.getItem('retailOrder'));
        if (retailOrder[EnterpriseId]) {
            // retailOrder with the wholesaler exist already, we assume that the Products in retailOrder object is created already
            ProductsInRetailOrder = retailOrder[EnterpriseId]["ProductsInRetailOrder"]
        } else {
            // this is a new retailOrder for this wholesaler
            retailOrder[EnterpriseId] = {};
            retailOrder[EnterpriseId]["ProductsInRetailOrder"] = {};
        }


    } else {
        console.log("Browser doesn't support local storage method");
        return;
    }

    // check if the product already exist
    if (ProductsInRetailOrder[product.ProductId]) {
        ProductsInRetailOrder[product.ProductId]["Quantity"] = parseInt(ProductsInRetailOrder[product.ProductId]["Quantity"]) + parseInt(product.Quantity); // new quantity
        ProductsInRetailOrder[product.ProductId]["UnitPrice"] = parseInt(product.UnitPrice); // new price
        ProductsInRetailOrder[product.ProductId]["SubTotal"] = parseInt(product.SubTotal); // new price
        ProductsInRetailOrder[product.ProductId]["ProductName"] = parseInt(product.ProductName); // new price

        retailOrder[EnterpriseId]["ProductsInRetailOrder"] = ProductsInRetailOrder;
        localStorage.setItem('retailOrder', JSON.stringify(retailOrder));
        return;
    }

    ProductsInRetailOrder[product.ProductId] = product;
    retailOrder[EnterpriseId]["ProductsInRetailOrder"] = ProductsInRetailOrder;

    localStorage.setItem('retailOrder', JSON.stringify(retailOrder));

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
        contentType: 'application/json',
        statusCode: {
            200: onSuccess,
            201: onSuccess,
            404: onFailure
        },
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
-body - message body stringa
*/
function showModalMessage(title, body) {
    $("#modal-message .modal-title").html(title)
    $("#modal-message .modal-body").html(body)
    
    $("#modal-message").parent().attr("style", "display:block");
    $("#modal-message").modal('show');

}

/*
Converts a table data to Json data
*/
// This function will return table data in an Array format
function tableToJson(table) {

    var data = [];
    // go through cells
    for (var i = 1; i < table.rows.length; i++) {
        var tableRow = table.rows[i];

        // create an array rather than an object
        var rowData = [];
        for (var j = 0; j < tableRow.cells.length; j++) {
            if (tableRow.cells[j].nodeName != 'TH') {
            rowData.push(tableRow.cells[j].innerHTML)
            }
        }
        data.push(rowData);
    }

    return data;
}

/*
@purpose - getting an array consisting of headers of the table
@parameters
-tableId = table id
*/
function getHeaders(tableId) {
    var table = $("#"+tableId).get(0);
    var headers = [];
    for (var i = 0; i < table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML;
    }
    return headers;
}


/*@purpose - generate a report using data in the element
@parameters
element - the element which triggered this event
@assumptions - all the attributes in the element are specified
*/
function generate(element) {
    var tableId = $("#" + element.id).attr("data-table"); // Id of the table where we are going to extract data from
    var reportName = $("#" + element.id).attr("report-name");

    var columns = getHeaders(tableId);

    var data = tableToJson($("#"+tableId).get(0), columns);

    var doc = new jsPDF('p', 'pt');
    var imgData = "data:image/jpeg;base64,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";
    doc.addImage(imgData, 'JPEG', 0, 0);

    doc.text(450, 40, reportName);
    doc.autoTable(columns, data, {
        startY: 160,
        theme: 'striped'
    });
  
    doc.save(reportName+".pdf");
}

function generateReport(data) {
    var tableId = data.tableId; // Id of the table where we are going to extract data from
    var reportName = data.reportName;

    var columns = getHeaders(tableId);

    var data = tableToJson($("#" + tableId).get(0), columns);

    var doc = new jsPDF('p', 'pt');
    var imgData = "data:image/jpeg;base64,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";
    doc.addImage(imgData, 'JPEG', 0, 0);

    doc.text(450, 40, reportName);
    doc.autoTable(columns, data, {
        startY: 160,
        theme: 'striped'
    });

    doc.save(reportName + ".pdf");
}


function generateInvoice(element, saleId) {
    var tableId = $("#" + element.id).attr("data-table"); // Id of the table where we are going to extract data from
    var reportName = $("#" + element.id).attr("report-name");

    var columns = getHeaders(tableId);

    var data = tableToJson($(tableId).get(0), columns);

    var doc = new jsPDF('p', 'pt');
    var imgData = "data:image/jpeg;base64,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";
    doc.addImage(imgData, 'JPEG', 0, 0);

    doc.text(40, 150, "Total Recievable : Rs." + $("#total-sale-amount").html());
    
    doc.text(450, 40, "INVOICE : #" + saleId);
    doc.autoTable(columns, data, {
        startY: 160,
        theme: 'striped'
    });

    $("#total-sale-amount").html("0.00");

    //doc.text("Left aligned text", 1, 1);
    doc.save(reportName);
}

function generatePurchaseOrder(element, poId) {
    var tableId = $("#" + element.id).attr("data-table"); // Id of the table where we are going to extract data from
    var reportName = $("#" + element.id).attr("report-name");

    var columns = getHeaders(tableId);

    var data = tableToJson($(tableId).get(0), columns);

    var doc = new jsPDF('p', 'pt');
    var imgData = "data:image/jpeg;base64,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";
    doc.addImage(imgData, 'JPEG', 0, 0);

    doc.text(40, 150, "Total Payable :Rs." + $("#total-po-amount").html());

    doc.text(450, 40, "PURCHASE ORDER : #" + poId);
    doc.autoTable(columns, data, {
        startY: 160,
        theme: 'striped'
    });

    $("#total-sale-amount").html("0.00");
    $.pjax.reload('.content-panel');

    //doc.text("Left aligned text", 1, 1);
    doc.save(reportName);
}

/*
getting data from server, using ajax
*/
function getDataFromServer(apiUrl) {
    var data=null;
    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: "json",
        async : false ,
        success : function (response){
            data = response;
        }
    });
    return data;
}

/*@purpose - selected row key
@assume first column of the table
@parameters
table - DT Object
*/
function getTableSelectedRowKey1(table, jqueryTable) {
    var selectedKey;
    var index = getTableSelectedRowIndex(jqueryTable);
    var selectedKey = table.row(index).data()["Id"];

    return selectedKey;
}


/*
submit a form through ajax
*/


function ajaxFormSubmit(formId, beforeSubmit, success, failure) {
    $("#" + formId).on("submit", function (event) {
        beforeSubmit();
        formData = getFormData(this);
        var apiUrl = $(this).attr("action");
        $.ajax({
            url: apiUrl,
            data : formData,
            type: "GET",
            dataType: "json",
            statusCode : {
                201 : success,
                200 : success ,
                404 : failure,
                500: failure,
                406 : failure
            }
        }
        );
        event.preventDefault();

    });
}
// Order processing functions

/*
Get total of the order from the localstorage
*/
function getOrderTotal(EnterpriseId, orderType) {
    retailOrder = getLocalStorageData(orderType);
    var total = 0;
    for (product in retailOrder[EnterpriseId]["ProductsInRetailOrder"]) {
        total = total + parseFloat(retailOrder[EnterpriseId]["ProductsInRetailOrder"][product]["SubTotal"]);
    }
    return total;
}

/*
Delete an Order that is pending placement.
*/
function deleteOrder(EnterpriseId, orderType) {
    // get the order
    var retailOrder = getLocalStorageData(orderType);
    // delete the object element
    delete retailOrder[EnterpriseId];
    // update
    localStorage.setItem(orderType, JSON.stringify(retailOrder));
}

/*

*/
function deleteProductFromOrder(EnterpriseId, productId, orderType) {
    // get the local storage
    var retailOrder = getLocalStorageData(orderType);

    // delete the product from local storage
    delete retailOrder[EnterpriseId]["ProductsInRetailOrder"][productId];

    localStorage.setItem(orderType, JSON.stringify(retailOrder));
}


//function initiateTable1(tableSelector, parameters, onSelection, onUnSelection) {

//    var table = $("#" + tableSelector).DataTable(parameters);

//    $("#" + tableSelector + " tbody").on('click', 'tr', function () {

//        // unselect all the siblings
//        $(this).siblings().each(
//            function () {
//                $(this).removeClass("selected")
//            }
//            );
//        $(this).toggleClass("selected");

//        if ($(this).hasClass("selected")) {
//            onSelection();
//        } else {
//            onUnSelection();
//        }
//        return false;
//    });

//    if (typeof (parameters.fullreport) != 'undefined') {

//        var multiselectId = "multiselect-box";

//        // get all the headers and populate the select box       
//        var headers = getHeaders(tableSelector);
//        // go through every column and add a <option tag for the select box>
//        var options = '<div class="options-container">'
//        for (var i = 0; i < headers.length  ; i++) {
//            options = options + '<option value="' + i + '">' + headers[i] + '</option>';

//        }
//        options = options + '</div>';

//        var reportName = "Report";
//        if (typeof (parameters.reportname) !== 'undefined') {
//            reportName = parameters.reportname;
//        }

//        var multiselectbox = '<div class="multiselect btn col-md-4" id="' + multiselectId + '" multiple="multiple" data-target="multi-0"><div class="title noselect"><span class="text">Choose fields</span><span class="close-icon material-icons">remove_circle</span><span class="expand-icon material-icons">add_circle</span></div></div>';
//        var resetButton = '<div class="btn btn-reset pull-right" id="table-reset"><i class="material-icons">cached</i></div>';
//        var getReport = '<a href="#" id="generate-report-button" data-table="' + tableSelector + '" report-name="' + reportName + '" class="btn report-button col-md-3">Get report</a>';
//        var lengthChange = '<input class ="col-md-3" type="number"  min="1" id="table-length"/>';

//        $("#" + tableSelector).parent().parent().append(lengthChange);
//        $("#" + tableSelector).parent().parent().append(multiselectbox);
//        $("#" + tableSelector).parent().parent().append(getReport);
//        $("#" + tableSelector).parent().parent().append(resetButton);


//        $('#' + multiselectId).append(options);

//        // attach onclick table manipulator event
//        $('#' + multiselectId + " .options-container").children().each(function (element) {
//            $(this).on("click", function () {
//                var columnIndex = $(this).val();
//                var column = table.column(columnIndex);
//                $(this).toggleClass("selected");
//                table.column($(this).val()).visible($(this).hasClass("selected"))
//                // get all the selected column index list        
//                $(this).siblings().each(function () {
//                    table.column($(this).val()).visible($(this).hasClass("selected"))
//                });
//            });


//        });

//        // attach close icon event
//        $(".close-icon").on('click', function () {
//            for (var i = 0; i < headers.length  ; i++) {
//                var column = table.column(i);
//                // Toggle the visibility
//                column.visible(true);
//            }
//        })

//        $("span.text").on('click', function () {
//            $(this).parent().parent().toggleClass("active");
//            if ($(this).parent().parent().hasClass("active")) {
//                $(this).siblings(".expand-icon").html("remove_circle");

//            } else {
//                $(this).siblings(".expand-icon").html("add_circle");

//            }
//            multi.open();
//        });

//        //initiate multiselect
//        var multi = new Multiselect('#' + multiselectId);

//        $(".expand-icon").on('click', function () {
//            $(this).parent().parent().toggleClass("active");
//            if ($(this).parent().parent().hasClass("active")) {
//                $(this).html("remove_circle");

//            } else {
//                $(this).html("add_circle");

//            }
//            multi.open();
//        });

//        $("#table-reset").on('click', function () {
//            for (var i = 0; i < headers.length ; i++) {
//                console.log("debug");
//                table.column(i).visible(true);
//            }

//            $(".multiselect .options-container > option").each(function () {
//                $(this).removeClass("selected");
//            });

//            table.search('').columns().search('').draw();

//            $('#' + tableSelector + ' tfoot th input').each(function () {
//                $(this).val('');
//            });

//            table.page.len(20).draw();
//            $("#table-length").val('');
//        });

//        // adding a input box to search column
//        var columnIndex = 0;
//        $('#' + tableSelector + ' tfoot th').each(function () {
//            var title = $(this).text();
//            $(this).html('<input column-index="' + columnIndex + '" type="text" />');
//            columnIndex++;
//        });

//        // attaching the search event listener
//        $('#' + tableSelector + ' tfoot th input').on('keyup change', function () {
//            table.column($(this).attr("column-index")).search($(this).val()).draw(false);
//        });

//        $('#table-length').on('keyup change', function () {
//            table.page.len($(this).val()).draw();
//        });
//    }

//    return table;
//}



