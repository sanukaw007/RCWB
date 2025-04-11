import './Scores.css'
import ScoreTable from './ScoreTable';
import AddScores from './AddScores'

function Scores(props) {
    return(
        <>
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