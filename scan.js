/* =========================================================
   Bharat.io – QR Scan Engine (Business Website Version)
   File: scan.js
========================================================= */


/* ===============================
   CONFIGURATION
================================ */

const SHEET_API =
"https://opensheet.elk.sh/12OsU8oViB-MztQLh1Ly7zSCPOaCAPBWb45TtUpIcg2c/Form%20Responses%201";


/* ===============================
   GLOBAL ELEMENTS
================================ */

const container = document.querySelector(".container");
const ownerContainer = document.getElementById("ownerData");


/* ===============================
   HELPER FUNCTIONS
================================ */

function getParam(name){

const params = new URLSearchParams(window.location.search);

return params.get(name);

}


function escapeHTML(text){

if(!text) return "";

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")

}


function normalize(value){

if(!value) return "";

return String(value).trim();

}



/* ===============================
   LOADING UI
================================ */

function showLoading(){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>Loading Profile</h3>

<p>Please wait while we retrieve profile information.</p>

</div>

`;

}



/* ===============================
   ERROR UI
================================ */

function showError(){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>System Error</h3>

<p>Unable to load profile information.</p>

</div>

`;

}



/* ===============================
   BUILD OWNER UI
================================ */

function renderOwner(record){

const vehicle = escapeHTML(record["Vehicle Number"]);
const phone = escapeHTML(record["Mobile Number"]);
const profession = escapeHTML(record["Profession / Business Title"]);
const email = escapeHTML(record["Email (Optional)"]);
const work = escapeHTML(record["Work Description (Max 30–40 words)"]);


/* ===============================
   BUSINESS DATA
================================ */

const company = escapeHTML(record["Business Name (Optional)"]);
const services = escapeHTML(record["Services"]);
const website = escapeHTML(record["Business Website (Optional)"]);
const instagram = escapeHTML(record["Instagram Profile Link (Optional)"]);
const facebook = escapeHTML(record["Facebook Page Link (Optional)"]);
const photo = escapeHTML(record["Business Photo Link (Optional)"]);
const map = escapeHTML(record["Google Maps Location"]);


/* ===============================
   VEHICLE MODE
================================ */

if(!company){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>Vehicle Contact</h3>

<div class="info-row">

<span class="label">Vehicle</span>

<span class="value">${vehicle}</span>

</div>

${profession ? `

<div class="profile-block">

<span class="label">Profession</span>

<p class="profile-text">${profession}</p>

</div>

` : ""}

${work ? `

<div class="profile-block">

<span class="label">About</span>

<p class="profile-text">${work}</p>

</div>

` : ""}

<div class="action-buttons">

${phone ? `
<a href="tel:${phone}" class="btn-primary full">📞 Call</a>
` : ""}

${phone ? `
<a href="https://wa.me/${phone.replace(/\D/g,"")}" class="btn-secondary full">💬 WhatsApp</a>
` : ""}

${email ? `
<a href="mailto:${email}" class="btn-secondary full">✉ Email</a>
` : ""}

</div>

</div>

`;

return;

}


/* ===============================
   BUSINESS WEBSITE MODE
================================ */

ownerContainer.innerHTML = `

<div class="profile-website">

${photo ? `
<div class="profile-hero">
<img src="${photo}">
</div>
` : ""}

<div class="profile-header">

<div class="company-name">${company}</div>

<div class="company-title">${profession || ""}</div>

</div>

${work ? `
<div class="profile-about">

<h4>About</h4>

<p>${work}</p>

</div>
` : ""}

${services ? `
<div class="profile-services">

<h4>Services</h4>

${services.split(",").map(s=>`
<div class="service-item">${escapeHTML(s)}</div>
`).join("")}

</div>
` : ""}

<div class="profile-contact">

${phone ? `
<a href="tel:${phone}" class="btn-primary full">📞 Call</a>
` : ""}

${phone ? `
<a href="https://wa.me/${phone.replace(/\D/g,"")}" class="btn-secondary full">💬 WhatsApp</a>
` : ""}

${email ? `
<a href="mailto:${email}" class="btn-secondary full">✉ Email</a>
` : ""}

${website ? `
<a href="${website}" target="_blank" class="btn-secondary full">🌐 Website</a>
` : ""}

${instagram ? `
<a href="${instagram}" target="_blank" class="btn-secondary full">📸 Instagram</a>
` : ""}

${facebook ? `
<a href="${facebook}" target="_blank" class="btn-secondary full">👍 Facebook</a>
` : ""}

</div>

${map ? `

<div class="map-box">

<iframe
src="https://maps.google.com/maps?q=${encodeURIComponent(map)}&output=embed">
</iframe>

</div>

` : ""}

</div>

`;

document.getElementById("orderBtn").style.display = "block";

}



/* ===============================
   MAIN FUNCTION
================================ */

function initQR(){

const qrId = normalize(getParam("id"));

if(!qrId){

container.innerHTML = `

<h2>Invalid QR Code</h2>

<p>Please scan the sticker again.</p>

`;

return;

}

showLoading();

fetch(SHEET_API)

.then(res => res.json())

.then(data => {

const record = data.find(

row => normalize(row["Sticker ID"]) === qrId

);

if(!record){

window.location.href =
"register.html?id=" + encodeURIComponent(qrId);

return;

}

const consent = normalize(record["Consent (Required)"]).toLowerCase();

if(!consent.includes("agree")){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>Access Disabled</h3>

<p>User disabled public access.</p>

</div>

`;

return;

}

renderOwner(record);

})

.catch(error => {

console.error(error);

showError();

});

}



/* ===============================
   INIT
================================ */

document.addEventListener(

"DOMContentLoaded",

initQR

);
