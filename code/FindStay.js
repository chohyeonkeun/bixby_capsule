module.exports.function = function findStay (keyword, category, priceLow, priceHigh,review, wish, dateInterval) {
  var http = require('http')
  var console = require('console')
  var dates = require('dates')

  // start = '2019-08-22+00:00:00'
  start = dates.ZonedDateTime.fromDate(dateInterval.start).getDateTime().date
  startYear = String(start.year);
  if (String(start.month).length == 1){
    startMonth = "0"+String(start.month);
  }
  else{
    startMonth = String(start.month);
  }
  if (String(start.day).length == 1){
    startDay = "0"+String(start.day);
  }
  else {
    startDay = String(start.day);
  }
  start = startYear + '-' + startMonth + '-' + startDay + '+00:00:00'

  // end = '2019-08-23+00:00:00'
  end = dates.ZonedDateTime.fromDate(dateInterval.end).getDateTime().date
  endYear = String(end.year);
  if (String(end.month).length == 1){
    endMonth = "0"+String(end.month);
  }
  else{
    endMonth = String(end.month);
  }
  if (String(end.day).length == 1){
    endDay = "0"+String(end.day);
  }
  else {
    endDay = String(end.day);
  }
  end = endYear + '-' + endMonth + '-' + endDay + '+00:00:00'

  console.log(start)
  console.log(end)

  var url = 'http://api.yanoljamvp.com/api/stay/?requestCheckIn='+start+'&requestCheckOut='+end;
  if (keyword) {
    url = url + '&searchKeyword=' + keyword
  }
  if (category) {
    url = url + '&category=' + category
  }
  if (priceLow) {
    url = url + '&priceLow=' + priceLow
  }
  if (priceHigh) {
    url = url + '&priceHigh=' + priceHigh
  }
  if (wish) {
    url = url + '&wish=' + wish
  }
  if (review) {
    url = url + '&review=' + review
  }
  console.log(url)

  var response = http.getUrl(url, {format: 'json'});
  
  console.log(response)

  var result = [];
  const staysInfo = response.parsed
  console.log(staysInfo)
  for (var i=0; i<staysInfo.length; i++) {
    result.push({
      stayName: staysInfo[i].name,  // string
      stayId: staysInfo[i].stayId, // integer
      stayMainUrlImage: staysInfo[i].mainImage, // string
      stayHoursPrice : staysInfo[i].hoursPrice,
      stayHoursAvailable : staysInfo[i].hoursAvailable,  
      stayDirections : staysInfo[i].directions,
      stayDaysPrice : staysInfo[i].daysPrice,
      staySaleDaysPrice : staysInfo[i].saleDaysPrice,
      staySaleHoursPrice : staysInfo[i].saleHoursPrice,
      stayDaysCheckIn : staysInfo[i].daysCheckIn,
      dateInterval : {
        start: start,
        end: end
      }
    })
  }
  console.log(result)
  return result;
}