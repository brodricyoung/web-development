
// ======================
// LOGIN FUNCTIONALITY
// ======================

// Handles user login using Firebase Authentication
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    console.log("User logged in:", cred.user);
    
    // Redirect user to home page after login
    window.location.href = "home.html";
  } catch (err) {
    console.error("Login failed:", err.message);
  }
}

// Handles logout and returns user to home page
async function logout() {
  try {
    await auth.signOut();
    console.log("User logged out");

    // Redirect to home page after logout
    window.location.href = "home.html";

    // Hide logout button
    document.getElementById("logout-btn").style.display = "none";
  } catch (err) {
    console.error("Logout failed:", err.message);
  }
}

// ===================================================
// AUTH STATE LISTENER — Runs when auth state changes
// ===================================================
auth.onAuthStateChanged(async (user) => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  if (user) {
    // User is logged in
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    // User is logged out
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    return; // Exit early if no user is logged in
  }

  // Fetch user role from Firestore
  const docRef = db.collection("users").doc(user.uid);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    console.error("No Firestore user doc found!");
    return;
  }

  const data = docSnap.data();
  const role = data.role;

  // SWITCH BASED ON ROLE
  switch (role) {
    case "teacher":
      // TODO: Show teacher dashboard or options
      break;
    case "admin":
      // TODO: Show admin interface
      break;
    case "parent":
      // TODO: If more than one child, show selection screen
      // if (data.childIds.length > 1) { ... }
      // else {
      //     getSingleStudentView(data, user.uid)
      // }
      break;
    case "student":
      // Automatically show student view
      await getSingleStudentView(data, user.uid);
      break;
  }
});

// ===================================================
// LOAD COMPETENCIES FOR ONE STUDENT
// ===================================================
async function getSingleStudentView(studentData, userId) {
  const competencyData = await getCompetencyStatus(userId); // Pull from Firestore
  const categoryBoxes = getCategoryBoxesHTML(competencyData); // Build UI HTML

  console.log("Boxes");
  console.log(categoryBoxes);

  // Inject generated HTML into the page
  let html = `<h1 id="competency-page-title">Competencies: ${studentData.name}</h1>`;
  html += categoryBoxes;

  const mainElement = document.getElementById("dynamically-update");
  mainElement.innerHTML = html;
}

// ===================================================
// BUILD HTML FOR COMPETENCY BOXES
// ===================================================
function getCategoryBoxesHTML(competencyData) {
  console.log("Received competencyData:", competencyData);
  let html = ``;

  // Loop through each major category: knowledge, skills, dispositions
  for (const category in competencyData) {
    const competencies = competencyData[category];

    html += `
      <div class="category-box ${category}"> 
        <div class="category-name-and-img">
          <h2>${category.toUpperCase()}</h2>
          <img src="images/${category}.png" alt="">
        </div>
        <div class="competencies-box">
          <div class="required">
          <p>Required:</p>`;

    // Render required competencies
    competencies.forEach(competency => {
      if (competency.requirement === "required") {
        let signedBy = competency.signedBy !== "" ? competency.signedBy : "Signature";
        html += `
          <div class="competency">
            <label for="signature" class="visually-hidden">Signature:</label>
            <input type="text" id="signature" name="signature" placeholder="${signedBy}">
            <button class="marker-${competency.status}">${competency.status}</button>
            <span class="competency-text-required">&bull; ${competency.text}</span>
          </div>`;
      }
    });

    // Render optional competencies
    html += `
        </div>
        <div class="optional">
          <p>Optional:</p>`;
    competencies.forEach(competency => {
      if (competency.requirement === "optional") {
        let signedBy = competency.signedBy !== "" ? competency.signedBy : "Signature";
        html += `
          <div class="competency">
            <label for="signature" class="visually-hidden">Signature:</label>
            <input type="text" id="signature" name="signature" placeholder="${signedBy}">
            <button class="marker-${competency.status}">${competency.status}</button>
            <span class="competency-text-optional">&bull; ${competency.text}</span>
          </div>`;
      }
    });

    // Add subject tags beneath each section
    switch (category) {
      case "knowledge":
        html += `</div>
            </div>
            <div class="subjects-box">
              <ul class="subjects">
                <li>Science</li><li>Technology</li><li>Engineering</li>
                <li>Math</li><li>Humanities</li><li>American Cit.</li>
                <li>Healthy Living</li><li>Communications</li>
              </ul>
            </div>
          </div>`;
        break;
      case "skills":
        html += `</div>
            </div>
            <div class="subjects-box">
              <ul class="subjects">
                <li>Communications</li><li>Critical Thinking</li>
                <li>Collaboration</li><li>Informed Decision</li>
                <li>Making</li><li>Creativity</li>
              </ul>
            </div>
          </div>`;
        break;
      case "dispositions":
        html += `</div>
            </div>
            <div class="subjects-box">
              <ul class="subjects">
                <li>Creativity</li><li>Hard work</li>
                <li>Respect</li><li>Integrity</li>
              </ul>
            </div>
          </div>`;
        break;
    }
  }

  return html;
}

// ===================================================
// LOAD COMPETENCY STATUS FROM FIRESTORE
// ===================================================
async function getCompetencyStatus(userId) {
  const docRef = db.collection("users").doc(userId).collection("competencies").doc("all");
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    console.log("No competencies found.");
    return null;
  }

  const data = docSnap.data();
  console.log("Competencies found:", data);

  // Data looks like:
  // {
  //   knowledge: [ { requirement, text, status, signedBy }, ... ],
  //   skills: [ ... ],
  //   dispositions: [ ... ]
  // }
  return data;
}

// ===================================================
// SAVE COMPETENCY STATUS (will implement later)
// ===================================================
/*
async function saveCompetencyStatus(studentId, competencyKey, status, signature) {
  await db.collection("students")
    .doc(studentId)
    .collection("competencies")
    .doc(competencyKey)
    .set({
      status: status,
      signedBy: signature
    }, { merge: true });
}
*/
