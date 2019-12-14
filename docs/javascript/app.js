async function importDataset() {
  const dataset = await d3.dsv(";", "dataset/selectie3.csv");
  const postcodeSet = await d3.dsv(";", "dataset/PC4_BUURTEN.csv");
  const sbiCollection = await d3.dsv(";", "dataset/sbi_codes.csv");

  
  // remember the regular Object? it would convert keys to string
  // Map keeps the type, so these two are different:


  console.log("postcode", postcodeSet);
  console.log("data UA", dataset);
  console.log("sbi", sbiCollection);



  const headerNames = d3.keys(dataset[0]);

  const week = {
    maandag: headerNames[11],
    dinsdag: headerNames[12],
    woensdag: headerNames[13],
    donderdag: headerNames[14],
    vrijdag: headerNames[15],
    zaterdag: headerNames[16],
    zondag: headerNames[17]
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
    // // wat voor soort bedrijf:
  //  console.log(element.ZAAKNAAM + " Geregistreerd in postcodegebied: " + element.POSTCODE + " " + " Verwerkt " + weekTotaal + " zakken afval per week" + " Het bedrijfstype is " + element.BEDRIJFSTYPE)
  });
  renderChart(dataset)
}


importDataset();


function renderChart(data1, data2, data3) {
var width = 900;
var height = 500;

var svg = d3.select("body")
  .append("svg")
  .attr("width",width)  // apply width,height to svg
  .attr("height",height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);
console.log(
d3.json("dataset/PC4_BUURTEN.json", function(err, geojson) { 
      projection.fitSize([width,height],geojson); // adjust the projection to the features
      svg.append("path").attr("d", path(geojson)); // draw the features
      console.log(data1)

}))}



