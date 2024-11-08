//mock.js

// 导入所有场景所需的图片
import FlightImage from '@/assets/svgs/flight.png';
import HotelImage from '@/assets/svgs/hotel.png';
import MealImage from '@/assets/svgs/meal.png';
import InterviewImage from '@/assets/svgs/interview.png';
import SubwayImage from '@/assets/svgs/subway.png';
import ShoppingImage from '@/assets/svgs/shopping.png';

import DoctorImage from '@/assets/svgs/doctor.png';
import WeatherImage from '@/assets/svgs/weather.png';
import PharmacyImage from '@/assets/svgs/pharmacy.png';
import AccidentImage from '@/assets/svgs/accident.png';
import HealthImage from '@/assets/svgs/health.png';
import CheckoutImage from '@/assets/svgs/checkout.png';
import BankImage from '@/assets/svgs/bank.png';
import RepairImage from '@/assets/svgs/repair.png';
import NeighborImage from '@/assets/svgs/neighbor.png';
import CommunityImage from '@/assets/svgs/community.png';

import WeeklyMeetingImage from '@/assets/svgs/weekly_meeting.png';
import TeamBuildingImage from '@/assets/svgs/team_building.png';
import ReportImage from '@/assets/svgs/report.png';
import MeetingArrangementImage from '@/assets/svgs/meeting_arrangement.png';
import LeaveApplicationImage from '@/assets/svgs/leave_application.png';
import SelfIntroductionImage from '@/assets/svgs/self_introduction.png';

import RegistrationImage from '@/assets/svgs/registration.png';
import SightseeingImage from '@/assets/svgs/sightseeing.png';
import TravelInvitationImage from '@/assets/svgs/travel_invitation.png';
import HotelReservationImage from '@/assets/svgs/hotel_reservation.png';
import DirectionImage from '@/assets/svgs/direction.png';
import TravelAgencyImage from '@/assets/svgs/travel_agency.png';

import AdmissionInterviewImage from '@/assets/svgs/admission_interview.png';
import AcademicInterviewImage from '@/assets/svgs/academic_interview.png';
import IELTSMockImage from '@/assets/svgs/ielts_mock.png';

import ClubImage from '@/assets/svgs/club.png';
import TextbookImage from '@/assets/svgs/textbook.png';
import CafeteriaImage from '@/assets/svgs/cafeteria.png';
import PartTimeJobImage from '@/assets/svgs/part_time_job.png';
import CampusTourImage from '@/assets/svgs/campus_tour.png';

 
  const scenes = {
    recommend: [
      { name: '机票预定', image: FlightImage },
      { name: '酒店预订', image: HotelImage },
      { name: '餐订点餐', image: MealImage },
      { name: '工作面试', image: InterviewImage },
      { name: '地铁', image: SubwayImage },
      { name: '超市购物', image: ShoppingImage }
    ],
    daily: [
      { name: '预约医生', image: DoctorImage },
      { name: '天气预报', image: WeatherImage },
      { name: '药店买药', image: PharmacyImage },
      { name: '交通事故', image: AccidentImage },
      { name: '健康饮食', image: HealthImage },
      { name: '购物结账', image: CheckoutImage },
      { name: '银行业务', image: BankImage },
      { name: '修理家电', image: RepairImage },
      { name: '邻里交往', image: NeighborImage },
      { name: '社区活动', image: CommunityImage }
    ],
    work: [
      { name: '每周例会', image: WeeklyMeetingImage },
      { name: '团建活动', image: TeamBuildingImage },
      { name: '工作汇报', image: ReportImage },
      { name: '会议安排', image: MeetingArrangementImage },
      { name: '放假申请', image: LeaveApplicationImage },
      { name: '自我介绍', image: SelfIntroductionImage }
    ],
    travel: [
      { name: '办理登记', image: RegistrationImage },
      { name: '景点观光', image: SightseeingImage },
      { name: '邀约旅行', image: TravelInvitationImage },
      { name: '预定酒店', image: HotelReservationImage },
      { name: '出行问路', image: DirectionImage },
      { name: '旅行社', image: TravelAgencyImage }
    ],
    exam: [
      { name: '工作面试', image: AdmissionInterviewImage },
      { name: '招生面试', image: AcademicInterviewImage },
      { name: '学术面试', image: IELTSMockImage }
    ],
    school: [
      { name: '学校社团', image: ClubImage },
      { name: '教材购买', image: TextbookImage },
      { name: '校园食堂', image: CafeteriaImage },
      { name: '校园兼职', image: PartTimeJobImage },
      { name: '校园参观', image: CampusTourImage }
    ]
   
  };
  
  // 模拟后端接口
  export const fetchScenes = (tab) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(scenes[tab]);
      }, 1000); // 模拟延迟
    });
  };
  