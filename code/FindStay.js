module.exports.function = function findStay (searchKeyword, popularKeyword, category, priceLow, priceHigh, review, wish, stayId, dateInterval) {
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

  // 숙소 상세페이지에서 input-view 로 dateInterval 재설정하고 검색할 때, stayId를 전달받아 특정 숙소에 대한 결과값 산출
  if (stayId) {
    var url = 'http://api.yanoljamvp.com/api/stay/detail/'+stayId+'/?format=json&request='+start+'&requestCheckOut='+end;
  
  } else {
    // stayId를 전달받지 않고, 일반 발화에 의해 결과값 산출
    var url = 'http://api.yanoljamvp.com/api/stay/?format=json&requestCheckIn='+start+'&requestCheckOut='+end;
    // 강남역, 역삼역, 논현동 등과 같은 searchKeyword를 전달받는 경우
    if (searchKeyword) {
      url = url + '&searchKeyword=' + searchKeyword
    }
    // 수영장, 파티룸, 신축, 리모델링 같은 popularKeyword를 전달받는 경우
    if (popularKeyword) {
      url = url + '&popularKeyword=' + popularKeyword
    }
    // 모텔, 호텔, 리조트, 펜션, 풀빌라, 게스트하우스 중 1개 데이터를 전달받는 경우
    if (category) {
      url = url + '&category=' + category
    }
    // 예약가 낮은 순 정렬 시, priceLow = true로 데이터 전달받는 경우 
    if (priceLow) {
      url = url + '&priceLow=' + priceLow
    }
    // 예약가 높은 순 정렬 시, priceHigh = true로 데이터 전달받는 경우
    if (priceHigh) {
      url = url + '&priceHigh=' + priceHigh
    }
    // 좋아요 많은 순 정렬 시, wish = true로 데이터 전달받는 경우
    if (wish) {
      url = url + '&wish=' + wish
    }
    // 리뷰 많은 순 정렬 시, review = true로 데이터 전달받는 경우
    if (review) {
      url = url + '&review=' + review
    }
  }

  var response = http.getUrl(url, {format: 'json'});

  var result = [];
  // stayId 와 dateInterval 데이터만 전달받은 경우 숙소 1개 객체에 대한 데이터 전달
  if (stayId) {
    stayResponse = response
    roomsResponse = http.getUrl('http://api.yanoljamvp.com/api/stay/'+stayId+'/room/?format=json&requestCheckIn='+start+'&requestCheckOut='+end, {format: 'json'});
    var roomsResult = [];
    // 해당 숙소에서 방의 최저 대실 예약가 산출 목적
    var minHoursPrice = roomsResponse[0].hoursPrice
    // 해당 숙소에서 방의 최저 숙박 예약가 산출 목적
    var minDaysPrice = roomsResponse[0].daysPrice
    // stay 객체에 전달할 숙박 체크인 가능시간
    var stayDaysCheckIn = roomsResponse[0].daysCheckIn

    // 여러 방 객체 정보를 roomsResult에 저장(json 형태)
    for (j=0; j < roomsResponse.length; j++) {
      // roomUrlImage를 core.BaseImage 형태로 변환
      var roomUrlImage = roomsResponse[j].urlImage[0]
      baseImages = []
      for(k=0; k<roomsResponse[j].urlImage.length; k++) {
        baseImages.push({url : roomsResponse[j].urlImage[k]})
      }
      // room 객체 데이터 각 변수에 저장
      roomsResult.push({
        stayId : roomsResponse[j].stayId, // int
        stayName : roomsResponse[j].stay, // string
        roomName : roomsResponse[j].name, // string
        roomId : roomsResponse[j].roomId, // int
        roomUrlImages : baseImages, // array
        roomUrlImage : roomUrlImage, // string
        roomHoursPrice : roomsResponse[j].hoursPrice, // string
        roomHoursAvailable : roomsResponse[j].hoursAvailable, // int
        roomDaysCheckIn: roomsResponse[j].daysCheckIn, // int
        roomDaysPrice : roomsResponse[j].daysPrice, // string
        roomStandardPersonnel : roomsResponse[j].standardPersonnel, //int
        roomMaximumPersonnel : roomsResponse[j].maximumPersonnel, // int
        roomRentalAvailable : roomsResponse[j].rentalAvailable, // boolean
        roomStayAvailable : roomsResponse[j].stayAvailable, // boolean
        roomSaleHoursPrice : roomsResponse[j].saleHoursPrice, // string
        roomSaleDaysPrice :roomsResponse[j].saleDaysPrice, // string
        dateInterval : dateInterval,
      })

      if(minHoursPrice > roomsResponse[j].hoursPrice){
        minHoursPrice = roomsResponse[j].hoursPrice
      }
      if(minDaysPrice > roomsResponse[j].daysPrice){
        minDaysPrice = roomsResponse[j].daysPrice
      }
      if(roomsResponse[j].hoursAvailable > 0 && stayHoursAvailable == undefined) {
        var stayHoursAvailable = roomsResponse[j].hoursAvailable
      }
      if(roomsResponse[j].saleHoursPrice==true && staySaleHoursPrice == undefined) {
        var staySaleHoursPrice = roomsResponse[j].saleHoursPrice
      }
      if(roomsResponse[j].saleDaysPrice==true && staySaleDaysPrice == undefined) {
        var staySaleDaysPrice = roomsResponse[j].saleDaysPrice
      }
    }
    if (stayHoursAvailable == undefined){
      var stayHoursAvailable = 0
    }
    if (staySaleHoursPrice == undefined){
      var staySaleHoursPrice = ""
    }
    if (staySaleDaysPrice == undefined){
      var staySaleDaysPrice = ""
    }
    
    // Stay structure에 반환할 result 변수에 stay, room 객체 정보 전달
    result.push({
      stayLocation: stayResponse.location, // string
      stayIntroduce: stayResponse.introduce, // array
      stayName: stayResponse.name,  // string
      stayId: stayResponse.stayId, // integer
      stayMainUrlImage: stayResponse.mainImage, // string
      stayHoursPrice : minHoursPrice, // string
      stayHoursAvailable : stayHoursAvailable, // int
      stayDirections : stayResponse.directions, // string
      stayDaysPrice : minDaysPrice, // string
      staySaleDaysPrice : staySaleDaysPrice, // string
      staySaleHoursPrice : staySaleHoursPrice, // string
      stayDaysCheckIn : stayDaysCheckIn, // int
      dateInterval : dateInterval, 
      room: roomsResult,
    })
    return result;

  } else {
    // 일반 발화에 의해 특정 조건에 적합한 여러 숙소 객체의 데이터 제공
    for (var i=0; i<response.length; i++) {
      stayResponse = http.getUrl('http://api.yanoljamvp.com/api/stay/detail/'+response[i].stayId+'/?format=json&requestCheckIn='+start+'&requestCheckOut='+end, {format:'json'});      
      roomsResponse = http.getUrl('http://api.yanoljamvp.com/api/stay/'+response[i].stayId+'/room/?format=json&requestCheckIn='+start+'&requestCheckOut='+end, {format: 'json'});  
      
      var roomsResult = [];
      
      for (j=0; j < roomsResponse.length; j++) {
        // roomUrlImage를 core.BaseImage 형태로 변환
        var roomUrlImage = roomsResponse[j].urlImage[0]
        baseImages = []
        for(k=0; k<roomsResponse[j].urlImage.length; k++) {
          baseImages.push({url : roomsResponse[j].urlImage[k]})
        }
        // room 객체 데이터 각 변수에 저장
        roomsResult.push({
          stayId : roomsResponse[j].stayId, // int
          stayName : roomsResponse[j].stay, // string
          roomName : roomsResponse[j].name, // string
          roomId : roomsResponse[j].roomId, // int
          roomUrlImages : baseImages, // array
          roomUrlImage : roomUrlImage, // string
          roomHoursPrice : roomsResponse[j].hoursPrice, // string
          roomHoursAvailable : roomsResponse[j].hoursAvailable, // int
          roomDaysCheckIn: roomsResponse[j].daysCheckIn, // int
          roomDaysPrice : roomsResponse[j].daysPrice, // string
          roomStandardPersonnel : roomsResponse[j].standardPersonnel, //int
          roomMaximumPersonnel : roomsResponse[j].maximumPersonnel, // int
          roomRentalAvailable : roomsResponse[j].rentalAvailable, // boolean
          roomStayAvailable : roomsResponse[j].stayAvailable, // boolean
          roomSaleHoursPrice : roomsResponse[j].saleHoursPrice, // string
          roomSaleDaysPrice :roomsResponse[j].saleDaysPrice, // string
          dateInterval : dateInterval,
        })
      }
      // 반환할 result 변수에 stay, room 객체 정보 전달
      result.push({
        stayLocation: stayResponse.location, // string
        stayIntroduce: stayResponse.introduce, // array
        stayName: response[i].stay,  // string
        stayId: response[i].stayId, // integer
        stayMainUrlImage: response[i].mainImage, // string
        stayHoursPrice : response[i].hoursPrice, // string
        stayHoursAvailable : response[i].hoursAvailable, // int
        stayDirections : response[i].directions, // string
        stayDaysPrice : response[i].daysPrice, // string
        staySaleDaysPrice : response[i].saleDaysPrice, // string
        staySaleHoursPrice : response[i].saleHoursPrice, // string
        stayDaysCheckIn : response[i].daysCheckIn, // int
        dateInterval : dateInterval, 
        room: roomsResult,
      })
    }
    return result;
  }
}