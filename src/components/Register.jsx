import { useState, useEffect } from "react";
import './Register.css';
import { collection, getFirestore, onSnapshot, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { formatDate, checkStatus, AddPractice } from "../logic/RegisterFuncs";
import { exportToCsv } from "../logic/csvutils";
import Navbar from './Navbar';

const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);

const todayFormatted = formatDateForInput(today);
const oneMonthAgoFormatted = formatDateForInput(oneMonthAgo);

function Register(props) {
  const [members, setMembers] = useState([]);
  const [practices, setPractices] = useState([]);
  const [selDatef, setDatefake] = useState(todayFormatted);
  const [selDate, setDate] = useState(todayFormatted);
  const [minDatef, setminDatefake] = useState(oneMonthAgoFormatted);
  const [maxDatef, setmaxDatefake] = useState(todayFormatted);
  const [minDate, setminDate] = useState(parseInt(oneMonthAgoFormatted.replace(/-/g, '')));
  const [maxDate, setmaxDate] = useState(parseInt(todayFormatted.replace(/-/g, '')));
  const filterType = '';
  const [type, setType] = useState('Morning');
  const db = getFirestore();
  const showActiveMembers = true;
  const [showTable, setShowTable] = useState(true);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'members'), (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(membersData);
      const initialAttendance = {};
      membersData.forEach(member => {
        initialAttendance[member.id] = 'a';
      });
      setAttendance(initialAttendance);
    });
    return unsubscribe;
  }, [db]); 

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'practices'), (snapshot) => {
    const practiceslist = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setPractices(practiceslist);
  });

  return unsubscribe;
}, [db]);

useEffect(() => {
  if (!members.length || !practices.length) return;

  const todayDate = selDate.replace(/-/g, '');
  const todayPractice = practices.find(practice => {
    const practiceDate = practice.date.toString();
    return practiceDate === todayDate && practice.type === type;
  });

  const initialAttendance = {};
  members.forEach(member => {
    const status = todayPractice ? checkStatus(member.id, [todayPractice]) : 'a';
    initialAttendance[member.id] = status || 'a';
  });
  setAttendance(initialAttendance);
}, [selDate, type, practices, members]);


  const handleAttendanceChange = (memberId, status) => {
    setAttendance(prevAttendance => ({
      ...prevAttendance,
      [memberId]: status
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const presentIds = [];
    const excusedIds = [];
    const lateIds = [];
    
    for (const [memberId, status] of Object.entries(attendance)) {
      if (status === 'p') {
        presentIds.push(memberId);
      } else if (status === 'e') {
        excusedIds.push(memberId);
      } else if (status === 'l') {
        lateIds.push(memberId);
      }
    }

    if (presentIds.length > 0 || excusedIds.length > 0 || lateIds.length > 0) {
      const practicesRef = collection(db, 'practices');
      const q = query(practicesRef, where('type', '==', type), where('date', '==', parseInt(selDate.replace(/-/g, ''))));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, 'practices', docSnapshot.id));
          console.log(`Deleted existing practice with ID: ${docSnapshot.id}`);
        });
      }
      await AddPractice(type, presentIds, excusedIds, lateIds, selDate);
      const initialAttendance = {};
      members.forEach(member => {
        initialAttendance[member.id] = 'a';
      });
      setAttendance(initialAttendance);
      setShowTable(true);
  
    } else {
      console.log("Can't submit empty fields");
    }
  };

  const handleMaxDateChange = (event) => {
    const selectedMaxDateWithHyphens = event.target.value;
    const selectedMaxDateWithoutHyphens = selectedMaxDateWithHyphens.replace(/-/g, '');
    const selectedMaxDateAsInteger = parseInt(selectedMaxDateWithoutHyphens);
    setmaxDatefake(selectedMaxDateWithHyphens);
    setmaxDate(selectedMaxDateAsInteger);
  };

  const handleMinDateChange = (event) => {
    const selectedMinDateWithHyphens = event.target.value;
    const selectedMinDateWithoutHyphens = selectedMinDateWithHyphens.replace(/-/g, '');
    const selectedMinDateAsInteger = parseInt(selectedMinDateWithoutHyphens);
    setminDatefake(selectedMinDateWithHyphens);
    setminDate(selectedMinDateAsInteger);
  };

  const handleDateChange = (event) => {
    const selectedDateWithHyphens = event.target.value;
    setDatefake(selectedDateWithHyphens);
    setDate(selectedDateWithHyphens);
  };  
  
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const filteredMembers = members.filter(member =>
    (!showActiveMembers || member.isActive)
  );

  const filteredpractices = practices.filter(practice =>
    (filterType === '' || practice.type === filterType)
  );

  const filtereddates = practices
  .map(practice => ({ id: practice.id, date: practice.date }))
  .filter(practice => (practice.date >= minDate && practice.date <= maxDate && minDate <= maxDate))
  .sort((a, b) => a.date - b.date);

  const handleAddPractice = () => {
    setShowTable(!showTable);
  };  

  const handleExport = () => {
    const data = sortedMembers.map(member => {  
      const memberData = { "Name": member.name };
      filtereddates.forEach(indate => {
        const practice = filteredpractices.find(practice => practice.date === indate.date);
        if (practice) {
          const status = checkStatus(member.id, [practice]);
          const statusLabel = status === 'p' ? "Present" : 
                              status === 'e' ? "Excused" : 
                              status === 'l' ? "Late" : 
                              "Absent";
          memberData[formatDate(indate.date)] = statusLabel;
        } else {
          memberData[formatDate(indate.date)] = "Absent";
        }
      });
  
      return memberData;
    });
  
    exportToCsv(`Attendance_Band.csv`, data);
  };

  const sortedMembers = filteredMembers.sort((a, b) =>  a.regOrder - b.regOrder);

  const countAttendance = (date) => {
    let count = 0;
  
    filteredMembers.forEach(member => {
      const matchingPractice = filteredpractices.find(p => p.id === date);
      if (matchingPractice) {
        const status = checkStatus(member.id, [matchingPractice]);
        if (status === 'p' || status === 'l') {
          count++;
        }
      }
    });
  
    return { count };
  };  

  return (
    <>
      <Navbar scrolled={true} />
      {showTable && (
        <h1 id="register-heading">Register</h1>
      )
      }
      {showTable ? (
        <>
          <button id="tick-button" onClick={handleAddPractice}>
            <span className="material-icons" style={{"color": "whitesmoke", "verticalAlign": "middle"}}>
              add
            </span>
            <span className="button-text">Add Practice</span>
          </button>
          <button id="tick-button" onClick={handleExport}>
            Export CSV
          </button>
          <br /><br />
          <div>
            <input
              type="date"
              value={minDatef}
              onChange={handleMinDateChange}
            />
            <input
              type="date"
              value={maxDatef}
              onChange={handleMaxDateChange}
            />
            <br /><br /><br />
            <div className='tablediv table-container'>
              <div className="table-border-container">
                <table>
                <thead style={{ "backgroundColor": "#262626" }}>
                  <tr>
                    <th className="pinned-left">Name</th>
                    {filtereddates.map(practice => (
                      <th style={{ "zIndex": '1' }} key={`header-${practice.id}`}>
                        {formatDate(practice.date)}<br />
                        {filteredpractices.find(p => (p.date === practice.date && p.id === practice.id))?.type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                {sortedMembers.map(member => (
                  <tr key={member.id}>
                    <td className="pinned-left" style={{ "zIndex": '1' }}>{member.name}</td>
                    {filtereddates.map(practice => {
                    const matchingPractice = filteredpractices.find(p => (p.date === practice.date && p.id === practice.id));
                    if (!matchingPractice) {
                      return <td key={`empty-${practice.id}`}></td>;
                    }
                    const status = checkStatus(member.id, [matchingPractice]);
                    return (
                      <td key={`status-${member.id}-${practice.id}-${status}`}>
                            {status === 'p' ? 
                            <span className="material-icons" style={{ color: 'green' }}>
                              check_circle
                            </span>
                            : status === 'a' ? 
                            <span className="material-icons" style={{ color: 'red' }}>
                              cancel
                            </span>
                            : status === 'e' ?
                            <span className="material-icons" style={{ color: 'orange' }}>
                              trip_origin
                            </span>
                            : status === 'l' ?
                            <span className="material-icons" style={{ color: 'green' }}>
                              schedule
                            </span>
                            :
                            <></>
                            }
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td className="pinned-left" style={{ zIndex: '1' }}>Total</td>
                    {filtereddates.map(practice => {
                      const { count } = countAttendance(practice.id);
                      return (
                        <td key={`count-${practice.id}`}>
                            <h3 style={{ color: 'green' }}>{count}</h3>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <button id="tick-button" onClick={handleAddPractice}>
            <span className="material-icons" id="add-tick" style={{ color: 'whitesmoke' }}>
              arrow_back
            </span>{" "}
            View table
          </button>
          <form onSubmit={handleSubmit}>
            <h3>Type:&nbsp;
              <select value={type} onChange={handleTypeChange}>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Event">Event</option>
              </select><br />
              <input
                id="date_reg"
                type="date"
                value={selDatef}
                onChange={handleDateChange}
              />
            </h3>
            <div className="table-container-col">
              <table className="mark">
                <thead>
                  <tr id="mark">
                    <th id="name-col-mark">Name</th>
                    <th id="col-mark"><span className="material-icons" style={{ color: 'green' }}>check_circle</span></th>
                    <th id="col-mark"><span className="material-icons" style={{ color: 'green' }}>schedule</span></th>
                    <th id="col-mark"><span className="material-icons" style={{ color: 'red' }}>cancel</span></th>
                    <th id="col-mark"><span className="material-icons" style={{ color: 'orange' }}>trip_origin</span></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMembers.map((member) => (
                    <tr id="mark" key={member.id}>
                      <td id="name-col-mark">{member.name}</td>
                      <td className="radia">
                        <input
                          type="radio"
                          name={`attendance-${member.id}`}
                          value="p"
                          checked={attendance[member.id] === 'p'}
                          onChange={() => handleAttendanceChange(member.id, 'p')}
                        />
                      </td>
                      <td className="radia">
                        <input
                          type="radio"
                          name={`attendance-${member.id}`}
                          value="l"
                          checked={attendance[member.id] === 'l'}
                          onChange={() => handleAttendanceChange(member.id, 'l')}
                        />
                      </td>
                      <td className="radia">
                        <input
                          type="radio"
                          name={`attendance-${member.id}`}
                          value="a"
                          checked={attendance[member.id] === 'a'}
                          onChange={() => handleAttendanceChange(member.id, 'a')}
                        />
                      </td>
                      <td className="radia">
                        <input
                          type="radio"
                          name={`attendance-${member.id}`}
                          value="e"
                          checked={attendance[member.id] === 'e'}
                          onChange={() => handleAttendanceChange(member.id, 'e')}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button id="submit" type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

export default Register;