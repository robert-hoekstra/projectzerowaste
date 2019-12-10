async function importDataset() {
  const dataset = await d3.dsv(";", "dataset/selectie3.csv");
  const postcodeSet = await d3.dsv(";", "dataset/PC4_BUURTEN.csv");
  console.log(postcodeSet)
  console.log(dataset)

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
    parseInt(element.ma)
    parseInt(element.di)
    parseInt(element.woe)
    parseInt(element.do)
    parseInt(element.vr)
    parseInt(element.zat)
    parseInt(element.zo)

    const weekTotaal = 
    parseInt(element.ma) +
    parseInt(element.di) +
    parseInt(element.woe) +
    parseInt(element.do) +
    parseInt(element.vr) +
    parseInt(element.zat) +
    parseInt(element.zo) 

    if (Number.isNaN(weekTotaal)){
      weekTotaal === 1
      return weekTotaal
    }
    console.log(element.ZAAKNAAM + " Verwerkt " + weekTotaal + " zakken afval per week ")
  });
}
importDataset();
