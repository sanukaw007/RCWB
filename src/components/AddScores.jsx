// Copyright (C) 2025 Sanuka Weerabaddana

import { useState } from 'react';
import './AddScores.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function AddScores() {
    const [name, setName] = useState('');
    const [instrument, setInstrument] = useState('');
    const [type, setType] = useState('');
    const [file, setFile] = useState('No file chosen');
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setName(value);
        } else if (name === 'instrument') {
            setInstrument(value);
        } else if (name === "type") {
            setType(value);
        } else if (name === 'file') {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (instrument === "") {
            alert("Please select an instrument.");
            return;
        }
        if (type === "") {
            alert("Please select a type of music.");
            return;
        }
        const storage = getStorage();
        const filename = '' ? 'No file chosen' : file.name;
        const storageRef = ref(storage, `music/${instrument}/${filename}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        const db = getFirestore();
        await addDoc(collection(db, 'music'), { name, instrument, downloadUrl, type, filename });
        setName('');
        setInstrument('');
        if (filename != 'No file chosen') {
            setFile('No file chosen')
        }
    };

    return(
        <> 
            <h2 id='h2'>Add Scores</h2>
            <form id="music-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Name</label><br />
                <input type="text" id="name" name="name" value={name} onChange={handleChange} placeholder='School of our Fathers' required />
            </div>
            <div className="form-group">
                <label htmlFor="instrument">Instrument</label><br />
                <select id="instrument" name="instrument" value={instrument} onChange={handleChange} required>
                    <option value="">Select instrument</option>
                    <option value="Alto Saxophone">Alto Saxophone</option>
                    <option value="Clarinet">Clarinet</option>
                    <option value="Euphonium">Euphonium</option>
                    <option value="Flute">Flute</option>
                    <option value="Tenor Saxophone">Tenor Saxophone</option>
                    <option value="Trombone">Trombone</option>
                    <option value="Trumpet">Trumpet</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="type">Type</label><br />
                <select id="type" name="type" value={type} onChange={handleChange} required>
                    <option value="">Select type</option>
                    <option value="Song">Song</option>
                    <option value="March">March</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="file">Upload File</label><br />
                <input type="file" id="file" accept=".pdf" name="file" onChange={handleChange} required />
            </div>
            <button type="submit" id="upload-button">Upload</button>
        </form>
        </>
    )
}

export default AddScores