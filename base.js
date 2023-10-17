indexMain()
var siteResultGlobal; //cite data global variable

async function indexMain(){
    let responeData = await classifySite()
    siteResultGlobal = responeData
    insertMonitoringStation("臺中市") //預設為臺中市, 網頁剛載入時會執行一次
    
    
}



// 生成觀測站資料 輸入縣市名稱為自動生成該縣市的觀測站資料在 select 中
function insertMonitoringStation(stationName){
    let monitoringStationSelect = document.querySelector(".realtimeAirMonitor_content_right_select_left_select")
    monitoringStationSelect.innerHTML = ""
    let option = document.createElement("option")
    option.value = ""
    option.innerText = "請選擇監測站"
    monitoringStationSelect.appendChild(option)
    let stationArr = siteResultGlobal[stationName]

  
    stationArr.forEach(element=>{
        let option = document.createElement("option")
        option.value = element
        option.innerText = element
        monitoringStationSelect.appendChild(option)
    })
}




// 站點資料請呼叫 async function classifySite()
// 請注意 因需要 fetch API，所以 classifySite() return 的結果為非同步資料
// 請於對應位置加上 call back or await 來處理


function getParasSite(){
    let queryCluster = {
        "originUrl" : "https://data.moenv.gov.tw/api/v2/aqx_p_07",
        "language" : null,
        "offset" : null,
        "limit" : null,
        "apiKey" : "e8dd42e6-9b8b-43f8-991e-b3dee723a52d",
    }

    return queryCluster
}


function combineUrlSite(queryCluster){
    let url = `${queryCluster.originUrl}?api_key=${queryCluster.apiKey}`

    if (queryCluster.offset){
        url += `&offset=${queryCluster.offset}`
    }
    if (queryCluster.limit){
        url += `&limit=${queryCluster.limit}`
    }

    return url
}


async function getAPISite(){
    let queryCluster = getParasSite()
    let url = combineUrlSite(queryCluster)

    let data = await fetch(url)
    data = await data.json()

    return data
}


async function classifySite(){
    let siteDataRaw = await getAPISite()
    let siteData = {}
    siteDataRaw.records.forEach(element => {
        if (! Object.keys(siteData).includes(element.county)){
            siteData[element.county] = [element.sitename]
        }else{
            siteData[element.county].push(element.sitename)
        }
    })

    return siteData
}