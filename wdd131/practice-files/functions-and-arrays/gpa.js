

function getGrades(inputSelector) {
  // get grades from the input box
  let grades = document.getElementById("grades").value;
  // split them into an array (String.split(',')) 
  grades = grades.split(',');
  // clean up any extra spaces, and make the grades all uppercase. (Array.map())
  const cleanedGrades = grades.map(grade => grade.trim().toUpperCase());
  // return grades
  return cleanedGrades;
}

function lookupGrade(grade) {
  // converts the letter grade to it's GPA point value and returns it
  if (grade === "A") {return 4}
  else if (grade === "B") {return 3}
  else if (grade === "C") {return 2}
  else if (grade === "D") {return 1}
  else if (grade === "F") {return 0}
}

function calculateGpa(grades) {
  // gets a list of grades passed in
  // convert the letter grades to gpa points
  const gpaPoints = grades.map(grade => lookupGrade(grade));
  // calculates the GPA
  let total = 0;
  gpaPoints.forEach(point => {
    total += point;
  });
  // return the GPA
  return (total / gpaPoints.length).toFixed(2);
}

function outputGpa(gpa, selector) {
  // takes a gpa value and displays it in the HTML in the element identified by the selector
  const outElement = document.querySelector(selector);
  outElement.innerText = gpa;
}

function clickHandler() {
  // when the button in our html is clicked:
  // get the grades entered into the input
  const grades = getGrades();
  // calculate the gpa from the grades entered
  const gpa = calculateGpa(grades);
  // display the gpa
  outputGpa(gpa, "#output");
}


document
    .querySelector("#submitButton")
    .addEventListener("click", clickHandler);