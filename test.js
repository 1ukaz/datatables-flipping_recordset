(function() {

    function addDays(date, days) {
        var dat = new Date(date.valueOf())
        dat.setDate(dat.getDate() + days);
        return dat;
    }

    function getDates(startDate, stopDate) {
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push( new Date (currentDate) )
            currentDate = addDays(currentDate, 1);
        }
        return dateArray;
    }

    function dateUTC(dateString) {
      var date = new Date(dateString);
      return new Date(date.valueOf() + date.getTimezoneOffset() * 60000)
    }

    function datesInProjection(projection) {
      var key, dates = [], i;
      for (key in projection) {
        for (i in projection[key]) {
          var dateStr = projection[key][i].fecha || projection[key][i].fecha_pago;
          dates.push(dateUTC(dateStr));
        }
      }
      return dates;
    }

    function dateRange(dates) {
      var min, max, i, date;
      for (i in dates) {
        date = dates[i];
        if (min === undefined || date < min) { min = date; }
        if (max === undefined || date > max) { max = date; }
      }
      return {min: min, max: max};
    }

    function getValues(payments, dates) {
      var i, payData = {}, date, dateStr, value;
      for (i in payments) {
        dateStr = payments[i].fecha || payments[i].fecha_pago;
        date = dateUTC(dateStr);
        value = payments[i].importe;
        payData[dateFormat(date)] = value;
      }
      return payData;
    }

    function getRow(projection, name, dates, summarizer) {
      var values = getValues(projection[name], dates);
      var i, row, row = [name], date;
      for (i in dates) {
        var date = dateFormat(dates[i]);
        var value = values[date] || 0;
        row.push(value);
        summarizer.sum(date, value);
      }
      return row;
    }

    function Summarizer(dates) {
      const sum = {};
      this.sum = function (date, value) {
        if (sum[date] === undefined) {
          sum[date] = value;
        } else {
          sum[date] += value;
        }
      };
      this.result = function () {
        return dates.map(function (date) {
          return (sum[date] !== undefined) ? sum[date] : 'Totales';
        });
      }

    }

    function dateFormat(date) {
      return [date.getDate(), date.getMonth() + 1].join('/');
    }

    $.getJSON("data.json", { format: "json" })
        .done(function(test) {
            var projection = test.proyeccion;
            var projectedDates = datesInProjection(projection);
            var limits = dateRange(projectedDates);
            var daysRange = getDates(limits.min, limits.max);
            var formattedDates = daysRange.map(dateFormat);
            var name;
            var table = [[]];
            var summarizer = new Summarizer(formattedDates);

            table[0] = formattedDates;
            table[0].unshift('');
            for (name in projection) {
              table.push(getRow(projection, name, daysRange, summarizer));
            }
            table.push(summarizer.result());

            var cols = table.shift();
            var columns = [];
            for (var i = 0; i < cols.length; i++) {
                var obj = {title: cols[i]};
                columns.push(obj);
            }
            var foots = table.pop();
            var tr = $('<tr>');
            for (i = 0; i < foots.length; i++) {
                var td = $('<th>');
                td.html(foots[i]);
                tr.append(td);
            }

            $('#table > tfoot').append(tr);
            $('#table').DataTable({
                data: table,
                columns: columns,
                order: [],
                columnDefs: [
                    { "orderable": false, "targets": 0 }
                ]
            });
        })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });

})();
