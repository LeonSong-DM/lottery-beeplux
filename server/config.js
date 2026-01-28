/**
 * 奖品设置
 * type: 唯一标识，0是默认特别奖的占位符，其它奖品不可使用
 * count: 奖品数量
 * title: 奖品描述
 * text: 奖品标题
 * img: 图片地址
 */
const prizes = [
  {
    type: 0,
    count: 1,
    text: "神秘大奖",
    title: "",
    img: "../img/边牧.png"
  },
  {
    type: 1,
    count: 2,
    text: "一等奖",
    title: "",
    img: "../img/柴犬.png"
  },
  {
    type: 2,
    count: 3,
    text: "二等奖",
    title: "",
    img: "../img/荷兰猪.png"
  },
  {
    type: 3,
    count: 5,
    text: "三等奖",
    title: "",
    img: "../img/羊.png"
  }
];

/**
 * 一次抽取的奖品个数与prizes对应
 */
const EACH_COUNT = [1, 2, 3, 5];

/**
 * 卡片公司名称标识
 */
const COMPANY = "Beeplux"

module.exports = {
  prizes,
  EACH_COUNT,
  COMPANY
};
