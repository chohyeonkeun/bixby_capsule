module.exports.function = function selectRoom (roomId, startDate, endDate) {
  var http = require('http')
  var console = require('console')
  var dates = require('dates')

  // start = '2019-08-22+00:00:00'
  start = dates.ZonedDateTime.fromDate(startDate.date).getDateTime().date
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
  end = dates.ZonedDateTime.fromDate(endDate.date).getDateTime().date
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

  var response = http.getUrl('api.yanoljamvp.com/api/stay/room/detail/'+roomId+'/?requestCheckIn='+start+'&requestCheckOut='+end, {format: 'json'})
  
  const roomInfo = response.parsed
  
  if (roomInfo.hoursAvailable == 0){
    roomRentalAvailable = false
  }
  else{
    roomRentalAvailable = roomInfo.rentalAvailable
  }

  return {
    stayName: roomInfo.stay, // string
    roomName: roomInfo.name, // string
    roomId: roomInfo.roomId, // integer
    roomUrlImage : roomInfo.urlImage[0], // string
    roomUrlImages: roomInfo.urlImage, // array
    roomHoursPrice: roomInfo.hoursPrice, // string
    roomHoursAvailable: roomInfo.hoursAvailable, // integer
    roomDaysPrice: roomInfo.daysPrice, // string
    roomSaleDaysPrice: roomInfo.saleDaysPrice, // string
    roomSaleHoursPrice: roomInfo.saleHoursPrice, // string
    roomDaysCheckIn: roomInfo.daysCheckIn, // integer
    roomDaysCheckOut: roomInfo.daysCheckOut, // integer
    roomHoursUntil: roomInfo.hoursUntil, // integer
    roomRentalAvailable: roomRentalAvailable, //boolean
    roomStayAvailable: roomInfo.stayAvailable,// boolean
    roomReservedList: roomInfo.reservedList, // array
    dateInterval : {
      start: start,
      end: end,
    } 
  }
}