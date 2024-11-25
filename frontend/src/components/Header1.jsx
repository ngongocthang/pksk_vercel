import React from 'react';
import Slider from 'react-slick';
import { assets } from '../assets/assets';
import HomepageBanner3 from '../assets/banner.png';
import HomepageBanner4 from '../assets/banner6.png';
import HomepageBanner from '../assets/Homepage-Banner.jpg';

const Header1 = () => {
    const settings = {
        dots: true,
        infinite: true, 
        speed: 500,
        slidesToShow: 1, 
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
    };

    return (
        <div className='flex justify-center'>
            <div className='rounded-lg.px-6.md\:px-10.lg\:px-20' style={{ width: "95%" }}>
                <Slider {...settings}>

                    {/* image slider 1 */}
                    <div className='relative'>
                        <img
                            src={HomepageBanner}
                            alt="Homepage Banner 1"
                            className='absolute inset-0 w-full h-full object-cover z-0 rounded-lg'
                        />
                        <div className='flex flex-col md:flex-row flex-wrap relative z-10'>
                            <div className='md:w-3/4 flex flex-col items-start justify-center gap-4 py-10 md:py-[10vw] ml-5'>
                                <p className="text-3xl md:text-4xl lg:text-5xl text-[#00759c] line-clamp-2">
                                    Đặt lịch hẹn <br /> Với bác sĩ đáng tin cậy
                                </p>
                                <div className='flex flex-col md:flex-row items-start gap-3 text-[#00759c]'>
                                    <img className='w-28 rounded-lg' src={assets.group_profiles} alt="" />
                                    <p className='line-clamp-2'>
                                        Với các bác sĩ đáng tin cậy, <br className='hidden sm:block' /> lên lịch cuộc hẹn của bạn một cách dễ dàng.
                                    </p>
                                </div>
                                <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#00759c] text-sm hover:scale-105 transition-all duration-300'>
                                    Đặt lịch hẹn <img className='w-3' src={assets.arrow_icon} alt="" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* image slider 2 */}
                    <div className='relative'>
                        <img
                            src={HomepageBanner3}
                            alt="Homepage Banner 2"
                            className='absolute inset-0 w-full h-full object-cover z-0 rounded-lg'
                        />
                        <div className='flex flex-col md:flex-row flex-wrap relative z-10'>
                            <div className='md:w-3/4 flex flex-col items-start justify-center gap-4 py-10 md:py-[10vw] ml-5'>
                                <p className='text-3xl md:text-4xl lg:text-5xl text-[#00759c] line-clamp-2'>
                                    Chăm sóc sức khỏe <br /> tốt hơn với đội ngũ chuyên gia
                                </p>
                                <div className='flex flex-col md:flex-row items-start gap-3 text-[#00759c]'>
                                    <img className='w-28 rounded-lg' src={assets.group_profiles} alt="" />
                                    <p className='line-clamp-2'>
                                        Đặt lịch với các bác sĩ của chúng tôi <br className='hidden sm:block' /> và nhận sự chăm sóc tốt nhất.
                                    </p>
                                </div>
                                <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#00759c] text-sm hover:scale-105 transition-all duration-300'>
                                    Tìm hiểu thêm <img className='w-3' src={assets.arrow_icon} alt="" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* image slider 3 */}
                    <div className='relative'>
                        <img
                            src={HomepageBanner4}
                            alt="Homepage Banner 3"
                            className='absolute inset-0 w-full h-full object-cover z-0 rounded-lg'
                        />
                        <div className='flex flex-col md:flex-row flex-wrap relative z-10'>
                            <div className='md:w-4/5 flex flex-col items-start justify-center gap-4 py-10 md:py-[10vw] ml-5'>
                                <p className='text-3xl md:text-4xl lg:text-5xl text-[#00759c] line-clamp-2'>
                                    Đội ngũ bác sĩ chuyên nghiệp <br className='hidden sm:block' /> luôn sẵn sàng hỗ trợ bạn
                                </p>
                                <div className='flex flex-col md:flex-row items-start gap-3 text-[#00759c]'>
                                    <img className='w-28 rounded-lg' src={assets.group_profiles} alt="" />
                                    <p className='line-clamp-2'>
                                        Dịch vụ chăm sóc sức khỏe toàn diện <br className='hidden sm:block' /> với đội ngũ bác sĩ chuyên môn cao.
                                    </p>
                                </div>
                                <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#00759c] text-sm hover:scale-105 transition-all duration-300'>
                                    Khám phá ngay <img className='w-3' src={assets.arrow_icon} alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </Slider>
            </div>
        </div>
    );
};

export default Header1;