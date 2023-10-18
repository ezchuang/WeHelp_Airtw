let chartMain // 主要 Chart 圖的(記憶體)位置


function getSiteInput(){
    let siteElements = document.querySelectorAll("#monitoringStation")
    let siteArr = []
    siteElements.forEach(element => {
        if (element.value == ""){
            return 
        }
        siteArr.push(element.value)
    })
    return siteArr
}


function getKeyInput(){
    let keyElementsParent = document.querySelector(".queryForm_cotainer_monitorItem_checkbox_div")
    let keyElementsChildren = keyElementsParent.querySelectorAll("input")
    let keyArr = []

    keyElementsChildren.forEach(element => {
        if (! element.checked){
            return
        }
        keyArr.push(element.value)
    })

    return keyArr
}


function putPrefixToKeyArr(keyArr){
    let keyArrHasPrefix = []
    keyArr.forEach(element => {
        let key

        if (element == "aqi"){
            key = element
        }else if (element == "pm2.5"){
            key = "pm25subindex"
        }else{
            key = element + "subindex"
        }
        keyArrHasPrefix.push(key)
    })

    return keyArrHasPrefix
}


function getParasChart(siteArr, key){
    let queryCluster = {
        "originUrl" : "https://data.moenv.gov.tw/api/v2/aqx_p_434",
        "apiKey" : "e8dd42e6-9b8b-43f8-991e-b3dee723a52d",
        // data query 參數
        "sitename": null,
        "fields": null,
        "monitordate": null,
        // general query 參數
        "language" : null,
        "offset" : null,
        "limit" : null,
    }
    
    let siteStr = siteArr.join(",")

    queryCluster.sitename = siteStr
    queryCluster.fields = `sitename,${key.join(",")},monitordate`
    
    // 用日期限制筆數
    // let today = new Date();
    // let dd = String(today.getDate()).padStart(2, '0')
    // let mm = String(today.getMonth() + 1).padStart(2, '0')
    // let yyyy = String(today.getFullYear())
    // let date = `${yyyy}-${mm}-${dd}`
    // queryCluster.monitordate = "2023-10-14"
    
    // 用 Limit 限制筆數，七天
    // queryCluster.limit = (queryCluster.sitename.split(",").length) * 7
    queryCluster.limit = (siteArr.length) * 7

    return queryCluster
}


function combineUrlChart(queryCluster){
    let url = `${queryCluster.originUrl}?api_key=${queryCluster.apiKey}`

    if (queryCluster.offset){
        url += `&offset=${queryCluster.offset}`
    }
    if (queryCluster.limit){
        url += `&limit=${queryCluster.limit}`
    }
    url += `&filters=`
    if (queryCluster.sitename){
        url += `SiteName,EQ,${queryCluster.sitename}`
    }
    if (queryCluster.monitordate){
        url += `|monitordate,GR,${queryCluster.monitordate}`
    }
    if (queryCluster.fields){
        url += `&fields=${queryCluster.fields}`
    }
    url +=`&sort=monitordate desc`

    return url
}


async function getAPIChart(siteArr, keyArrHasPrefix){
    let queryCluster = getParasChart(siteArr, keyArrHasPrefix)
    let url = combineUrlChart(queryCluster)

    let data = await fetch(url)
    data = await data.json()

    return data
}


function preClassifyData(rawData, keyArr, keyArrHasPrefix){
    let labelsTemp = {} // X軸時間，dict 需再處理
    let dataTemp = {} // 個別資料，需再處理，結構如下
        // dataTemp = {
        //     "萬華-O3": [1,4,4,5,5,6,6],
        //     "鳳山-PM2.5": [1,4,3,3,4,3,6],
        // }
    
    for (let j=0; j<keyArr.length; j++){
        for (let i=0; i<rawData.length; i++){
            // 建立日期
            if (! labelsTemp.hasOwnProperty(rawData[i].monitordate)){
                labelsTemp[rawData[i].monitordate] = null
            }
            // 初步 data 分類
            let catKey = `${rawData[i].sitename}-${keyArr[j].toUpperCase()}`
            if (! dataTemp.hasOwnProperty(catKey)){
                dataTemp[catKey] = [rawData[i][keyArrHasPrefix[j]]]
            }else{
                dataTemp[catKey].push(rawData[i][keyArrHasPrefix[j]])
            }
        }
    }

    // Dict 轉 Arr
    let labels = Object.keys(labelsTemp)
    labels.sort()
    
    return [labels, dataTemp]
}


function classifyData(dataTemp){
    let data = []
    let dataKeys = Object.keys(dataTemp)
    let ppbArr = ['o3', 'co', 'so2', 'no2']
    let mgm3 = ['pm2.5', 'pm10']

    for (let i=0; i<dataKeys.length; i++){
        let y
        let labelName
        
        // 判斷屬於哪一個 Y 軸，並建立 Label
        let key = dataKeys[i].split("-")[1].toLowerCase()
        ppbArr.forEach(element => {
            if (element != key){
                return
            }
            y = "y"
            labelName = `${dataKeys[i]} (ppb)`
        })
        mgm3.forEach(element => {
            if (element != key){
                return
            }
            y = "y1"
            labelName = `${dataKeys[i]} (μg/m3)`
        })

        // 建立切完的 data 資料結構
        data.push(
            {
                label: labelName,
                data: dataTemp[dataKeys[i]],
                yAxisID: y
            }
        )
    }

    return data
}


function setData(rawData, keyArr, keyArrHasPrefix){
    let [labels, dataTemp] = preClassifyData(rawData, keyArr, keyArrHasPrefix)
    let data = classifyData(dataTemp) // 切 data

    let dataSet = {
        labels: labels,
        active: true, 
        datasets: data
    }

    return dataSet
}


function generateSevenDays(){
    let dateArr = []
    let data = [{
        label: "",
        data: [],
        borderColor: "rgba(0, 0, 0, 0)",
        backgroundColor: "rgba(0, 0, 0, 0)",
    }]

    let today = new Date();
    let dateDelta = new Date(today)
    for (let i=7; i>0; i--){
        dateDelta.setDate(today.getDate() - i)
        let dd = String(dateDelta.getDate()).padStart(2, '0')
        let mm = String(dateDelta.getMonth() + 1).padStart(2, '0')
        let yyyy = String(dateDelta.getFullYear())
        let date = `${yyyy}-${mm}-${dd}`
        dateArr.push(date)
    }

    let dataSet = {
        labels: dateArr,
        active: true,
        datasets: data,
    }

    return dataSet
}


async function createChart(){
    // 取值
    let siteArr = getSiteInput()
    let keyArr = getKeyInput()
    let keyArrHasPrefix = putPrefixToKeyArr(keyArr)
    
    let dataSet
    if (siteArr.length < 1 || keyArrHasPrefix.length < 1){
        // 沒有 Site or Key
        dataSet = generateSevenDays()
    }else{
        // fetch API
        let data = await getAPIChart(siteArr, keyArrHasPrefix)
        // 切 Data
        dataSet = setData(data.records, keyArr, keyArrHasPrefix)
    }
    
    chartMain.data = dataSet
    await chartMain.update();
}


function newChart(){
    let dataSet = generateSevenDays()
    let canvasNew = document.querySelector('#myChart').getContext('2d')

    chartMain = new Chart(canvasNew, {
        type: 'line',
        data: dataSet,
        options: {
            responsive: true,
            aspectRatio: 2,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            size: 16
                        }
                    },
                    ticks: {
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'ppb',
                        font: {
                            size: 16
                        }
                    },
                    ticks: {
                        font: {
                            size: 14
                        }
                    },
                    position: 'left',
                    beginAtZero: true,
                    // suggestedMin: 0,
                },
                y1: {
                    title: {
                        display: true,
                        text: 'μg/m3',
                        font: {
                            size: 16
                        }
                    },
                    ticks: {
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        display: false
                    },
                    position: 'right',
                    beginAtZero: true,
                    // suggestedMin: 0,
                }
            },
            plugins: {
                title: {
                    display: false,
                    text: '折線圖',
                    font: {
                        size: 20
                    }
                },
                // colors: {
                //     forceOverride: true
                // },
                legend: {
                    labels: {
                        font: {
                            size: 16
                        }
                    }
                },
                tooltip: {
                    bodyFont: {
                        size: 14
                    },
                    titleFont: {
                        size: 14
                    },
                    xAlign: 'center',
                    yAlign: 'bottom',
                    titleAlign: 'center',
                },
            },
            font:{
                family: "'Noto Sans TC', sans-serif",
            },
            elements: {
                
                line: {
                    borderCapStyle: "round",
                    cubicInterpolationMode: 'monotone',
                    borderWidth: 2,
                },
                point: {
                    pointStyle: false,
                }
            },
            interaction: {
                intersect: false,
            },
            layout: {
                padding: 20
            }
        }
    });
}


newChart()