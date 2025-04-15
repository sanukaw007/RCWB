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