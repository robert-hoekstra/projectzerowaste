async function importDataset() {
  const dataset = await d3.dsv(";", "dataset/extraBedrijven.csv");
  const postcodeCollection = await d3.dsv(";", "dataset/PC4_BUURTEN.csv");
  const sbiCollection = await d3.dsv(";", "dataset/sbi_codes.csv");
  const eventCollection = await d3.dsv(";", "dataset/events_amsterdam.csv");
  const postcodeMap = await d3.json("dataset/PC4_BUURTENV2.json");

  
  // remember the regular Object? it would convert keys to string
  // Map keeps the type, so these two are different:


  console.log("postcode", postcodeCollection);
  console.log("data UA", dataset);
  console.log("sbi", sbiCollection);
  console.log("events", eventCollection);
  console.log("kaart", postcodeMap)




  // test



  const headerNames = d3.keys(dataset[0]);

  const week = {
    maandag: headerNames[14],
    dinsdag: headerNames[15],
    woensdag: headerNames[16],
    donderdag: headerNames[17],
    vrijdag: headerNames[18],
    zaterdag: headerNames[19],
    zondag: headerNames[20]
  };


  console.log(week);

  dataset.forEach(element => {
    parseInt(element.ma);
    parseInt(element.di);
    parseInt(element.woe);
    parseInt(element.do);
    parseInt(element.vr);
    parseInt(element.zat);
    parseInt(element.zo);

    const weekTotaal =
      parseInt(element.ma) +
      parseInt(element.di) +
      parseInt(element.woe) +
      parseInt(element.do) +
      parseInt(element.vr) +
      parseInt(element.zat) +
      parseInt(element.zo);


    if (Number.isNaN(weekTotaal)) {
      weekTotaal === 1;
      return weekTotaal;
    }

    sbiCollection.forEach(element2 => {
      if (element.SBI === element2.Code){
        element.BEDRIJFSTYPE = element2.Betekenis
      }
    })
    console.log(element.POSTCODE_NR)


    // dataset.forEach(element => {
    //   if (selectedPostalcode === data.)
    // })

    // // wat voor soort bedrijf:
  //  console.log(element.ZAAKNAAM + " Geregistreerd in postcodegebied: " + element.POSTCODE + " " + " Verwerkt " + weekTotaal + " zakken afval per week" + " Het bedrijfstype is " + element.BEDRIJFSTYPE)
  });
  renderChart(dataset)
}



importDataset();



function renderChart(data1, data2, data3) {
var width = 760;
var height = 600;
var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
        .style("opacity", .9)

var svg =  d3.select("#chart")
.append("svg")
.attr("width", width)
.attr("height", height)

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);
d3.json("dataset/geojson2.json", function(err, geojson) { 
      projection.fitSize([width,height],geojson); // adjust the projection to the features
      // svg.append("path").attr("d", path(geojson)); // draw the 
      
      // features section
      console.log(geojson.features)

      svg.selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", "red")
      .on("mouseover", function(geojson) {      
        div.transition()        
             .duration(200)      
             .style("opacity", .9);      
             div
             .text(geojson.properties.Postcode4)
             .style("left", (d3.event.pageX) + "px")     
             .style("top", (d3.event.pageY - 28) + "px")
             console.log(geojson.properties.Postcode4)

             d3.selectAll("path")
             .attr("d", path)
             .style("fill-opacity", "0.5")

             d3.select(this)
             .attr("d", path)
             .style("fill", "red")
             .style("fill-opacity", "1")

             

             
        
             
    })
    .on("click", function(geojson) {
      let selectedPostalcode = geojson.properties.Postcode4
      let selectedSurface = geojson.properties.Opp_m2

      function postcodecheck(parameter){
        if (parameter === dataset.POSTCODE_NR){
          console.log(dataset.POSTCODE_NR)
        }
      }

      postcodecheck(this)


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

      d3.select("#selectedArea")
      .text("Je hebt postcode " + selectedPostalcode + " geselecteerd")
      d3.select("#postalcode")
      .text("Postcodegebied: " + selectedPostalcode)
      d3.select("#surface")
      .text(selectedSurface + " m2")

      console.log(
        geojson.properties.postcode4
      )



    })
  
      // fade out tooltip on mouse out               
      .on("mouseout", function(geojson) {       
          div.transition()        
             .duration(500)      
             .style("opacity", 1);


          d3.selectAll("path")
          .attr("d", path)
          .style("fill", "rgb(91	121	153	)")
          .style("fill-opacity", "1")

      })
})}



