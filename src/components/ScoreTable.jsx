
import { collection, getFirestore, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';

function ScoreTable({ admin: propIsadmin, instrument: propInstrument}) {
    const [musics, setMusics] = useState([]);
    const db = getFirestore();
    const [searchName, setSearchName] = useState('');
    const [filterInstrument, setFilterInstrument] = useState('');
    const [filterType, setFilterType] = useState('');
    useEffect(
        () => 
        onSnapshot(collection(db, "music"), (snapshot) =>
            setMusics(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        ),
        []
    );
    const del = async (id, instrument, filename) => {
        try {
          const storage = getStorage();
          await deleteDoc(doc(db, 'music', id));
          await deleteObject(ref(storage, `music/${instrument}/${filename}`))
          setMusics(prevData => prevData.filter(music => music.id !== id));
        } catch (error) {
          console.error('Error deleting document: ', error);
        }
    };
    const handleSearchNameChange = (event) => {
        setSearchName(event.target.value);
    };

    const handleFilterInstrumentChange = (event) => {
        setFilterInstrument(event.target.value);
    };

    const handleFilterTypeChange = (event) => {
        setFilterType(event.target.value);
    };

    const filteredMusics = musics.filter(music => 
        music.name.toLowerCase().includes(searchName.toLowerCase()) &&
        (propInstrument === 'none' 
          ? (filterInstrument === '' || music.instrument === filterInstrument) 
          : music.instrument === propInstrument) &&
        (filterType === '' || music.type === filterType)
    );      

    const uniqueInstruments = [...new Set(musics.map(music => music.instrument))];
    const uniqueTypes = [...new Set(musics.map(music => music.type))];

    return(
        <>
            <div className={`tablediv visible-scrollbar ${propIsadmin === false ? 'fullwidth' : ''}`}>
                    <table>
                        <thead>
                            <tr>
                                <th>Name<br />
                                <input 
                                    className='filter'
                                    type="text" 
                                    value={searchName} 
                                    onChange={handleSearchNameChange} 
                                    placeholder="Search by name"
                                />
                                </th>
                                {propInstrument == 'none' && 
                                    <th>Instrument<br />
                                    <select className='filter' value={filterInstrument} onChange={handleFilterInstrumentChange}>
                                        <option value="">All</option>
                                        {uniqueInstruments.map(instrument => (
                                        <option key={instrument} value={instrument}>{instrument}</option>
                                        ))}
                                    </select>
                                    </th>
                                }
                                <th>Type<br />
                                <select className='filter' value={filterType} onChange={handleFilterTypeChange}>
                                    <option value="">All</option>
                                    {uniqueTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                </th>
                                <th id='thtop'>File<br /></th>
                                {propIsadmin === true && 
                                    <th id='thtop'>Delete<br /></th>
                                }
                            </tr>
                        </thead>
                    {filteredMusics.map((music) => (
                    <tbody key={music.id}>
                        <tr>
                            <td>{music.name}</td>
                            {propInstrument == 'none' && 
                                <td>{music.instrument}</td>
                            }
                            <td>{music.type}</td>
                            <td className='ellipsis limit-table-width'><a href={music.downloadUrl}>{music.filename}</a></td>
                            {propIsadmin === true && 
                            <td>
                                <span 
                                    className="material-icons" 
                                    style={{cursor: 'pointer'}} 
                                    onClick={() => del(music.id, music.instrument, music.filename)}
                                    >
                                    delete
                                </span>
                            </td>
                            }
                        </tr>
                    </tbody>
                    ))}
                    </table>
            </div>
    </>
    )
}

export default ScoreTable