// C:\Users\jakea\Basic_CRUD_Application\backend\src\utils\ageCalc.js

function calculateAge(dobString) {
  if (!dobString) return 0;
  
  const today = new Date();
  const birthDate = new Date(dobString);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 0 ? age : 0;
}

module.exports = calculateAge;