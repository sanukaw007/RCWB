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

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react';
import './Dashboard.css';
import './Navbar.css';
import bandlogo from '../assets/bandlogo.png';
import Navbar from './Navbar.jsx'
import ResolverEffect from '../logic/ResolverEffect.jsx';

function Dashboard(props) {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const [smallscreen, setSmallscreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setSmallscreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [hover, setHover] = useState(false);

    return (
        <div>
            <Navbar isAdmin={props.isAdmin} scrolled={scrollY > 0} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
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
                      {smallscreen ?
                        <div>
                          <div className='hero-rcwb'>RCWB</div>
                        </div>
                      :
                        <div className="hero-rcwb" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                          <ResolverEffect fallback="RCWB" active={hover} text="Royal College Western Band" />
                        </div>
                      }
                  </div>
                )}
            </section>
            
            {/* HISTORY OF THE BAND
            Established in 1961 under the Western Music Society, the Royal College Western band is the oldest band at Royal College. Originally focused on swing instruments, it transitioned to brass in the late ‘90s.
            The band plays a key role in college events, notably performing at the Bradby Shield. Its mission is to uphold the college’s standards while fostering the development of its members.
            The band’s diverse membership includes students from both middle and upper school. Key goals include promoting self-discipline, optimism, leadership, and musical proficiency, all through rigorous training and marching exercises. */}

            <section className="content-section">
                <div className="center-content">
                    <p>Copyright (C) 2025 Sanuka Weerabaddana</p>
                </div>
            </section>
        </div>
    );
}
Dashboard.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default Dashboard;