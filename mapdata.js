const apiKey = "e8dd42e6-9b8b-43f8-991e-b3dee723a52d";

main()

async function main() {
    let data = await fetchAqiData();
    // console.log(data); 
    // getSitenameAndCounty(data);
    getDataBySitename(data);
    triggerInitialSelection();
}

async function fetchAqiData() {
    let resPara = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let requestData = await fetch('https://data.moenv.gov.tw/api/v2/aqx_p_432?&api_key=' + apiKey)
    requestData = await requestData.json()
    return requestData
}

function getDataBySitename(data) {
    let selectElement = document.querySelector('.realtimeAirMonitor_content_right_select_left_select')
    selectElement.addEventListener('change', function(sitename) {
        let selectedSitename = sitename.target.value; // get sitename's value
        // console.log(selectedSitename)
        // get data from json according to sitename
        let dataToShow = data.records.find(record => record.sitename === selectedSitename);
        console.log(dataToShow);
        updateTable(dataToShow);
    });
}

function triggerInitialSelection() {
    let selectElement = document.querySelector('.realtimeAirMonitor_content_right_select_left_select');
    let options = selectElement.options;
    selectElement.value = options[1].value;
    // Dispatching the change event ??
    selectElement.dispatchEvent(new Event('change'));
}

function updateTable(dataToShow) {
    document.querySelector('.publishtime_per_hour_span').innerText = dataToShow.publishtime;
    document.querySelector('.realtimeAirMonitor_content_right_aqi_p').innerText = dataToShow.aqi;
    document.querySelector('.O3_concentration_8_hours_div').innerText = dataToShow.o3_8hr;
    document.querySelector('.O3_concentration_per_hour_div').innerText = dataToShow.o3;
    document.querySelector('.PM25_concentration_average_moving_div').innerText = dataToShow['pm2.5_avg'];
    document.querySelector('.PM25_concentration_per_hour_div').innerText = dataToShow['pm2.5'];
    document.querySelector('.PM10_concentration_average_moving_div').innerText = dataToShow.pm10_avg;
    document.querySelector('.PM10_concentration_per_hour_div').innerText = dataToShow.pm10;
    document.querySelector('.CO_concentration_8_hours_div').innerText = dataToShow.co_8hr;
    document.querySelector('.CO_concentration_per_hour_div').innerText = dataToShow.co;
    document.querySelector('.SO2_concentration_per_hour_div').innerText = dataToShow.so2;
    document.querySelector('.NO2_concentration_per_hour_div').innerText = dataToShow.no2;
    updateAQIStatus(dataToShow.aqi)
}

function updateAQIStatus(aqiValue) {
    let status;
    let color;
    
    if (aqiValue <= 50) {
        status = "Good";
        color = "green";
    } else if (aqiValue <= 100) {
        status = "Moderate";
        color = "yellow";
    } else if (aqiValue <= 150) {
        status = "Unhealthy for sensitive groups";
        color = "orange";
    } else if (aqiValue <= 200) {
        status = "Unhealthy";
        color = "red";
    } else if (aqiValue <= 300) {
        status = "Very Unhealthy";
        color = "purple";
    } else {
        status = "Hazardous";
        color = "maroon";
    }
    
    document.querySelector('.realtimeAirMonitor_content_right_aqi_p').innerText = aqiValue;
    document.querySelector('.air_quality_index').innerText = status;
    document.querySelector('.realtimeAirMonitor_content_right_status_div').style.backgroundColor = color;
}

function callApi() {
    main();
}

// 計算現在到下一個整點的延遲時間
function getDelayToNextHour() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1);
    nextHour.setMinutes(0, 0, 0); // 設定分、秒和毫秒為0
    console.log(now)
    return nextHour - now;
}

// 設定首次呼叫API的延遲?
setTimeout(() => {
    callApi();
    setInterval(callApi, 60 * 60 * 10000); // 設定每小時呼叫API
}, getDelayToNextHour());


// // 计算到下一个5秒的延迟时间
// function getDelayToNextFiveSeconds() {
//     const now = new Date();
//     const nextFiveSeconds = new Date(now);
    
//     // 计算下一个5秒的时间
//     nextFiveSeconds.setSeconds(Math.ceil(now.getSeconds() / 5) * 5);
//     nextFiveSeconds.setMilliseconds(0); // 设置毫秒为0
    
//     return nextFiveSeconds - now;
// }

// // 设置首次调用API的延迟
// setTimeout(() => {
//     callApi();
//     setInterval(callApi, 5000); // 设置每5秒钟调用API
// }, getDelayToNextFiveSeconds());


// const apiKey = "e8dd42e6-9b8b-43f8-991e-b3dee723a52d";

// function fetchAqiData() {
//     fetch('https://data.moenv.gov.tw/api/v2/aqx_p_432?&api_key=' + apiKey, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         getSitenameAndCounty(data);
//         getDataBySitename(data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
//   }
// fetchAqiData()

// function getSitenameAndCounty(data){
//     let sitenames = []
//     let countys = new Set();
//     data.records.forEach(function(records){
//         let sitename = records.sitename;
//         let county = records.county;
//         sitenames.push(sitename);
//         countys.add(county);
//     });
//     let countysArray = Array.from(countys)
//     console.log(sitenames);
//     console.log(countysArray);
// }



