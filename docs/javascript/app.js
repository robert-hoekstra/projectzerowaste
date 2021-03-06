async function importDataset() {
  const dataset = await d3.dsv(";", "dataset/extraBedrijven.csv");
  const sbiCollection = await d3.dsv(";", "dataset/sbi_codes.csv");
  const eventCollection = await d3.dsv(";", "dataset/events_amsterdam.csv");

  // Calculate totals for every postal area based on days (monday, tuesday, wednesday, thursday, friday, saturday, sunday)

  let totalMonday = d3
    .nest()
    .key(function(d) {
      return d.POSTCODE_NR;
    })
    .rollup(function(v) {
      return d3.sum(v, function(d) {
        return d.ma;
      });
    })
    .entries(dataset);

  let totalTuesday = d3
    .nest()
    .key(function(d) {
      return d.POSTCODE_NR;
    })
    .rollup(function(v) {
      return d3.sum(v, function(d) {
        return d.di;
      });
    })
    .entries(dataset);

  let totalWednesday = d3
    .nest()
    .key(function(d) {
      return d.POSTCODE_NR;
    })
    .rollup(function(v) {
      return d3.sum(v, function(d) {
        return d.wo;
      });
    })
    .entries(dataset);

  let totalThursday = d3
    .nest()
    .key(function(d) {
      return d.POSTCODE_NR;
    })
    .rollup(function(v) {
      return d3.sum(v, function(d) {
        return d.do;
      });
    })
    .entries(dataset);

  let totalFriday = d3
    .nest()
    .key(function(d) {
      return d.POSTCODE_NR;
    })
    .rollup(function(v) {
      return d3.sum(v, function(d) {
        return d.vr;
      });
    })
    .entries(dataset);

  let totalSaturday = d3
    .nest()
    .key(function(d) {
      return d.POSTCODE_NR;
    })
    .rollup(function(v) {
      return d3.sum(v, function(d) {
        return d.za;
      });
    })
    .entries(dataset);

  let totalSunday = d3
    .nest()
    .key(function(d) {
      return d.POSTCODE_NR;
    })
    .rollup(function(v) {
      return d3.sum(v, function(d) {
        return d.zo;
      });
    })
    .entries(dataset);

  let collectionTotal = [
    totalMonday,
    totalTuesday,
    totalWednesday,
    totalThursday,
    totalFriday,
    totalSaturday,
    totalSunday
  ];
  console.log(collectionTotal);

  document.getElementById("events").addEventListener("click", function() {
    console.log(eventCollection);
  });
  //  Calculate total rubbish per week by combining all days together.
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
    // Create new column to dataset called weekTotaal
    element.weekTotaal = weekTotaal;
    // Connect SBI number from dataset to description found in sbiCollection
    sbiCollection.forEach(element2 => {
      if (element.SBI === element2.Code) {
        element.BEDRIJFSTYPE = element2.Betekenis;
      }
    });
  });
  // Render map with dataset
  renderChart(dataset, collectionTotal);
}
// End of async function to continue with chaining of d3 methods.
importDataset();

// Render map
function renderChart(data1, data2, data3) {
  var width = 760;
  var height = 600;
  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.9);
  // Create instance of SVG to draw all vallues to. Svg gets created under the #chart element.
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  // Use the geomercator as projection.
  // Paths and projections gets adjusted and fitted to size to have a proper projection of Amsterdam
  var projection = d3.geoMercator();
  var path = d3.geoPath().projection(projection);
  d3.json("dataset/geojson2.json", function(err, geojson) {
    projection.fitSize([width, height], geojson); // adjust the projection to the features
    // svg.append("path").attr("d", path(geojson));
    // Draw all the areas as individuel components in the map.
    svg
      .selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", "#002566")
      .on("mouseover", function(geojson) {
        div
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        div
          .text(geojson.properties.Postcode4) // Add the selected postalarea to tiptool
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");

        d3.selectAll("path")
          .attr("d", path)
          .style("fill-opacity", "0.5");

        d3.select(this)
          .attr("d", path)
          .style("fill", "#00348d")
          .style("fill-opacity", "1");
      })
      //Add functionality to write information to right section and give feedback to user which area is selected.
      .on("click", function(geojson) {
        let selectedPostalcode = geojson.properties.Postcode4;
        let selectedSurface = geojson.properties.Opp_m2;
        let selection = "";
        let weeklyChampionTotal = 0;
        let weeklyChampion = "";
        let postalAreaTotalSelection = 0;

        // Total of companies per postal area
        const companyPostalListTotal = d3
          .nest()
          .key(function(data1) {
            return data1.POSTCODE_NR;
          })
          .rollup(function(v) {
            return v.length;
          })
          .entries(data1);
        // calculate amount of total rubbish for postal area
        const postalAreaTotal = d3
          .nest()
          .key(function(data1) {
            return data1.POSTCODE_NR;
          })
          .rollup(function(v) {
            return {
              Total: d3.sum(v, function(d) {
                return parseFloat(d.weekTotaal);
              })
            };
          })
          .entries(data1);

        // Select companies that shares selected postalcode, retrieve company and return.
        companyPostalListTotal.forEach(element => {
          if (selectedPostalcode == element.key) {
            selection = element.value;
            return selection;
          }
        });
        // Calculate and Select the highest producer of rubbish within postal area.
        data1.forEach(element => {
          if (selectedPostalcode == element.POSTCODE_NR) {
            if (weeklyChampionTotal < element.weekTotaal) {
              weeklyChampionTotal = element.weekTotaal;
              weeklyChampion = element.ZAAKNAAM;
            }
          }
          return;
        });
        postalAreaTotal.forEach(element => {
          if (selectedPostalcode == element.key) {
            postalAreaTotalSelection = element.value;
          }
          return;
        });

        d3.selectAll("path")
          .classed("selectedPostalcode", false)
          .attr("d", path)
          .style("fill-opacity", "0.1")
          .style("fill", "rgb(91	121	153	)");

        d3.select(this)
          .classed("selectedPostalcode", true)
          .attr("d", path)
          .style("fill", "#f5f5f5")
          .style("fill-opacity", "1");

        d3.select("#selectedArea").text(
          "Je hebt postcode " + selectedPostalcode + " geselecteerd"
        );
        d3.select("#postalcode").text(selectedPostalcode);
        d3.select("#surface").text(
          (selectedSurface / 1000000).toFixed(3) + " km2"
        );
        d3.select("#postalAreaRatio").text(
          (
            selectedSurface /
            selection /
            postalAreaTotalSelection.Total /
            1000
          ).toFixed(2)
        );
        d3.select("#postalAreaTotal").text(postalAreaTotalSelection.Total);
        d3.select("#companyCount").text(selection);
        d3.select("#weekChampion").text(weeklyChampion);
        d3.select("#weekTotaal").text(weeklyChampionTotal);
        // load bar that will display top 10
        // renderBar(geojson.properties.Postcode4);
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
// Draw barchart for right section in application

// function renderBar(parameter) {
//   const margin = { top: 20, right: 20, bottom: 30, left: 40 },
//     width = 200 - margin.left - margin.right,
//     height = 200 - margin.top - margin.bottom;

//   // set the ranges
//   const x = d3
//     .scaleBand()
//     .range([0, width])
//     .padding(0.1);
//   const y = d3.scaleLinear().range([height, 0]);

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
