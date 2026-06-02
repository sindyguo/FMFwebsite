/**
 * 自定义时间事件
 */
import moment from 'moment';

function defineFormat(data, format) {
  if(!data) {
    return '';
  }
  return format ? moment(data).format(format) : moment(data).format('YYYY-MM-DD');
}

/**
 * 表格时间格式化
 */
function defineFormatDate(cellValue, showTime = true, link='-') {
  var date = new Date(cellValue)
  var year = date.getFullYear()
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() 
  var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() 
  var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() 
  var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  if(showTime) {
    return `${year}${link}${month}${link}${day}${link?' ':''}${hours}${link?':':''}${minutes}${link?':':''}${seconds}`;
  } else {
    return year + '-' + month + '-' + day
  }
}

function defineAddDays(day, n) {
  let newDate = '';
  if(day) {
    newDate = moment(new Date(day)).add(n, 'days').format("YYYY-MM-DD");
  } else {
    newDate = moment(new Date()).add(n, 'days').format("YYYY-MM-DD");
  }
  return newDate;
}

function defineAddMonths(time, n, showEnd = true) {
  let newDate = null;
  if(showEnd) {
    newDate = moment(new Date(time)).add(n, 'months').endOf('month').format("YYYY-MM-DD")
  } else {
    newDate = moment(new Date(time)).add(n, 'months').format("YYYY-MM-DD");
  }
  return newDate;
}

export default {
  defineFormat,
  defineFormatDate,
  defineAddDays,
  defineAddMonths
}
