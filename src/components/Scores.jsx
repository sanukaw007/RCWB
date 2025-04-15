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