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

import './Scores.css'
import ScoreTable from './ScoreTable';
import AddScores from './AddScores'
import Navbar from './Navbar';

function Scores(props) {
    return(
        <>  {props.admin &&
                <Navbar scrolled={true} />
            }
            <h1 id="scores-heading">Scores</h1>
            <div className='container'>
            {props.admin &&
            <div className='left-panel'>
                <AddScores />
            </div>
            }
            <div className='right-panel'>
                <ScoreTable admin={props.admin} instrument={props.instrument} />
            </div>
        </div>
    </>
    )
}

export default Scores