module.exports.function = function selectStay (stayId, startDate, endDate) {
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


  var response = http.getUrl('api.yanoljamvp.com/api/stay/detail/'+stayId+'/', {format: 'json'})

  const stayInfo = response.parsed

  roomResponse = http.getUrl('api.yanoljamvp.com/api/stay/'+stayId+'/room/?requestCheckIn='+start+'&requestCheckOut='+end, {format: 'json'});
  
  const roomsInfo = roomResponse.parsed
  
  var roomsResult = [];
  for (i=0; i < roomsInfo.length; i++) {
    roomsResult.push({
      roomName : roomsInfo[i].name,
      roomId : roomsInfo[i].roomId,
      roomUrlImage : roomsInfo[i].urlImage,
      roomHoursPrice : roomsInfo[i].hoursPrice,
      roomHoursAvailable : roomsInfo[i].hoursAvailable,
      roomDaysPrice : roomsInfo[i].daysPrice,
      roomStandardPersonnel : roomsInfo[i].standardPersonnel,
      roomMaximumPersonnel : roomsInfo[i].maximumPersonnel,
      roomRentalAvailable : roomsInfo[i].rentalAvailable,
      roomStayAvailable : roomsInfo[i].stayAvailable,
    })
  }
  console.log(roomsResult);

  result = {
    stayId : stayInfo.stayId,
    stayLocation : stayInfo.location,
    stayName : stayInfo.name,
    category : stayInfo.category,
    stayMainImage : stayInfo.mainImage,
    stayIntroduce : stayInfo.introduce,
    room : roomsResult,
    dateInterval : {
      start: start,
      end: end,
    } 
  }


  return result;
}