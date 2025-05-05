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

import PropTypes from 'prop-types';
import './Members.css';
import { collection, getFirestore, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';

function Members(props) {
  const [name, setName] = useState('');
  const [instrument, setInstrument] = useState('');
  const [memclass, setClasses] = useState('');
  const [batch, setBatch] = useState('');
  const [tp, setTp] = useState('');
  const [regOrder, setregOrder] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'instrument') {
      setInstrument(value);
    } else if (name === 'memclass') {
      setClasses(value);
    } else if (name === 'batch') {
      setBatch(value);
    } else if (name === 'tp') {
      setTp(value);
    } else if (name === 'regOrder') {
      setregOrder(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (instrument === '') {
      alert("Please select an instrument.");
      return;
    }
    if (memclass === '') {
      alert("Please enter the class.");
      return;
    }
    const isActive = true;
    const db = getFirestore();
    await addDoc(collection(db, 'members'), { name, instrument, memclass, batch, tp, isActive, regOrder });
    setName('');
    setInstrument('');
    setClasses('');
    setBatch('');
    setTp('');
    setregOrder();
  };

  const [members, setMembers] = useState([]);
  const db = getFirestore();
  const [searchName, setSearchName] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [searchBatch, setSearchBatch] = useState('');
  const [filterInstrument, setFilterInstrument] = useState('');
  const [showActiveMembers, setShowActiveMembers] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'members'), (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [db]);

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleSearchClassChange = (event) => {
    setSearchClass(event.target.value);
  };

  const handleSearchBatchChange = (event) => {
    setSearchBatch(event.target.value);
  };

  const handleFilterInstrumentChange = (event) => {
    setFilterInstrument(event.target.value);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchName.toLowerCase()) &&
    member.memclass.toLowerCase().includes(searchClass.toLowerCase()) &&
    (searchBatch === '' || member.batch === searchBatch) &&
    (filterInstrument === '' || member.instrument === filterInstrument) &&
    (!showActiveMembers || member.isActive)
  );

  const sortedMembers = filteredMembers.sort((a, b) =>  a.regOrder - b.regOrder);

  const uniqueInstruments = [...new Set(members.map(member => member.instrument))];

async function changeActive(memberId, { turnisactive }) {
    const memberRef = doc(db, "members", memberId);  
    await updateDoc(memberRef, {
      isActive: turnisactive
    });
  }  

  return (
    <>
    <Navbar isAdmin={props.isAdmin} scrolled={true} />
    <div className="search-container"></div>
      <h1>Members</h1>
      <div className='wrapper'>
        <div className='left-panel'>
          <form id="member-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label><br />
              <input type="text" id="name" name="name" value={name} onChange={handleChange} placeholder='A. B. C. Perera' required />
            </div>
            <div className="form-group">
              <label htmlFor="instrument">Instrument</label><br />
              <select id="instrument" name="instrument" value={instrument} onChange={handleChange} required>
                <option value="">Select instrument</option>
                <option value="Alto Saxophone">Alto Saxophone</option>
                <option value="Bass Drum">Bass Drum</option>
                <option value="Clarinet">Clarinet</option>
                <option value="Euphonium">Euphonium</option>
                <option value="Flute">Flute</option>
                <option value="Side Drum">Side Drum</option>
                <option value="Tenor Saxophone">Tenor Saxophone</option>
                <option value="Trombone">Trombone</option>
                <option value="Trumpet">Trumpet</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="memclass">Class</label><br />
              <input type="text" id="memclass" name="memclass" value={memclass} onChange={handleChange} placeholder='6A' required />
            </div>
            <div className="form-group">
              <label htmlFor="batch">Batch</label><br />
              <input type="number" id="batch" name="batch" value={batch} onChange={handleChange} placeholder='O/L year' required />
            </div>
            <div className="form-group">
              <label htmlFor="tp">Telephone</label><br />
              <input type="tel" id="tp" name="tp" value={tp} onChange={handleChange} placeholder='0712345678' required />
            </div>
            <div className="form-group">
              <label htmlFor="regOrder">Register Order</label><br />
              <input type="number" id="regOrder" name="regOrder" value={regOrder} onChange={handleChange} placeholder='1' required />
            </div>
            <button type="submit" id="upload-button">Add Member</button>
          </form>
        </div>

        <div className='right-panel'>
          <div className='tablediv visible-scrollbar'>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name
                    <input
                      type="text"
                      value={searchName}
                      onChange={handleSearchNameChange}
                      placeholder="Search by name"
                      className='filter'
                    />
                  </th>
                  <th>Instrument
                    <select className='filter' value={filterInstrument} onChange={handleFilterInstrumentChange}>
                      <option value="">All</option>
                      {uniqueInstruments.map(instrument => (
                        <option key={instrument} value={instrument}>{instrument}</option>
                      ))}
                    </select>
                  </th>
                  <th>Class
                    <input
                      type="text"
                      value={searchClass}
                      onChange={handleSearchClassChange}
                      placeholder="Search by class"
                      className='filter'
                    />
                  </th>
                  <th>Batch
                    <input
                      type="number"
                      value={searchBatch}
                      onChange={handleSearchBatchChange}
                      placeholder="Search by O/L year"
                      className='filter'
                    />
                  </th>
                  <th id='thtop'>Telephone</th>
                  <th id='thtop'>Active
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={showActiveMembers}
                        onChange={() => setShowActiveMembers(!showActiveMembers)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.regOrder}</td>
                    <td>{member.name}</td>
                    <td>{member.instrument}</td>
                    <td>{member.memclass}</td>
                    <td>{member.batch}</td>
                    <td>{member.tp}</td>
                    <td>
                      {member.isActive ? (
                        <button onClick={() => changeActive(member.id, { turnisactive: false })}>
                          <span className="material-icons" style={{ color: 'green' }}>
                            done
                          </span>
                        </button>
                      ) : (
                        <button onClick={() => changeActive(member.id, { turnisactive: true })}>
                          <span className="material-icons" style={{ color: 'red' }}>
                            clear
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

Members.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default Members;