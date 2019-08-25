module.exports.function = function selectRoom (stayName, roomName) {
  var http = require('http')
  var console = require('console')
  var dates = require('dates')

  var response = http.getUrl('http://api.yanoljamvp.com/api/stay/',{
    format: 'json',
    query: {
      keyword: stayName,
      requestCheckIn : start,
      requestCheckOut : end,
    }
  })
  const staysInfo = response.parsed
  for(var i = 0; i < staysInfo.length; i++){
    if (staysInfo[i].stay == stayName) {
      var stayId = staysInfo[i].stayId
    }
  }

  response = http.getUrl('http://api.yanoljamvp.com/api/stay/{stayId}/room/', {
    format: 'json',
    query: {
      stayId : stayId,
    }  
  })
  const roomsInfo = response.parsed
  for (i = 0; i < response.length; i++){
    if (roomsInfo[i].name == roomName){
      var roomId = roomsInfo[i].roomId
    }
  }

  var response = http.getUrl('api.yanoljamvp.com/api/stay/room/detail/<roomId>/', {
    format: 'json',
    query: {
      roomId : roomId,
    }
  })
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
  }
}