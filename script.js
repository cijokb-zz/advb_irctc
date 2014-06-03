/*
    It is an app for those who are fed up with W/L status while booking on www.IRCTC.co.in for future dates.
    This small app will help to know the advance bookable dates(60 days) of the current and next month based on the prefered days.
    Booking on the dates shown will have chance to get confirmed tickets. 
        
    version 1.0
    Developed by Cijo K.B
    email:cijo.kb@gmail.com
*/

window.onload=initAll;

function initAll(){
    var dte=new Date();
    var used_on="";
    var cr_dt=dte.getDate()+"/"+(dte.getMonth()+1)+"/"+dte.getFullYear();
    if(document.cookie !=""){
        used_on=document.cookie.split("=")[1];
    }
    else{
        used_on=cr_dt;
    }
    document.getElementById('last_used').innerHTML=used_on;
    setCookie(cr_dt);    
}

function setCookie(cr_dt){
    var exp=new Date();
    exp.setMonth(exp.getMonth()+6);
    var usedon=cr_dt;
    document.cookie="last_date="+usedon+";path=/;expires="+exp.toGMTString();
}

var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months=["January","Frebuary","March","April","May","June","July","August","September","October","November","December"];
var no_days=[31,28,31,30,31,30,31,31,30,31,30,31];
var adv_days=60; //no of advacne days for booking default
var dt=new Date();
var start=dt.getDate();
var year=dt.getFullYear();
var day=days[dt.getDay()];
var month=dt.getMonth();
var leap_year=leapyear(dt.getFullYear());

if(leap_year)
    {
        if (month==1)
        {
            no_days.splice(1,1,29); //adding 29 days for frebuary
        }
    }
    
var tb=document.getElementById("tbl");
var trvl_in=document.getElementById("trvl_day");
var rtn_in=document.getElementById("rtn_day");

trvl_in.addEventListener("change",change_val);
rtn_in.addEventListener("change",change_val);

output(); //calling the main function when loads

//when days are changed
function change_val(){
    delete_table(tb);//first deleting the table created.
    output();   
}

function output()
{
    var dt1=new Date;
    var today=start;
    var style=false;
    
    for(var i=month;i<=month+1;i++) //months
    {
        for(var j=today;j<=no_days[i];j++)  //days
         {
                dt1.setMonth(i);
                dt1.setDate(j);
                var jrn_dt="";
                var jrn_day="";
                var booking_month=months[dt1.getMonth()];
                var booking_date=dt1.getDate()+"/"+booking_month+"/"+year;
                var booked_days=booking(i,j,year);//1,30
                if(booked_days)
                {
                    jrn_dt=booked_days.date+"/"+booked_days.month+"/"+booked_days.year;
                    jrn_day=booked_days.day;
                    if((dt1.getDate()==start)&&(dt1.getMonth()==month)){ //checking the cuurent day or not
                        style=true;
                    }
                    else{
                        style=false;
                    }
                    create_table(tb,booking_date,jrn_dt,jrn_day,style); //create table data.
                }
            
         }   //end inner loop
        today=1; //resetting the date to 1    
    }   // end outer loop
}

//booking
function booking(mn,dte,yr){
    
    var dt2=new Date;
    var rm1=0,rm2=0,t=0;
    var mn_ct=0;
    rm1=no_days[mn]-dte; //30
    mn_ct++;
    if(mn==11){
        yr=yr+1;
        mn=0;
        t=no_days[mn];
    }
    else{
        t=no_days[mn+1];// next month
        mn_ct++;
    }
        
    rm2=adv_days-(rm1+t);//30
    dt2.setFullYear(yr);
    dt2.setMonth(mn+mn_ct); //setting month of booking
    dt2.setDate(rm2);    //setting date of booking
 
    var book_dtls=new Object;
    var valid_day=parseInt(day_check(parseInt(dt2.getDay()))); //calling the day_check()
    
    if(valid_day>=0)   //checking the valid day
    {
        book_dtls.year=dt2.getFullYear();
        book_dtls.month=months[dt2.getMonth()];
        book_dtls.day=days[valid_day];
        book_dtls.date=dt2.getDate();
    }
    else{
        book_dtls=false;
       }
    return book_dtls;
}

//checking leapyear
function leapyear(year){
    var is_leap=false;
    var result=year%4;
    
    if(result==0){
        is_leap=true;
    }
    
    return is_leap;
}

//day checker
function day_check(day_val){
    var f=0;
    var travel_day=parseInt(trvl_in.value);
    var return_day=parseInt(rtn_in.value);
    
    switch (day_val) //checking day according to the choosed one
    {
        case travel_day:
            f=1;
            break;
        case return_day:
            f=1;
            break;
        default:
            return false ;
    }
    if(f==1){
        return parseInt(day_val);
    }
    else{
        return false;
    }
}


function create_table(tb,bkd_dt,jrn_dt,jrn_day,style){
    
    var rw_len=tb.rows.length; //current length of rows
    var rw=tb.insertRow(rw_len);
    
    rw.insertCell(0);
    rw.cells[0].appendChild(document.createTextNode(bkd_dt)); //journey date
    
    rw.insertCell(1);
    rw.cells[1].appendChild(document.createTextNode(jrn_dt)); //booking date
    
    rw.insertCell(2);
    rw.cells[2].appendChild(document.createTextNode(jrn_day)); //booking date
    
    rw.insertCell(3);
    if(style){ //current day then color and link is changed
        rw.classList.add('possible');
        rw.cells[3].innerHTML="<a href='http://www.irctc.co.in/' title='IRCTC' target='_blank'>Book now</a>"; //booking link
    }
    else{
        rw.cells[3].innerHTML="Booking not Open"; 
    }
}

function delete_table(tb){
    var rw_len=tb.rows.length-1;
    for (var i=rw_len;i>0;i--)  //deleting the rows is done by last to first
    {
        var rw=tb.rows[i];
        var cell_len=rw.cells.length-1;
        for(var j=cell_len;j>=0;j--)  //deleting the cells is done by last to first
        {    
            rw.deleteCell(j);
        }
       tb.deleteRow(i);
    }   
}

