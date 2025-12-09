import React from 'react';
import Hero from '../components/Hero';
import Container from '../components/Container';
import PlatformWorks from '../components/PlatformWorks';
import ChooseUs from '../components/ChooseUs';
import LatestTuitions from '../components/LatestTuitions';
import LatestTutors from '../components/LatestTutors';

const Home = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            
                <Hero></Hero>
                <LatestTuitions></LatestTuitions>
                <LatestTutors></LatestTutors>
                <PlatformWorks></PlatformWorks>
                <ChooseUs></ChooseUs>
          
            
        </div>
    );
};

export default Home;