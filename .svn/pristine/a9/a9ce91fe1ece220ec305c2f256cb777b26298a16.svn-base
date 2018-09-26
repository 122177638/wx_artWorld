const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 日历时间
const clalendarTime = ()=> {
   var nstr = new Date();
   var ynow = nstr.getFullYear();
   var mnow = nstr.getMonth();
   var dnow = nstr.getDate();
   var mnow_real = mnow;
   var res;
   var clalendarData = [];

   // 获取今天的日期
   var today = Number(ynow + "" + ((mnow + 1) < 10 ? "0" + (mnow + 1) : (mnow + 1)) + (dnow < 10 ? "0" + dnow : dnow));
   
   //获取本年份剩余的日期
   for (let i = 0; i <= (mnow+2) - mnow; i++) {
      var Cdate = calendar(nstr, ynow, mnow + i, dnow);
      var CYearMonth = monDetail(ynow, mnow_real);
      clalendarData.push({ CYear: CYearMonth.ynow, CMonth: CYearMonth.mnow_real, Cdate, Cweek: ['日', '一', '二', '三', '四', '五', '六'] })
   }

   //获取年月
   function monDetail(ynow, mnow) {
      mnow_real = mnow + 1;
      const YearMonth = { ynow, mnow_real }
      return YearMonth
   }

   function is_leap(year) {  //判断是否为闰年
      return (year % 100 == 0 ? res = (year % 400 == 0 ? 1 : 0) : res = (year % 4 == 0 ? 1 : 0));
   }
   //获取日期
   function calendar(nstr, ynow, mnow, dnow) {
      var nlstr = new Date(ynow, mnow, 1);  //当月第一天
      var firstday = nlstr.getDay();      //第一天星期几
      var DateArr = [];
      var m_days = new Array(31, 28 + is_leap(ynow), 31, 30, 31, 31, 30, 31, 30, 31, 30, 31);  //每个月的天数

      var tr_str = Math.ceil((m_days[mnow] + firstday) / 7);   //当前月天数+第一天是星期几的数值   获得 表格行数

      var i, k, idx, date_str;
      for (i = 0; i < tr_str; i++) { //表格的行
         for (k = 0; k < 7; k++) { //表格每行的单元格
            idx = i * 7 + k; //单元格自然序列号
            date_str = idx - firstday + 1; //计算日期
            (date_str <= 0 || date_str > m_days[mnow]) ? date_str = "" : date_str = idx - firstday + 1; //过滤无效日期（小于等于零的、大于月总天数的）
            if (date_str == "") {
               DateArr.push({ Cdate: date_str, cid: null })
            } else {
               var monthValue = (mnow + 1) < 10 ? "0" + (mnow + 1) : (mnow + 1);
               var dateValue = date_str < 10 ? "0" + date_str : date_str;
               DateArr.push({ Cdate: date_str, cid: Number(ynow + "" + monthValue + "" + dateValue), toAbut: false })
            }
         }
      }
      return DateArr;
   }
   return {clalendarData, today}
}
module.exports = {
  formatTime: formatTime,
  clalendarTime: clalendarTime
}

