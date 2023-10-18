//網頁主要架構動態生成
createRight();

//新增監聽事件讓使用者選擇觀測站時，觀測站的資料會跟著改變 (尚未完成)
document.querySelector(".realtimeAirMonitor_content_right_select_left_select").addEventListener("change", e =>{
  let stationName = e.target.value //onchange 觀測站名稱
  console.log(stationName)

  //這邊可以放入生成 觀測站資料的 function
  
})


asyncMain(); 
var siteResultGlobal; //site data global variable, 這個變數是各縣市觀測站的資料 key 縣市：value 觀測站名稱array

//主要處理網頁生成動態處理的地方
async function asyncMain(){
    let responeData = await classifySite()
    siteResultGlobal = responeData
    insertMonitoringStation("臺北市") //預設為臺北市, 網頁剛載入時會執行一次
}



let paths = document.querySelectorAll("path");

paths.forEach(function(path){
  path.addEventListener("click", function(e){//e事件參數跟function一起進來
      let tagname = this.getAttribute("data-name"); 
      console.log(tagname);
      createRight(tagname);

    });
});


function createRight(tagname){

    // 外層容器 div
    let contentRightDiv = document.getElementById("contentRightDiv");
    contentRightDiv.innerHTML="";

    // 外層容器 div
    let newDiv = document.createElement("div");
    newDiv.classList.add("realtimeAirMonitor_content_rightdown_div");

    // 建立上半部 div
    let upperDiv = document.createElement("div");
    upperDiv.classList.add("realtimeAirMonitor_content_rightup_div");

    // 建立上半部分的提示信息 span
    let upperSpan = document.createElement("span");
    upperSpan.classList.add("r-16");
    upperSpan.textContent = "請點擊縣市地圖並使用下方搜尋功能查詢";

    // 建立下拉框容器 div
    let selectDiv = document.createElement("div");
    selectDiv.classList.add("realtimeAirMonitor_content_rightup_select_div");

    // 建立城市名 span
    let citySpan = document.createElement("span");
    citySpan.classList.add("b-20");
    citySpan.textContent = tagname;

    // 建立下拉框 select
    let selectElement = document.createElement("select");
    selectElement.classList.add("realtimeAirMonitor_content_right_select_left_select", "r-16");

    // 建立下拉框選項
    let optionElement = document.createElement("option");
    optionElement.value = "";
    optionElement.textContent = "請選擇觀測站";

    // 合併上半部
    selectElement.appendChild(optionElement);
    selectDiv.appendChild(citySpan);
    selectDiv.appendChild(selectElement);
    upperDiv.appendChild(upperSpan);
    upperDiv.appendChild(selectDiv);


    // 建立下半部分 div
    let downDiv = document.createElement("div");
    downDiv.classList.add("realtimeAirMonitor_content_rightdown_div");

    // 建立時間 div
    let resultTimeDiv = document.createElement("div");
    resultTimeDiv.classList.add("realtimeAirMonitor_content_rightdown_new_resultTime_div");

    let resultTimeSpan1 = document.createElement("span");
    resultTimeSpan1.classList.add("r-16");
    resultTimeSpan1.textContent = "發佈時間：";

    let resultTimeSpan2 = document.createElement("span");
    resultTimeSpan2.classList.add("r-16");
    resultTimeSpan2.textContent = " YYYY/MM/DD hh:mm:ss";

    resultTimeDiv.appendChild(resultTimeSpan1);
    resultTimeDiv.appendChild(resultTimeSpan2);

    // 建立AQI 信息的 div
    let aqiDiv = document.createElement("div");
    aqiDiv.classList.add("realtimeAirMonitor_content_rightdown_new_aqi_div");

    let aqiCitySpan = document.createElement("span");
    aqiCitySpan.classList.add("b-25");
    aqiCitySpan.textContent = "台北市/中正";

    let aqiCircleDiv = document.createElement("div");
    aqiCircleDiv.classList.add("realtimeAirMonitor_content_rightdown_new_aqi_circle_div");

    let br = document.createElement("br");
    
    let createTextNode = document.createTextNode("AQI");

    let aqiCircleSpan1 = document.createElement("span");
    aqiCircleSpan1.classList.add("r-14");
    aqiCircleSpan1.textContent = "空氣污染指標";
    aqiCircleSpan1.appendChild(br);
    aqiCircleSpan1.appendChild(createTextNode);
    
    let aqiCircleSpan2 = document.createElement("span");
    aqiCircleSpan2.classList.add("b-50");
    aqiCircleSpan2.textContent = "95";

    let aqiCircleSpan3 = document.createElement("span");
    aqiCircleSpan3.classList.add("r-14");
    aqiCircleSpan3.textContent = "普通";

    aqiCircleDiv.appendChild(aqiCircleSpan1);
    aqiCircleDiv.appendChild(aqiCircleSpan2);
    aqiCircleDiv.appendChild(aqiCircleSpan3);

    aqiDiv.appendChild(aqiCitySpan);
    aqiDiv.appendChild(aqiCircleDiv);

    // 建立指標 div
    let tableDiv = document.createElement("div");
    tableDiv.classList.add("realtimeAirMonitor_content_rightdown_table_div");

    // 建立表格
    let tableElement = document.createElement("table");

    //O3
    //  建立 O3 行
    let o3Row = document.createElement("tr");
    o3Row.classList.add("realtimeAirMonitor_content_rightdown_table_o3_div");
    // 建立 O3 
    let o3Th = document.createElement("th");
    o3Th.setAttribute("rowspan", "2");
    o3Th.setAttribute("scope", "row");

    let o3Sub = document.createElement("sub");
    o3Sub.textContent = "3";

    let o3P1 = document.createElement("p");
    o3P1.classList.add("tr-b-25");
    o3P1.textContent = "O";
    o3P1.appendChild(o3Sub);

    let o3P2 = document.createElement("p");
    o3P2.classList.add("tr-b-16");
    o3P2.textContent = "臭氧";

    o3Th.appendChild(o3P1);
    o3Th.appendChild(o3P2);
    o3Row.appendChild(o3Th);

    // 建立 O3 指標 第一行
    let o3Td1 = document.createElement("td");
    o3Td1.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "r-16");
    o3Td1.textContent = "8 小時移動平均";

    let o3Td2 = document.createElement("td");
    o3Td2.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "td-b-20");
    o3Td2.textContent = "64";

    let o3Td3 = document.createElement("td");
    o3Td3.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "td-r-16");
    o3Td3.textContent = "ppb";

    o3Row.appendChild(o3Td1);
    o3Row.appendChild(o3Td2);
    o3Row.appendChild(o3Td3);

    // 建立 O3 指標 第二行
    let o3Row2 = document.createElement("tr");
    o3Row2.classList.add("realtimeAirMonitor_content_rightdown_table_o3_div");

    let o3Td4 = document.createElement("td");
    o3Td4.classList.add("r-16");
    o3Td4.textContent = "小時濃度";

    let o3Td5 = document.createElement("td");
    o3Td5.classList.add("td-b-20");
    o3Td5.textContent = "72";

    let o3Td6 = document.createElement("td");
    o3Td6.classList.add("td-r-16");
    o3Td6.textContent = "ppb";

    o3Row2.appendChild(o3Td4);
    o3Row2.appendChild(o3Td5);
    o3Row2.appendChild(o3Td6);

    // 將 O3 添加到表格
    tableElement.appendChild(o3Row);
    tableElement.appendChild(o3Row2);


    //pm2.5
    // 建立 pm2.5 行
    let pm25Row = document.createElement("tr");
    pm25Row.classList.add("realtimeAirMonitor_content_rightdown_table_pm25_div");
    // 建立 pm2.5 
    let pm25Th = document.createElement("th");
    pm25Th.setAttribute("rowspan", "2");
    pm25Th.setAttribute("scope", "row");

    let pm25Sub = document.createElement("sub");
    pm25Sub.textContent = "2.5";

    let pm25P1 = document.createElement("p");
    pm25P1.classList.add("tr-b-25");
    pm25P1.textContent = "PM";
    pm25P1.appendChild(pm25Sub);

    let pm25P2 = document.createElement("p");
    pm25P2.classList.add("tr-b-16");
    pm25P2.textContent = "細懸浮微粒";

    pm25Th.appendChild(pm25P1);
    pm25Th.appendChild(pm25P2);
    pm25Row.appendChild(pm25Th);

    // 建立 pm2.5 指標 第一行
    let pm25Td1 = document.createElement("td");
    pm25Td1.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "r-16");
    pm25Td1.textContent = "移動平均";

    let pm25Td2 = document.createElement("td");
    pm25Td2.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "td-b-20");
    pm25Td2.textContent = "64";

    let pm25Sup = document.createElement("sup");
    pm25Sup.textContent = "3";

    let pm25d3 = document.createElement("td");
    pm25d3.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "td-r-16");
    pm25d3.textContent = "μg/m";
    pm25d3.appendChild(pm25Sup);

    pm25Row.appendChild(pm25Td1);
    pm25Row.appendChild(pm25Td2);
    pm25Row.appendChild(pm25d3);

    // 建立 pm2.5 指標 第二行
    let pm25Row2 = document.createElement("tr");
    pm25Row2.classList.add("realtimeAirMonitor_content_rightdown_table_pm25_div");

    let pm25Td4 = document.createElement("td");
    pm25Td4.classList.add("r-16");
    pm25Td4.textContent = "小時濃度";

    let pm25Td5 = document.createElement("td");
    pm25Td5.classList.add("td-b-20");
    pm25Td5.textContent = "72";

    let pm25Sup2 = document.createElement("sup");
    pm25Sup2.textContent = "3";

    let pm25Td6 = document.createElement("td");
    pm25Td6.classList.add("td-r-16");
    pm25Td6.textContent = "μg/m";
    pm25Td6.appendChild(pm25Sup2);

    pm25Row2.appendChild(pm25Td4);
    pm25Row2.appendChild(pm25Td5);
    pm25Row2.appendChild(pm25Td6);

    // 將 pm2.5 添加到表格
    tableElement.appendChild(pm25Row);
    tableElement.appendChild(pm25Row2);

    //pm10
    // 建立 pm10 行
    let pm10Row = document.createElement("tr");
    pm10Row.classList.add("realtimeAirMonitor_content_rightdown_table_pm10_div");
    // 建立 pm10
    let pm10Th = document.createElement("th");
    pm10Th.setAttribute("rowspan", "2");
    pm10Th.setAttribute("scope", "row");

    let pm10Sub = document.createElement("sub");
    pm10Sub.textContent = "10";

    let pm10P1 = document.createElement("p");
    pm10P1.classList.add("tr-b-25");
    pm10P1.textContent = "PM";
    pm10P1.appendChild(pm10Sub);

    let pm10P2 = document.createElement("p");
    pm10P2.classList.add("tr-b-16");
    pm10P2.textContent = "細懸浮微粒";

    pm10Th.appendChild(pm10P1);
    pm10Th.appendChild(pm10P2);
    pm10Row.appendChild(pm10Th);

    // 建立 pm10 指標 第一行
    let pm10Td1 = document.createElement("td");
    pm10Td1.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "r-16");
    pm10Td1.textContent = "移動平均";

    let pm10Td2 = document.createElement("td");
    pm10Td2.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "td-b-20");
    pm10Td2.textContent = "64";

    let pm10Sup = document.createElement("sup");
    pm10Sup.textContent = "3";

    let pm10d3 = document.createElement("td");
    pm10d3.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "td-r-16");
    pm10d3.textContent = "μg/m";
    pm10d3.appendChild(pm25Sup);

    pm10Row.appendChild(pm10Td1);
    pm10Row.appendChild(pm10Td2);
    pm10Row.appendChild(pm10d3);

    // 建立 pm10 指標 第二行
    let pm10Row2 = document.createElement("tr");
    pm10Row2.classList.add("realtimeAirMonitor_content_rightdown_table_pm10_div");

    let pm10Td4 = document.createElement("td");
    pm10Td4.classList.add("r-16");
    pm10Td4.textContent = "小時濃度";

    let pm10Td5 = document.createElement("td");
    pm10Td5.classList.add("td-b-20");
    pm10Td5.textContent = "72";

    let pm10Sup2 = document.createElement("sup");
    pm10Sup2.textContent = "3";

    let pm10Td6 = document.createElement("td");
    pm10Td6.classList.add("td-r-16");
    pm10Td6.textContent = "μg/m";
    pm10Td6.appendChild(pm10Sup2);

    pm10Row2.appendChild(pm10Td4);
    pm10Row2.appendChild(pm10Td5);
    pm10Row2.appendChild(pm10Td6);

    // 將 pm10 添加到表格
    tableElement.appendChild(pm10Row);
    tableElement.appendChild(pm10Row2);


    //CO
    //  建立 CO 行
    let coRow = document.createElement("tr");
    coRow.classList.add("realtimeAirMonitor_content_rightdown_table_co_div");
    // 建立 CO 
    let coTh = document.createElement("th");
    coTh.setAttribute("rowspan", "2");
    coTh.setAttribute("scope", "row");

    let coP1 = document.createElement("p");
    coP1.classList.add("tr-b-25");
    coP1.textContent = "CO";

    let coP2 = document.createElement("p");
    coP2.classList.add("tr-b-16");
    coP2.textContent = "一氧化碳";

    coTh.appendChild(coP1);
    coTh.appendChild(coP2);
    coRow.appendChild(coTh);

    // 建立 CO 指標 第一行
    let coTd1 = document.createElement("td");
    coTd1.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "r-16");
    coTd1.textContent = "8 小時移動平均";

    let coTd2 = document.createElement("td");
    coTd2.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "td-b-20");
    coTd2.textContent = "64";

    let coTd3 = document.createElement("td");
    coTd3.classList.add("realtimeAirMonitor_content_rightdown_table_line_div", "td-r-16");
    coTd3.textContent = "ppb";

    coRow.appendChild(coTd1);
    coRow.appendChild(coTd2);
    coRow.appendChild(coTd3);

    // 建立 CO 指標 第二行
    let coRow2 = document.createElement("tr");
    coRow2.classList.add("realtimeAirMonitor_content_rightdown_table_co_div");

    let coTd4 = document.createElement("td");
    coTd4.classList.add("r-16");
    coTd4.textContent = "小時濃度";

    let coTd5 = document.createElement("td");
    coTd5.classList.add("td-b-20");
    coTd5.textContent = "72";

    let coTd6 = document.createElement("td");
    coTd6.classList.add("td-r-16");
    coTd6.textContent = "ppb";

    coRow2.appendChild(coTd4);
    coRow2.appendChild(coTd5);
    coRow2.appendChild(coTd6);

    // 將 CO 添加到表格
    tableElement.appendChild(coRow);
    tableElement.appendChild(coRow2);


    //SO2
    //  建立 SO2 行
    let so2Row = document.createElement("tr");
    so2Row.classList.add("realtimeAirMonitor_content_rightdown_table_so2_div");
    // 建立 SO2
    let so2Th = document.createElement("th");
    so2Th.setAttribute("rowspan", "1");
    so2Th.setAttribute("scope", "row");

    let so2Sub = document.createElement("sub");
    so2Sub.textContent="2";

    let so2P1 = document.createElement("p");
    so2P1.classList.add("tr-b-25");
    so2P1.textContent = "SO";
    so2P1.appendChild(so2Sub);

    let so2P2 = document.createElement("p");
    so2P2.classList.add("tr-b-16");
    so2P2.textContent = "二氧化硫";

    so2Th.appendChild(so2P1);
    so2Th.appendChild(so2P2);
    so2Row.appendChild(so2Th);

    // 建立 SO2 指標 第一行
    let so2Td1 = document.createElement("td");
    so2Td1.classList.add("r-16");
    so2Td1.textContent = "小時濃度";

    let so2Td2 = document.createElement("td");
    so2Td2.classList.add("td-b-20");
    so2Td2.textContent = "64";

    let so2Td3 = document.createElement("td");
    so2Td3.classList.add("td-r-16");
    so2Td3.textContent = "ppb";

    so2Row.appendChild(so2Td1);
    so2Row.appendChild(so2Td2);
    so2Row.appendChild(so2Td3);

    // 將 SO2 添加到表格
    tableElement.appendChild(so2Row);


    //NO2
    //  建立 NO2 行
    let no2Row = document.createElement("tr");
    no2Row.classList.add("realtimeAirMonitor_content_rightdown_table_no2_div");
    // 建立 NO2
    let no2Th = document.createElement("th");
    no2Th.setAttribute("rowspan", "1");
    no2Th.setAttribute("scope", "row");

    let no2Sub = document.createElement("sub");
    no2Sub.textContent="2";

    let no2P1 = document.createElement("p");
    no2P1.classList.add("tr-b-25");
    no2P1.textContent = "NO";
    no2P1.appendChild(no2Sub);

    let no2P2 = document.createElement("p");
    no2P2.classList.add("tr-b-16");
    no2P2.textContent = "二氧化硫";

    no2Th.appendChild(no2P1);
    no2Th.appendChild(no2P2);
    no2Row.appendChild(no2Th);

    // 建立 NO2 指標 第一行
    let no2Td1 = document.createElement("td");
    no2Td1.classList.add("r-16");
    no2Td1.textContent = "小時濃度";

    let no2Td2 = document.createElement("td");
    no2Td2.classList.add("td-b-20");
    no2Td2.textContent = "64";

    let no2Td3 = document.createElement("td");
    no2Td3.classList.add("td-r-16");
    no2Td3.textContent = "ppb";

    no2Row.appendChild(no2Td1);
    no2Row.appendChild(no2Td2);
    no2Row.appendChild(no2Td3);

    // 將 NO2 添加到表格
    tableElement.appendChild(no2Row);

    // 所有元素按添加到文檔中
    tableDiv.appendChild(tableElement);

    // 最终生成的结構添加到頁面

    newDiv.appendChild(upperDiv);
    newDiv.appendChild(aqiDiv);
    newDiv.appendChild(tableDiv);
    contentRightDiv.appendChild(upperDiv);
    contentRightDiv.appendChild(newDiv);


}






// 生成觀測站資料 輸入縣市名稱為自動生成該縣市的觀測站資料在 select 中, 指定的select 由 className 決定
function insertMonitoringStation(stationName){
    let monitoringStationSelect = document.querySelector(".realtimeAirMonitor_content_right_select_left_select")
    monitoringStationSelect.innerHTML = ""
    let option = document.createElement("option")
    option.value = ""
    option.innerText = "請選擇觀測站"
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
async function getAPISite(){
    let queryCluster = getParasSite()
    let url = combineUrlSite(queryCluster)

    let data = await fetch(url)
    data = await data.json()

    return data

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