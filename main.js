var url = 'http://157.230.17.132:4011/sales';
var monthSelect = $('.mymonthselect');
var nameSelect = $('.mynameselect');
var input = $('#type-text');
var button = $('#button');

$(document).ready(function() {

  $.ajax({
    url: url,
    method: 'GET',
    success: function(data)
    {

      line(data);
      pie(data);

    },
    error: function(err)
    {
      alert('si è verificato un errore');
    }
  })
})

$(document).ready(function() {
  var mytext = parseInt(input.val());
  var selectMonth = monthSelect.val();
  var selectName = nameSelect.val();
  button.click(function() {

    $.ajax({
      url: url,
      method: 'POST',
      data: {
        salesman: selectName,
        amount: mytext,
        date: selectMonth,

      },
      success: function(data) {
        line(data);
        pie(data);
      },
      error: function(errore) {

      }
    })
  })
})

function line(data){
  var objectPending = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0};

  for (var i = 0; i < data.length; i++) {
    var oggetto = data[i];
    var date = oggetto.date;
    var pendingDate = moment(date, 'DD/MM/YYYY');
    var newDate = pendingDate.format('MMMM');
    console.log(newDate);
    console.log(date);


    objectPending[newDate] += oggetto.amount;
  }

  var arrayLabels = [];
  var arrayData = [];


  for (var chiave in objectPending) {
    arrayLabels.push(chiave);
    arrayData.push(objectPending[chiave]);
    console.log(chiave);
    monthSelect.append("<option>" + chiave + "</option>");

  }



  console.log(arrayData);
  var ctx = document.getElementById('line').getContext('2d');
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels: arrayLabels,
          datasets: [{
              label: "My First dataset",
              borderWidth:'1',
              backgroundColor: 'transparent',
              borderColor: 'blue',
              data: arrayData,
          }]
      },

      // Configuration options go here
      options: {}
  });
}

function pie(data){

  var obj = {};
  var total = 0;

  for (var i = 0; i < data.length; i++) {
      var oggetto = data[i];
      var salesMan = oggetto.salesman;
      var amount = oggetto.amount;

      if (obj[salesMan] == undefined)
      {
          obj[salesMan] = 0;
      }

      obj[salesMan] += amount;
      total += amount;
  }

  var arrayLabels = [];
  var arrayAmounts = [];

  for (var key in obj) {

      var perc = parseInt(obj[key] / total * 100);
      console.log(perc);

      arrayLabels.push(key);
      arrayAmounts.push(perc.toFixed(2));
      nameSelect.append("<option>" + key + "</option>");


  }


  var myPieChart = new Chart($('#pie'), {
      type: 'pie',
      data: {
          datasets: [{
            backgroundColor:['rgb(255, 0, 0)','rgb(250, 255, 0)',
            'rgb(51, 206, 0)','rgb(0, 85, 255)'],
              data: arrayAmounts
          }],
          labels: arrayLabels
      }
  });
}
