module.exports.function = function selectStay (keyword, category) {
  var http = require('http')
  var console = require('console')
  var dates = require('dates')


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
  console.log(url)

  var response = http.getUrl(url, {format: 'json'});
  
  const staysInfo = response.parsed

  let result = []
  for(var i = 0; i < staysInfo.length; i++){    
    // 숙소 이름을 keyword로 하여 input 으로 받아올 때, 그 이름과 일치하는 객체의 stayId를 받아온다. --> stayId에 대한 방 전체 리스트를 가져오기 위함
    if (keyword == staysInfo[i].name) {
      stayId = staysInfo[i].stayId
    }
  }
  
  response = http.getUrl('api.yanoljamvp.com/api/stay/detail/'+stayId+'/', {format: 'json'})

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
      start: dates.ZonedDateTime.fromDate(dateInterval.start).getDateTime().date,
      end: dates.ZonedDateTime.fromDate(dateInterval.end).getDateTime().date
    }
  }


  return result;
}