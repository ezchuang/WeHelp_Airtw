siteMain()
var siteResultGlobal; //cite data global variable

async function siteMain(){
    let responeData = await classifySite()
    siteResultGlobal = responeData
    insertLocationDataIntoSelect(siteResultGlobal)
    
    //add event listener for generation station select
    document.getElementById("locationCity").addEventListener("change",async e => {
        // let responeData = await classifySite()
        // let arr = responeData[e.target.value]
        let arr = siteResultGlobal[e.target.value]
        insertMonitoringStation(arr)
    })
}

// previous/site.js 生成縣市資料
//siteData:Dict
function insertLocationDataIntoSelect(siteData){
    let locationSelect = document.querySelector("#locationCity")
    locationSelect.innerHTML = ""
    let option = document.createElement("option")
    option.value = ""
    option.innerText = "請選擇縣市"
    locationSelect.appendChild(option)

    siteData = Object.keys(siteData)
    siteData.forEach(element => {
        let option = document.createElement("option")
        option.value = element
        option.innerText = element
        locationSelect.appendChild(option)
    })

}

// previous/site.js 生成觀測站資料
function insertMonitoringStation(stationArr){
    let monitoringStationSelect = document.querySelector("#monitoringStation")
    monitoringStationSelect.innerHTML = ""
    let option = document.createElement("option")
    option.value = ""
    option.innerText = "請選擇監測站"
    monitoringStationSelect.appendChild(option)

  
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