import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
function Footer() {
    return (
        <footer className="bg-teal-600 text-white py-6 mt-1">
            <div className="max-w-7xl mx-auto text-center">
                <p className="text-lg">
                    © 2025 Laundry Management System | All Rights Reserved
                </p>
                <div className="mt-4">
                    <a href="https://www.facebook.com" className="mx-4 hover:text-teal-200 transition duration-300"><span><FacebookIcon /> Facebook</span></a>
                    <a href="https://www.twitter.com" className="mx-4 hover:text-teal-200 transition duration-300"> <span> <XIcon /> Twitter</span> </a>
                    <a href="https://www.instagram.com" className="mx-4 hover:text-teal-200 transition duration-300"> <span> <InstagramIcon /> Instagram</span> </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
