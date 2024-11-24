
// import Image from 'next/image';
// import { Button } from '@nextui-org/react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronRight } from '@fortawesome/free-solid-svg-icons'; // 导入右箭头图标
// import FlightImage from '@/assets/svgs/flight.png';
// import HotelImage from '@/assets/svgs/hotel.png';
// import MealImage from '@/assets/svgs/meal.png';
// import InterviewImage from '@/assets/svgs/interview.png';
// import SubwayImage from '@/assets/svgs/subway.png';

// export default function MainContent() {
//     // 模拟场景数据和背景颜色
//     const scenes = [
//         {
//             id: 1,
//             image: FlightImage,
//             name: '机票预订',
//             nameEn: 'Flight Booking',
//             description: '快速轻松地预订国内外航班机票，选择合适的航班时间和航空公司，享受便捷的出行体验。',
//             bgColor: '#FFF5EE', // 第一模块背景颜色
//         },
//         {
//             id: 2,
//             image: HotelImage,
//             name: '酒店预订',
//             nameEn: 'Hotel Reservation',
//             description: '查找和预订世界各地的酒店，从豪华酒店到经济型住宿，多种选择满足您的需求。',
//             bgColor: '#E6E6FA', // 第二模块背景颜色
//         },
//         {
//             id: 3,
//             image: MealImage,
//             name: '餐饮点餐',
//             nameEn: 'Meal Ordering',
//             description: '浏览各类餐厅和美食，轻松在线点餐并享受送餐服务，无论是快餐还是精致餐点都有。',
//             bgColor: '#FFF0F5', // 第三模块背景颜色
//         },
//         {
//             id: 4,
//             image: InterviewImage,
//             name: '面试准备',
//             nameEn: 'Interview Preparation',
//             description: '获取专业的面试技巧和常见问题答案，帮助您为工作面试做好充足的准备，提高面试成功率。',
//             bgColor: '#FFFACD', // 第四模块背景颜色
//         },
//         {
//             id: 5,
//             image: SubwayImage,
//             name: '地铁导航',
//             nameEn: 'Subway Navigation',
//             description: '提供城市地铁线路图和实时路线规划，帮助您在繁忙的地铁系统中快速找到最佳路径。',
//             bgColor: '#E0FFFF', // 第五模块背景颜色
//         },
//     ];

//     return (
//         <div className="bg-white w-full flex-1 shadow-lg rounded-lg overflow-y-auto p-4 space-y-4">
//             {scenes.map((scene) => (
//                 <div
//                     key={scene.id}
//                     className="flex rounded-lg shadow p-4 hover:bg-gray-100 transition justify-between items-center"
//                     style={{ backgroundColor: scene.bgColor }} // 设置模块背景颜色
//                 >
//                     {/* 左侧的小图片 */}
//                     <div className="flex-shrink-0">
//                         <Image
//                             src={scene.image}
//                             alt={scene.name}
//                             width={64}
//                             height={64}
//                             className="rounded-lg object-cover"
//                         />
//                     </div>
//                     {/* 右侧的内容 */}
//                     <div className="flex flex-col justify-between ml-4 flex-1">
//                         {/* 场景名称 */}
//                         <h3 className="text-lg font-semibold">{scene.name}</h3>
//                         <h4 className="text-md" style={{ color: '#708090' }}>{scene.nameEn}</h4> {/* 英文名称 */}
//                         {/* 场景介绍 */}
//                         <p className="text-md text-gray-600">{scene.description}</p>
//                     </div>
//                     {/* 开始聊天按钮 */}
//                     <div className="flex-shrink-0">
//                         <Button
//                             className="bg-[#87CEFA] text-white hover:bg-gray-700 transition flex items-center active:bg-[#A9A9A9]"
//                             onClick={() => console.log(`开始聊天：${scene.name}`)} // 点击事件
//                         >
//                             开始聊天
//                             <FontAwesomeIcon icon={faChevronRight} className="ml-2" /> {/* 右箭头图标 */}
//                         </Button>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }


import Image from 'next/image';
import { Button } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'; // 导入右箭头图标
import FlightImage from '@/assets/svgs/flight.png';
import HotelImage from '@/assets/svgs/hotel.png';
import MealImage from '@/assets/svgs/meal.png';
import InterviewImage from '@/assets/svgs/interview.png';
import SubwayImage from '@/assets/svgs/subway.png';
import RomanceImage from '@/assets/svgs/Romance.png';
import SportsImage from '@/assets/svgs/Sports.png';
import MusicImage from '@/assets/svgs/Music.png';
import MoviesImage from '@/assets/svgs/Movies.png';
import ReadingImage from '@/assets/svgs/Reading.png';

export default function MainContent({ selectedScene }) {
    // 模拟场景数据
    const sceneData = {
        社交: [
            { id: 1, image: FlightImage, name: '机票预订', description: '快速轻松地预订航班机票。', bgColor: '#FFF5EE' },
            { id: 2, image: HotelImage, name: '酒店预订', description: '查找和预订世界各地的酒店。', bgColor: '#E6E6FA' },
            { id: 3, image: MealImage, name: '餐饮点餐', description: '在线点餐并享受送餐服务。', bgColor: '#FFF0F5' },
            { id: 4, image: InterviewImage, name: '面试准备', description: '获取面试技巧和常见问题答案。', bgColor: '#FFFACD' },
            { id: 5, image: SubwayImage, name: '地铁导航', description: '实时路线规划，帮助您找到最佳路径。', bgColor: '#E0FFFF' },
        ],
        恋爱: [
            { id: 1, image: RomanceImage, name: '约会策划', description: '策划完美的约会活动。', bgColor: '#f6f4f0' },
            { id: 2, image: RomanceImage, name: '礼物选择', description: '选择适合的礼物表达心意。', bgColor: '#FBFBFB' },
            { id: 3, image: RomanceImage, name: '情感沟通', description: '增进彼此的理解和沟通。', bgColor: '#f6f4f0' },
            { id: 4, image: RomanceImage, name: '浪漫晚餐', description: '预定一个浪漫的晚餐地点。', bgColor: '#FBFBFB' },
            { id: 5, image: RomanceImage, name: '纪念日活动', description: '为特别的日子准备活动。', bgColor: '#f6f4f0' },
        ],
        体育: [
            { id: 1, image: SportsImage, name: '健身训练', description: '制定健身计划，保持健康。', bgColor: '#FFF5EE' },
            { id: 2, image: SportsImage, name: '赛事观看', description: '观看喜欢的体育赛事。', bgColor: '#E6E6FA' },
            { id: 3, image: SportsImage, name: '团队运动', description: '参与团队运动，增强凝聚力。', bgColor: '#FFF0F5' },
            { id: 4, image: SportsImage, name: '运动装备', description: '选购合适的运动装备。', bgColor: '#FFFACD' },
            { id: 5, image: SportsImage, name: '健康饮食', description: '搭配运动的健康饮食。', bgColor: '#E0FFFF' },
        ],
        音乐: [
            { id: 1, image: MusicImage, name: '曲目推荐', description: '推荐适合的音乐曲目。', bgColor: '#FFF5EE' },
            { id: 2, image: MusicImage, name: '音乐分享', description: '分享自己喜欢的音乐。', bgColor: '#E6E6FA' },
            { id: 3, image: MusicImage, name: '学习资源', description: '提供音乐学习的资源。', bgColor: '#FFF0F5' },
            { id: 4, image: MusicImage, name: '演出安排', description: '关注即将到来的演出。', bgColor: '#FFFACD' },
            { id: 5, image: MusicImage, name: '风格介绍', description: '介绍各种音乐风格。', bgColor: '#E0FFFF' },
        ],
        电影: [
            { id: 1, image: MoviesImage, name: '影片推荐', description: '推荐最新的电影。', bgColor: '#FFF5EE' },
            { id: 2, image: MoviesImage, name: '观影活动', description: '组织观影活动与朋友一起观看。', bgColor: '#E6E6FA' },
            { id: 3, image: MoviesImage, name: '经典回顾', description: '回顾经典影片，分享感受。', bgColor: '#FFF0F5' },
            { id: 4, image: MoviesImage, name: '最新资讯', description: '关注电影的最新动态。', bgColor: '#FFFACD' },
            { id: 5, image: MoviesImage, name: '影评讨论', description: '讨论电影的评价和感想。', bgColor: '#E0FFFF' },
        ],
        阅读: [
            { id: 1, image: ReadingImage, name: '书籍推荐', description: '推荐值得阅读的书籍。', bgColor: '#FFF5EE' },
            { id: 2, image: ReadingImage, name: '书评分享', description: '分享对书籍的评价和感想。', bgColor: '#E6E6FA' },
            { id: 3, image: ReadingImage, name: '读书计划', description: '制定个人的读书计划。', bgColor: '#FFF0F5' },
            { id: 4, image: ReadingImage, name: '读书会组织', description: '组织读书会，与他人分享书籍。', bgColor: '#FFFACD' },
            { id: 5, image: ReadingImage, name: '电子书库', description: '推荐电子书和阅读资源。', bgColor: '#E0FFFF' },
        ],
    };

    const scenes = sceneData[selectedScene] || [];

    return (
        <div className="bg-white w-full flex-1 shadow-lg rounded-lg overflow-y-auto p-4 space-y-4">
            {scenes.map((scene) => (
                <div
                    key={scene.id}
                    className="flex rounded-lg shadow p-4 hover:bg-gray-100 transition justify-between items-center"
                    style={{ backgroundColor: scene.bgColor }} // 设置模块背景颜色
                >
                    <div className="flex-shrink-0">
                        <Image
                            src={scene.image}
                            alt={scene.name}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-between ml-4 flex-1">
                        <h3 className="text-lg font-semibold">{scene.name}</h3>
                        <p className="text-md text-gray-600">{scene.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <Button
                            className="bg-[#87CEFA] text-white hover:bg-gray-700 transition flex items-center active:bg-[#A9A9A9]"
                            onClick={() => console.log(`开始聊天：${scene.name}`)} // 点击事件
                        >
                            开始聊天
                            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
