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

import { collection, addDoc, getFirestore } from 'firebase/firestore';
  
const AddPractice = async (type, presentIds, excusedIds, lateIds, selDate) => {
    try {
      const db = getFirestore();
      const docRef = await addDoc(collection(db, 'practices'), {
        type: type,
        present: presentIds,
        late: lateIds,
        excused: excusedIds,
        date: parseInt(selDate.replace(/-/g, '')),
      });
  
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
};

function formatDate(number) {
  const numStr = number.toString();
  if (numStr.length !== 8) {
    throw new Error('The input number must be exactly 8 digits.');
  }
  const part1 = numStr.slice(0, 4);
  const part2 = numStr.slice(4, 6);
  const part3 = numStr.slice(6, 8);
  const formattedDate = `${part3}.${part2}.${part1}`;

  return formattedDate;
}

function checkStatus(memberId, practices) {
  for (const practice of practices) {
    if (practice.present.includes(memberId)) {
      return 'p';
    } else if (practice.late.includes(memberId)) {
      return 'l';
    } else if (practice.excused.includes(memberId)) {
      return 'e';
    } else {
      return 'a';
    } 
  }
}

export { AddPractice, formatDate, checkStatus }