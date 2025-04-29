// RCWB – The website for the Royal College Western Band
// Copyright (C) 2025  Sanuka Weerabaddana 

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { useState, useEffect } from 'react';
import './Dashboard.css';
import './Navbar.css';
import bandlogo from '../assets/bandlogo.png';
import Navbar from './Navbar.jsx'

function Dashboard() {

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
      const handleScroll = () => {
          setScrollY(window.scrollY);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeAmount = Math.min(scrollY / 400, 1);
  const blurAmount = Math.min(scrollY / 100, 5);

    return (
        <>
            <Navbar />
            <section className="hero">
                {scrollY != null && (
                  <div
                    className="center-content logoandrcwb"
                    style={{
                      opacity: 1 - fadeAmount,
                      filter: `blur(${blurAmount}px)`,
                      transition: 'opacity 0.3s ease, filter 0.3s ease'
                    }}
                  >
                    <img src={bandlogo} alt="Band Logo" className="band-logo" />
                    <div className="hero-rcwb">
                      R<span className="hide">oyal</span>
                      C<span className="hide">ollege</span>
                      W<span className="hide">estern</span>
                      B<span className="hide">and</span>
                    </div>
                  </div>                  
                )}
            </section>

            <section className="content-section">
                <div className="center-content">
                    <p>Copyright (C) 2025 Sanuka Weerabaddana</p>
                </div>
            </section>
        </>
    );
}

export default Dashboard;