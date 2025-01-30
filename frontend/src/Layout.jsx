import React from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import {Outlet} from 'react-router-dom'
function About() {
    return ( 
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
     );
}

export default About;