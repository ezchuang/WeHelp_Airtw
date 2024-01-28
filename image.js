let siteNameObj = {} // 紀錄 Site Name 對應的 Site ID


function getSiteId(){
    let rawData = dataGeneral.records
    for (let i=0; i<rawData.length; i++){
        siteNameObj[ rawData[i].sitename ] = rawData[i].siteid
    }
}


function subtractOneHour() {
        let newDate = new Date();

        let currentYear = newDate.getFullYear();
        let currentMonth = newDate.getMonth();
        let currentDay = newDate.getDate();
        let currentHour = newDate.getHours();
    
        if (currentHour === 0 && currentDay === 1) {
            if (currentMonth === 0) { // 小時減一致月份退位
                currentYear -= 1;
                currentMonth = 11;
            }else{
                currentMonth -= 1; // 小時減一致日期退位
            }
            let lastDayOfLastMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            newDate.setFullYear(currentYear, currentMonth, lastDayOfLastMonth);
            newDate.setHours(23);
        }else{
            newDate.setHours(currentHour - 1);
        }
    
        return newDate;
}


function changeImage(sitename){
    let siteID = String(siteNameObj[sitename]).padStart(3, '0')

    let today = subtractOneHour();

    let hh = String(today.getHours()).padStart(2, '0')
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0')
    let yyyy = String(today.getFullYear())

    let site = document.querySelector(".realtimePic_div_div")
    // let imgTarget = site.children[1]
    let imgTarget = site.children[1].children[0]
    imgTarget.setAttribute("src", `https://airtw.epa.gov.tw/AirSitePic/${yyyy + mm + dd}/${siteID}-${yyyy + mm + dd + hh}00.jpg`)
}