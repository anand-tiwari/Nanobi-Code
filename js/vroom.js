$(document).ready(function() {
    var datepickerDate = null;
    var productType = [];
    var obj = {};
//------------------ Ajax Call and GET Json Response ------------------------------------------------------//
    $.ajax({
            "type": 'GET',
//            "url": "http://nbvmpoc.cloudapp.net:81/contentserver/services/content/analytics/an8e8ee334-08ce-4fef-bbdb-798f7b1b6bf5/json?t=930d0d51-9765-4787-bfe8-9770e3afa053",
            "url":"data.json",
            "cache": 'false',
            "dataType": "json",
            success: function(data) {
//---------------------------   create Object for later operation on that object --------------------//
                $(data.json_data).each(function (k, v) {
                    var product,sale;
                    $.each(v, function(i,e){
                        if(i=="Product Category")
                            product = e;
                        if(i=="Net Sales")
                            sale = e;
                    });
                    productType[k] = (product);
                    obj[k] = {
                        Product: product,
                        State: v.State,
                        Date: v.Date,
                        Sale: sale
                    };
                });
                console.log($.unique(productType));
//----------------------- Filter Unique values and create select option ------------------------------//
                $($.unique(productType)).each(function (i, v) {
                    $('.productCategory').append('<option value="' + v + '">' + v + '</option>');
                });
                
//----------------- Handle events of changing the Product Category ------------------------------------------------//
                 $('.productCategory').on('change', function () {
                    var $that = $(this);
                     $('.personDataTable').empty();
                    $.each(obj,function (i, v) {
                        if( $that.val() == v.Product) {
                             var row = $('<tr class="opener" value=" ' + v.Sale+ ' "></tr>');
                            $(".personDataTable").append(row);
                            row.append($("<td>" + v.State + "</td>"));
                            row.append($("<td>" + v.Date + "</td>"));
                            row.append($("<td>" + v.Sale + "</td>"));
                        }
                    });
                     if(datepickerDate!=null)
                         dateFilter(datepickerDate);
                }).change();
            }
    });
   
//---------------- open Dialog ----------------------------------------------------------///
        $(".dialog").dialog({
                autoOpen: false,
                maxWidth:600,
                maxHeight: 500,
                width: 600,
                height: 500,
                modal: true,
        });
    
//------------------  Handle on click events of rows in tables --------------------------------------------------//
    $('.personDataTable').on('click', '.opener',function(e) {    
        var mi = parseInt($(this).attr("value"));
        mi = mi/1000;
         $( ".dialog" ).dialog( "open" );
		var	miNum = parseInt(mi);
		if ( (mi <= 120) && !isNaN(miNum) ){
            var speedMi = miNum * 2 - 31;	
            $('#numbers').css('text-align', 'center').html(miNum.toFixed(0));
	   } else if (!isNaN(miNum)){ 
	   		var speedMi = 215;
	   		$('#numbers').css('text-align', 'right').html(miNum.toFixed(0));
	   } else { 
	   		$('#numbers').html('');	
	   		$("#errmsg").html("Numbers Only").show().fadeOut(100);
	   }	
		var needle = $("#needle");    
		TweenLite.to(needle, 2, {rotation:speedMi,  transformOrigin:"bottom right"});
    });
    
  //---------------- controls when we select date from DatePicker ---------------------------------------------------------//     
        $(".datepicker").datepicker({
                onSelect: function(dateText, inst) {
                var date1 = $(this).val();
                console.log(date1);
                date1 = new Date(date1);
                var day = date1.getDate();
                var monthIndex = date1.getMonth()+1;
                    if(monthIndex<10)
                        monthIndex = "0"+monthIndex;
                var year = date1.getFullYear();
                date1 = year + '-' + monthIndex + '-' + day;
                datepickerDate = date1;
                dateFilter(date1);
            }      
        });
    
//--------------------------  Filter data on selected Dates -----------------------------------------------------------------//
    function dateFilter(date1){
        var jo = $(".personDataTable").find("tr");
                if (this.value == "") {
                    jo.show();
                    return;
                }
                jo.hide();   
                jo.filter(function (i, v) { 
                    var $t = $(this).find('td:eq(1)').html();
                    if (date1==$t)
                        return true;
                    return false;
                })
                .show();
    }
//---------------------------  end of filter --------------------------------------------------------------------------------//
});