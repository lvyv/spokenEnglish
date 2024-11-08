import Mock from 'mockjs';
// 根据场景名称返回不同的模拟数据
export const getSceneData = (scene) => {
  switch (scene) {
    case '机票预定':
      return Mock.mock({
        flightNumber: '@string("upper", 2)@integer(100, 999)', // 随机航班号
        departure: '@city', // 出发城市
        destination: '@city', // 目的地
        time: '@datetime', // 出发时间
        airline: '@company', // 航空公司名称
      });
    case '酒店预订':
      return Mock.mock({
        hotelName: '@title(3, 5)', // 酒店名称
        checkInDate: '@date', // 入住时间
        roomType: '@word', // 房间类型
        price: '@integer(200, 1000)', // 房间价格
      });
    case '餐订点餐':
      return Mock.mock({
        restaurantName: '@title(2, 4)', // 餐厅名称
        meal: '@word', // 餐点类型
        price: '@integer(50, 300)', // 餐点价格
        orderTime: '@time', // 下单时间
      });
    case '工作面试':
      return Mock.mock({
        companyName: '@company', // 公司名称
        interviewDate: '@date', // 面试日期
        position: '@word', // 应聘职位
        interviewer: '@name', // 面试官
      });
    case '地铁':
      return Mock.mock({
        lineNumber: '@integer(1, 10)', // 地铁线路号
        departureStation: '@city', // 出发站
        destinationStation: '@city', // 终点站
        time: '@time', // 乘车时间
      });
    case '超市购物':
      return Mock.mock({
        supermarket: '@company', // 超市名称
        item: '@word', // 购物项目
        price: '@integer(10, 200)', // 价格
        quantity: '@integer(1, 5)', // 数量
      });
    default:
      return { message: '没有找到相关场景数据' };
  }
};
