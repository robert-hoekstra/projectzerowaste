async function importDataset() {
  const dataset = await d3.dsv(";", "dataset/extraBedrijven.csv");
  const sbiCollection = await d3.dsv(";", "dataset/sbi_codes.csv");
  const eventCollection = await d3.dsv(";", "dataset/events_amsterdam.csv");

  let totalMonday = d3.nest()
  .key(function(d) {return d.POSTCODE_NR})
  .rollup(function(v) { return d3.sum(v, function(d) { return d.ma; }); })
  .entries(dataset);

  let totalTuesday = d3.nest()
  .key(function(d) {return d.POSTCODE_NR})
  .rollup(function(v) { return d3.sum(v, function(d) { return d.di; }); })
  .entries(dataset);

  let totalWednesday = d3.nest()
  .key(function(d) {return d.POSTCODE_NR})
  .rollup(function(v) { return d3.sum(v, function(d) { return d.wo; }); })
  .entries(dataset);

  let totalThursday = d3.nest()
  .key(function(d) {return d.POSTCODE_NR})
  .rollup(function(v) { return d3.sum(v, function(d) { return d.do; }); })
  .entries(dataset);

  let totalFriday = d3.nest()
  .key(function(d) {return d.POSTCODE_NR})
  .rollup(function(v) { return d3.sum(v, function(d) { return d.vr; }); })
  .entries(dataset);

  let totalSaturday = d3.nest()
  .key(function(d) {return d.POSTCODE_NR})
  .rollup(function(v) { return d3.sum(v, function(d) { return d.za; }); })
  .entries(dataset);

  let totalSunday = d3.nest()
  .key(function(d) {return d.POSTCODE_NR})
  .rollup(function(v) { return d3.sum(v, function(d) { return d.zo; }); })
  .entries(dataset);

  console.log("monday", totalMonday)
  console.log("tuesday", totalTuesday)
  console.log("wednesday", totalWednesday)
  console.log("thursday", totalThursday)
  console.log("friday", totalFriday)
  console.log("saturday", totalSaturday)
  console.log("sunday", totalSunday)

  

  // console.log("hallo", companyPostalList)

  // remember the regular Object? it would convert keys to string
  // Map keeps the type, so these two are different:

  console.log("data UA", dataset);
  console.log("sbi", sbiCollection);
  console.log("events", eventCollection);

  // test

  // Sectie om te kijken hoe ik door de dataset heen kan itereren.

  // const headerNames = d3.keys(dataset[0]);

  // const week = {
  //   maandag: headerNames[14],
  //   dinsdag: headerNames[15],
  //   woensdag: headerNames[16],
  //   donderdag: headerNames[17],
  //   vrijdag: headerNames[18],
  //   zaterdag: headerNames[19],
  //   zondag: headerNames[20]
  // };

  // einde sectie

  // Uitrekenen wat er per week wordr verwerkt aan afval.
  dataset.forEach(element => {
    parseInt(element.ma);
    parseInt(element.di);
    parseInt(element.woe);
    parseInt(element.do);
    parseInt(element.vr);
    parseInt(element.zat);
    parseInt(element.zo);

    weekTotaal =
      parseInt(element.ma) +
      parseInt(element.di) +
      parseInt(element.woe) +
      parseInt(element.do) +
      parseInt(element.vr) +
      parseInt(element.zat) +
      parseInt(element.zo);

    if (Number.isNaN(weekTotaal)) {
      weekTotaal === 0;
      return weekTotaal;
    }

    element.weekTotaal = weekTotaal;

    sbiCollection.forEach(element2 => {
      if (element.SBI === element2.Code) {
        element.BEDRIJFSTYPE = element2.Betekenis;
      }
    });

    // console.log(element.POSTCODE_NR)

    // dataset.forEach(element => {
    //   if (selectedPostalcode === data.)
    // })

    // // wat voor soort bedrijf:
    //  console.log(element.ZAAKNAAM + " Geregistreerd in postcodegebied: " + element.POSTCODE + " " + " Verwerkt " + weekTotaal + " zakken afval per week" + " Het bedrijfstype is " + element.BEDRIJFSTYPE)
  });
  renderChart(dataset);
}

importDataset();

function renderChart(data1, data2, data3) {
  var width = 760;
  var height = 600;
  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.9);

  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var projection = d3.geoMercator();
  var path = d3.geoPath().projection(projection);
  d3.json("dataset/geojson2.json", function(err, geojson) {
    projection.fitSize([width, height], geojson); // adjust the projection to the features
    // svg.append("path").attr("d", path(geojson)); // draw the

    // features section
    console.log(geojson.features);

    svg
      .selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", "red")
      .on("mouseover", function(geojson) {
        div
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        div
          .text(geojson.properties.Postcode4)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
        //  console.log(geojson.properties.Postcode4)

        d3.selectAll("path")
          .attr("d", path)
          .style("fill-opacity", "0.5");

        d3.select(this)
          .attr("d", path)
          .style("fill", "red")
          .style("fill-opacity", "1");
      })
      .on("click", function(geojson) {
        let selectedPostalcode = geojson.properties.Postcode4;
        let selectedSurface = geojson.properties.Opp_m2;
        let selection = "";
        let weeklyChampionTotal = 0;
        let weeklyChampion = "";
        let postalAreaTotalSelection = 0;

        const companyPostalListTotal = d3
          .nest()
          .key(function(data1) {
            return data1.POSTCODE_NR;
          })
          .rollup(function(v) {
            return v.length;
          })
          .entries(data1);
        console.log(companyPostalListTotal);

        const postalAreaTotal = d3
          .nest()
          .key(function(data1) {
            return data1.POSTCODE_NR;
          })
          .rollup(function(v) {
            return {
              Total: d3.sum(v, function(d) {
                return parseFloat(d.weekTotaal)
                
              })
            };
          })
          .entries(data1);
        console.log("new", postalAreaTotal);

        // Uitlezen hoeveelheid bedrijven in postcode
        companyPostalListTotal.forEach(element => {
          if (selectedPostalcode == element.key) {
            selection = element.value;
            return selection;
          }
        });

        data1.forEach(element => {
          if (selectedPostalcode == element.POSTCODE_NR) {
            if (weeklyChampionTotal < element.weekTotaal) {
              weeklyChampionTotal = element.weekTotaal;
              weeklyChampion = element.ZAAKNAAM;
            }
            // weeklyChampionTotal = element.weekTotaal
          }
          return;
        });

        postalAreaTotal.forEach(element => {
          if (selectedPostalcode == element.key) {
            postalAreaTotalSelection = element.value;
            // weeklyChampionTotal = element.weekTotaal
          }
          return;
        });

        console.log(postalAreaTotalSelection);

        // function postcodecheck(parameter){
        //   if (parameter === dataset.POSTCODE_NR){
        //     console.log(dataset.POSTCODE_NR)
        //   }
        // }

        // postcodecheck(this)

        d3.selectAll("path")
          .classed("selectedPostalcode", false)
          .attr("d", path)
          .style("fill-opacity", "0.1")
          .style("fill", "rgb(91	121	153	)");

        d3.select(this)
          .classed("selectedPostalcode", true)
          .attr("d", path)
          .style("fill", "red")
          .style("fill-opacity", "1");

        d3.select("#selectedArea").text(
          "Je hebt postcode " + selectedPostalcode + " geselecteerd"
        );
        d3.select("#postalcode").text("Postcodegebied: " + selectedPostalcode);
        d3.select("#surface").text(
          (selectedSurface / 1000000).toFixed(3) + " km2"
        );
        d3.select("#postalAreaRatio").text(
          "De ratio van dit gebied is: " +
            ((selectedSurface / postalAreaTotalSelection.Total) / 10000).toFixed(1)
        );
        d3.select("#postalAreaTotal").text(
          "Het totaal aantal vuil deze week: " + postalAreaTotalSelection.Total
        );
        d3.select("#companyCount").text(
          "Er bevinding zich " + selection + " bedrijven in dit gebied"
        );
        d3.select("#weekChampion").text("De boosdoener is " + weeklyChampion);
        d3.select("#weekTotaal").text(
          "Met een verbruik van " + weeklyChampionTotal
        );

        console.log(weeklyChampionTotal);

        console.log(geojson.properties.Postcode4);

        // load bar that will display top 10
        renderBar(geojson.properties.Postcode4);
      })

      // fade out tooltip on mouse out
      .on("mouseout", function(geojson) {
        div
          .transition()
          .duration(500)
          .style("opacity", 1);

        d3.selectAll("path")
          .attr("d", path)
          .style("fill", "rgb(91	121	153	)")
          .style("fill-opacity", "1");
      });
  });
}

// set the dimensions and margins of the graph

function renderBar(parameter) {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 200 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  // set the ranges
  const x = d3
    .scaleBand()
    .range([0, width])
    .padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  // var svg = d3.select("#barchart")
  //     .append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //     .append("g")
  //     .attr("transform",
  //           "translate(" + margin.left + "," + margin.top + ")");

  // get the data
  // d3.dsv(";", "dataset/test.csv"), function(error, data) {
  //   if (error) throw error;

  //   console.log("dit is", data)

  //   // format the data
  //   data.forEach(function(d) {
  //     d.sales = +d.sales;
  //   });

  //   // Scale the range of the data in the domains
  //   x.domain(data.map(function(d) { return d.salesperson; }));
  //   y.domain([0, d3.max(data, function(d) { return d.sales; })]);

  //   // append the rectangles for the bar chart
  //   svg.selectAll(".bar")
  //       .data(data)
  //     .enter().append("rect")
  //       .attr("class", "bar")
  //       .attr("x", function(d) { return x(d.salesperson); })
  //       .attr("width", x.bandwidth())
  //       .attr("y", function(d) { return y(d.sales); })
  //       .attr("height", function(d) { return height - y(d.sales); });

  //   // add the x Axis
  //   svg.append("g")
  //       .attr("transform", "translate(0," + height + ")")
  //       .call(d3.axisBottom(x));

  //   // add the y Axis
  //   svg.append("g")
  //       .call(d3.axisLeft(y));

  // }
}
