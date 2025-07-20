
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
    case "admin":
        // populate dropdown with whatever students teachers have or all for admins
        await getDropdownViewUnselected(data.id);
        break;
    case "parent":
        if (data.childIds.length > 1) { 
            // parent of more than one student
            await getDropdownViewUnselected(data.id);
        }
        else {
            // parent of one student
            const studentLoginId = await getUidFromInternalId(data.childIds[0]);
            const studentData = await getUserDataByUid(studentLoginId);
            await getSingleStudentView(studentData, studentLoginId);
        }
        break;
    case "student":
        // Automatically show student view
        await getSingleStudentView(data, user.uid);
        break;
  }
});


// ===================================================
// GET PAGE STARTED WITH DROPDOWN MENU, NO STUDENT SELECTED YET
// ===================================================
async function getDropdownViewUnselected(internalId) {  // userId = firestore login id of viewer (parent, teacher, admin)
    let html = `<h1 id="competency-page-title">Competencies</h1>
                <div id="dropdown-and-instructions">
                    <label for="student-dropdown" class="visually-hidden">Select Student:</label>
                    <select id="student-dropdown" name="student">
                        <option value="" disabled selected>- Select Student -</option>`;
    switch (internalId[0]) {
        case "a":
            const studentsIds = await getAllStudentIds();
            for (const student of studentsIds) {
                const studentUid = await getUidFromInternalId(student);
                const studentData = await getUserDataByUid(studentUid);
                html += `<option value="${studentUid}">${studentData.name}</option>`;
            };
            html += `</select>
                    <p>To pass off competency, type signiture then click "Incomplete" button.</p>
                </div>`;
            break;
        case "t":
            const teacherUid = await getUidFromInternalId(internalId);
            const teacherData = await getUserDataByUid(teacherUid);
            for (const student of teacherData.students) {
                const studentUid = await getUidFromInternalId(student);
                const studentData = await getUserDataByUid(studentUid);
                html += `<option value="${studentUid}">${studentData.name}</option>`;
            };
            html += `</select>
                    <p>To pass off competency, type signiture then click "Incomplete" button.</p>
                </div>`;
            break;
        case "p":
            const parentLoginId = await getUidFromInternalId(internalId);
            const parentData = await getUserDataByUid(parentLoginId);
            for (const child of parentData.childIds) {
                const childUid = await getUidFromInternalId(child);
                const childData = await getUserDataByUid(childUid);
                html += `<option value="${childUid}">${childData.name}</option>`;
            };
            html += `</select>
                </div>`;
            break;
    }
    html += `<div id="category-boxes-container"></div>`
    // insert title and populated dropdown menu
    document.getElementById("dynamically-update").innerHTML = html;
    // add event listener to newly created dropdown menu to update page on student selection
    document.getElementById("student-dropdown").addEventListener("change", getStudentViewWithSelectedDropdown);
}


// ===================================================
// FETCH COMPETENCIES AND INSERT BELOW DROPDOWN
// ===================================================
async function getStudentViewWithSelectedDropdown(event) {
    const uid = event.target.value;

    // Get data and HTML
    const competencyData = await getCompetencyStatus(uid);
    const categoryBoxes = getCategoryBoxesHTML(competencyData);

    const categoryBoxesContainer = document.getElementById("category-boxes-container");
    // erase any previous students information and replace with current selected student competencies
    categoryBoxesContainer.innerHTML = categoryBoxes;
}


// ===================================================
// LOAD COMPETENCIES HTML FOR ONE STUDENT VIEW
// ===================================================
async function getSingleStudentView(studentData, userId) {  // userId = firestore login id
    const competencyData = await getCompetencyStatus(userId); // Pull from Firestore
    const categoryBoxes = getCategoryBoxesHTML(competencyData); // Build UI HTML

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
// ===================================================
// GET LOGIN UID FROM GENERIC ID
// ===================================================
/*
 * Retrieves the Firebase Authentication UID (login ID) for a given internal ID (students, parents, teachers, admins).
 *
 * Parameters:
 *   - internalId (string): The internal user ID (e.g., "s001", "p002", "t005", "a010")
 *
 * Returns:
 *   - (string|null): The UID corresponding to the internalId, or null if not found
 *
 * This function searches the 'users' collection for a document with a field
 * 'id' that matches the given value, then returns the document ID (which is the UID).
 */
async function getUidFromInternalId(internalId) {
  try {
    // Query the 'users' collection where the 'id' field matches the provided internalId
    const snapshot = await db.collection("users")
      .where("id", "==", internalId)
      .limit(1)
      .get();

    // If no matching documents were found, log a warning and return null
    if (snapshot.empty) {
      console.warn(`No user found with id: ${internalId}`);
      return null;
    }

    // Get the first document from the query result
    const userDoc = snapshot.docs[0];

    // The document ID is the Firebase Authentication UID
    const loginUid = userDoc.id;

    // Return the UID
    return loginUid;

  } catch (error) {
    // Log and return null if there's an error during the query
    console.error("Error getting UID from internalId:", error);
    return null;
  }
}


// ===================================================
// GET USER DATA BY UID
// ===================================================
/*
 * Fetches all data fields of a user from Firestore given their UID.
 * Works for students, parents, teachers, admins — any user.
 * 
 * Parameters:
 *   - uid (string): The Firebase Authentication UID for the user.
 * 
 * Returns:
 *   - (object|null): Returns an object containing the user's data fields if found, or null if no user exists or on error.
 */
async function getUserDataByUid(uid) {
  try {
    // Reference the document in the 'users' collection by the user's UID
    const docRef = db.collection("users").doc(uid);
    
    // Attempt to fetch the document snapshot
    const docSnap = await docRef.get();

    // Check if the document exists
    if (!docSnap.exists) {
      // Log a warning if no user document was found for the given UID
      console.warn(`No user found with UID: ${uid}`);
      return null; // Return null if no user found
    }

    // Return the data object containing all the user's fields
    return docSnap.data();

  } catch (error) {
    // Log any error that occurs during the fetch process
    console.error("Error getting user data:", error);
    return null; // Return null on error
  }
}

// ===================================================
// GETS ALL STUDENT IDS (s001, s002 ...) IN THE DATABASE
// ===================================================
async function getAllStudentIds() {
  try {
    const snapshot = await db.collection("users")
      .where("role", "==", "student")
      .get();

    if (snapshot.empty) {
      console.log("No students found.");
      return [];
    }

    // Extract and return the student internal IDs (field 'id') or UIDs (doc IDs)
    const studentIds = snapshot.docs.map(doc => {
      const data = doc.data();
      return data.id; // or doc.id for login UID if you want that
    });

    return studentIds;

  } catch (error) {
    console.error("Error getting all student IDs:", error);
    return [];
  }
}
