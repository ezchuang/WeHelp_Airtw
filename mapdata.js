





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



