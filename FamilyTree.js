let members = [];

function getChildren(name) {
  return members
    .filter(m => m.father === name || m.mother === name)
    .map(c => c.name);
}

function getSiblings(member) {
  return members
    .filter(m =>
      m.name !== member.name &&
      m.father === member.father &&
      m.mother === member.mother &&
      member.father !== "" &&
      member.mother !== ""
    )
    .map(s => s.name);
}

function getSpouse(name) {
  let spouse = "";

  members.forEach(m => {
    if (m.father === name && m.mother) spouse = m.mother;
    if (m.mother === name && m.father) spouse = m.father;
  });

  return spouse;
}

function renderTable() {
  const tbody = document.querySelector("#membersTable tbody");
  tbody.innerHTML = "";

  members.forEach((member, index) => {
    const children = getChildren(member.name);
    const siblings = getSiblings(member);
    const spouse = getSpouse(member.name);

    const row = `
      <tr>
        <td>${member.name}</td>
        <td>${member.gender}</td>
        <td>${member.dob || "-"}</td>
        <td>${member.father || "-"}</td>
        <td>${member.mother || "-"}</td>
        <td>${spouse || "-"}</td>
        <td>${children.length > 0 ? children.join(", ") : "-"}</td>
        <td>${siblings.length > 0 ? siblings.join(", ") : "-"}</td>
        <td>
          <button onclick="editMember(${index})">Edit</button>
          <button onclick="deleteMember(${index})">Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function updateParentDropdowns() {
  const fatherSelect = document.getElementById("father");
  const motherSelect = document.getElementById("mother");

  fatherSelect.innerHTML = `<option value="">-- Select Father --</option>`;
  motherSelect.innerHTML = `<option value="">-- Select Mother --</option>`;

  members.forEach(member => {
    if (member.gender === "Male") {
      fatherSelect.innerHTML += `<option value="${member.name}">${member.name}</option>`;
    }
    if (member.gender === "Female") {
      motherSelect.innerHTML += `<option value="${member.name}">${member.name}</option>`;
    }
  });
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("gender").value = "";
  document.getElementById("dob").value = "";
  document.getElementById("father").value = "";
  document.getElementById("mother").value = "";
  document.getElementById("editIndex").value = "";

  document.querySelector("button[type='submit']").innerText = "Add Member";
}

document.getElementById("memberForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;
  const father = document.getElementById("father").value;
  const mother = document.getElementById("mother").value;
  const editIndex = document.getElementById("editIndex").value;

  const newMember = { name, gender, dob, father, mother };

  if (editIndex === "") {
    members.push(newMember);
  } else {
    members[editIndex] = newMember;
  }

  renderTable();
  updateParentDropdowns();
  clearForm();
});

function editMember(index) {
  const m = members[index];

  document.getElementById("name").value = m.name;
  document.getElementById("gender").value = m.gender;
  document.getElementById("dob").value = m.dob;

  updateParentDropdowns();

  document.getElementById("father").value = m.father;
  document.getElementById("mother").value = m.mother;

  document.getElementById("editIndex").value = index;

  document.querySelector("button[type='submit']").innerText = "Update Member";
}

function deleteMember(index) {
  members.splice(index, 1);
  renderTable();
  updateParentDropdowns();
}

updateParentDropdowns();
