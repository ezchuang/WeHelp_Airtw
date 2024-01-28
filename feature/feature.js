
const url = 'https://data.moenv.gov.tw/api/v2/aqf_p_01?api_key=4bb6f609-cba3-44fa-949a-45a9d609839c';

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    let records = data.records;
    // 抓取資料發布時間的日期
    let CurrentDate = document.querySelector('#faetureAqiUpdateTime_span')
    let TaiwanDate = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());//使用 Intl.DateTimeFormat，可以指定所需的地區和格式化選項來獲得想要的日期和時間格式
    let [month, day, year] = TaiwanDate.split('/');
    let taiwanDateTrans = `${year}/${month}/${day}`;//模板字串，將原本的10/18/2023轉成2023/10-/8
    CurrentDate.textContent = taiwanDateTrans;
    // 找出資料的時間點，若API publish time的時間沒更新到今日(如publish time = 10/17，今日是10/18)，則直接用publish time的forcasttime顯示資料。不用今日當作基準，因為有可能資料沒有更新。
    function getChineseWeekday(date) {
      const Weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
      return Weekdays[date.getDay()];
    }

    let LatestDataDate = data["records"][0]["publishtime"];
    let DatePart = LatestDataDate.split(" ")[0];
    let LatestDataFormattedDate = DatePart.replace(/-/g, '/');

    let BaseDate = new Date(LatestDataFormattedDate);
    let ForecastDates = [];
    let ForecastDatesMatch = [];   // 確保使用的是 "forecastDates"

    // 計算四天的預測日期
    for (let i = 1; i <= 4; i++) {
      let NewDate = new Date(BaseDate);
      NewDate.setDate(BaseDate.getDate() + i);

      let Formatted = `${(NewDate.getMonth() + 1)}/${NewDate.getDate()} ${getChineseWeekday(NewDate)}`;
      ForecastDates.push(Formatted);  // 確保使用的是 "forecastDates"
    }
    for (let i = 1; i <= 4; i++) {
      let NewDate = new Date(BaseDate);
      NewDate.setDate(BaseDate.getDate() + i);

      let Formatted = `${(NewDate.getMonth() + 1)}/${NewDate.getDate()} ${getChineseWeekday(NewDate)}`;
      let MatchFormatted = `${NewDate.getFullYear()}-${(NewDate.getMonth() + 1).toString().padStart(2, '0')}-${NewDate.getDate().toString().padStart(2, '0')}`;

      ForecastDates.push(Formatted);
      ForecastDatesMatch.push(MatchFormatted);
    }
    let ForecastDate1 = ForecastDates[0];
    let ForecastDate2 = ForecastDates[1];
    let ForecastDate3 = ForecastDates[2];
    let ForecastDate1Match = ForecastDatesMatch[0];
    let ForecastDate2Match = ForecastDatesMatch[1];
    let ForecastDate3Match = ForecastDatesMatch[2];
    let Date1 = document.querySelector('#date1')
    let Date2 = document.querySelector('#date2')
    let Date3 = document.querySelector('#date3')
    Date1.textContent = ForecastDate1;
    Date2.textContent = ForecastDate2;
    Date3.textContent = ForecastDate3;
    let DateMatchs = [ForecastDate1Match, ForecastDate2Match, ForecastDate3Match]
    let Regions = ["北部", "竹苗", "中部", "雲嘉南", "高屏", "宜蘭", "花東", "馬祖", "金門", "澎湖"]
    for (let DateMatch of DateMatchs) {
      for (let Region of Regions) {
        let MatchingRecord = records.find(record => record.forecastdate === DateMatch && record.area === Region);
        let rowIndex = Regions.indexOf(Region);
        let dateIndex = DateMatchs.indexOf(DateMatch) + 1;
        let aqiElement = document.querySelector(`tr:nth-child(${rowIndex + 2}) td[headers="rdate${rowIndex} date${dateIndex} aqi${dateIndex}"] span`);
        let majorpollutantElement = document.querySelector(`tr:nth-child(${rowIndex + 2}) td[headers="rdate${rowIndex} date${dateIndex} index${dateIndex}"]`);       
        if (MatchingRecord) {
          if (aqiElement) {
            aqiElement.textContent = MatchingRecord.aqi || "NA";
            let aqiValue = parseInt(MatchingRecord.aqi);
            if (!isNaN(aqiValue)) {
              if (aqiValue <= 50) {
                aqiElement.classList.add("background-green");
              } else if (aqiValue <= 100) {
                aqiElement.classList.add("background-yellow");
              } else if (aqiValue <= 150) {
                aqiElement.classList.add("background-orange");
              } else if (aqiValue <= 200) {
                aqiElement.classList.add("background-red");
              } else {
                aqiElement.classList.add("background-purple");
              }
            }
          }
          if (majorpollutantElement) {
            majorpollutantElement.textContent = MatchingRecord.majorpollutant || "NA";
          }
        } else {
          if (aqiElement) {
            aqiElement.textContent = "NA";
          }
          if (majorpollutantElement) {
            majorpollutantElement.textContent = "NA";
          }
        }
      }
    }
    let ForcastWord = document.querySelector('.featureDesciprionContent_p');
    let ForcastContent = records[0].content;
    ForcastWord.innerHTML = ForcastContent;
    document.getElementById("loadingScreen").style.display = "none";//網頁最後都會跑這個function，所以可以把loadind畫面加這

  })
  
  .catch(error => {
    console.log('There was a problem with the fetch operation:', error.message);
  });