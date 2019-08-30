module.exports.function = function selectRoom (roomId, dateInterval) {
  var http = require('http')
  var console = require('console')
  var dates = require('dates')

  console.log("dateInterval: "+dateInterval);

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

  var response = http.getUrl('http://api.yanoljamvp.com/api/stay/room/detail/'+roomId+'/?format=json&requestCheckIn='+start+'&requestCheckOut='+end, {format: 'json'})
  
  if (response.hoursAvailable == 0){
    roomRentalAvailable = false
  }
  else{
    roomRentalAvailable = response.rentalAvailable
  }

  var roomUrlImage = response.urlImage[0]

  baseImages = []
  for(i=0; i<response.urlImage.length; i++) {
    baseImages.push({url : response.urlImage[i]})
  }
  

  return {
    stayId : response.stayId,
    stayName: response.stay, // string
    roomName: response.name, // string
    roomId: response.roomId, // integer
    roomUrlImage : roomUrlImage, // string
    roomUrlImages: baseImages, // viv.core.BaseImage
    roomHoursPrice: response.hoursPrice, // string
    roomHoursAvailable: response.hoursAvailable, // integer
    roomDaysPrice: response.daysPrice, // string
    roomSaleDaysPrice: response.saleDaysPrice, // string
    roomSaleHoursPrice: response.saleHoursPrice, // string
    roomDaysCheckIn: response.daysCheckIn, // integer
    roomDaysCheckOut: response.daysCheckOut, // integer
    roomHoursUntil: response.hoursUntil, // integer
    roomRentalAvailable: roomRentalAvailable, //boolean
    roomStayAvailable: response.stayAvailable,// boolean
    roomReservedList: response.reservedList, // array
    dateInterval : dateInterval,
  }
}



        


          
