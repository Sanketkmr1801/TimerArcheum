houses = {
    "tent": ["basic"],
    "small": ["basic", "green"],
    "medium": ["basic", "green", "blue"],
    "large": ["basic", "green", "blue", "arcane"],
    "manor": ["basic", "green", "blue", "arcane", "heroic"]
}
resourceInput = {
    "basic": [130, 250, 500],
    "green": [500, 1000, 2020],
    "blue": [1000, 2000, 4000],
    "arcane": [1750, 3500, 6960],
    "heroic": [3160, 6320, 12640]
}
benchColors = {
    "basic": "#707070",
    "green": "#5CBF9B",
    "blue": "#5499C7",
    "arcane": "#A569BD",
    "heroic": "#F9C74F",
    "intensifiedbasic": "#404040",
    "intensifiedgreen": "#46A681",
    "intensifiedblue": "#4688B2",
    "intensifiedarcane": "#853F7C",
    "intensifiedheroic": "#E1A82D"
  }

function updateAddTimerButton(land) {
let radios = document.querySelector(`.addTimerFormDiv${land}`)
if(radios) {
    radios = radios.querySelectorAll("input")
} else {
    return
}
const radioLabels = document.querySelector(`.addTimerFormDiv${land}`).querySelectorAll("label")
const buttonContainer = document.querySelector(`.addTimerButtonDiv${land}`)
let selectedRadio = radios[0]
for(let radio of radios) {
    if(radio.checked) {
    selectedRadio = radio.value
    break
    }
}

// for(let i = 0; i < radioLabels.length; i++) {
//   let label = radioLabels[i]
//   let radio = radios[i]

//   let color = benchColors[label.textContent]

//   label.style.color = color
//   label.style.fontWeight = 'bold'
//   radio.style.backgroundColor = color

// }
buttonContainer.innerHTML = ""
for(let i = 0; i < resourceInput[selectedRadio].length; i++) {
    let resource = resourceInput[selectedRadio][i]
    buttonContainer.innerHTML +=
    `<button class="resourceBtn" name="resource" value="${i}" form="addTimerForm${land}">${resource}</button>`
}
}

const serverStartTime = parseInt(document.querySelector("#serverStartTime").value)
let clientTimeTicker = 0

console.log(serverStartTime)

function retainAddTimerInputs() {
            // Store the modal inputs in variables
let houseInput = document.querySelector("#house");
let benchInput = document.querySelector("#bench");
let resourceInput = document.querySelector("#resource");
let landInput = document.querySelector("#land")
let refreshButtons = document.querySelectorAll(".refresh-house")

for(let button of refreshButtons) {
  button.addEventListener('click', (event) => {
    let notifiedLands = JSON.parse(localStorage.getItem("notifiedLands"))

    let land = button.id.split("refreshButton")[1]
    if(notifiedLands && land) {
      notifiedLands = notifiedLands.filter(ele => ele != land)
      localStorage.setItem("notifiedLands", JSON.stringify(notifiedLands))
    }
  })
}

// Function to populate the modal inputs with the stored values
function populateModalInputs() {
    // Check if there are stored values
    if (localStorage.getItem("modalInputs")) {
        let storedInputs = JSON.parse(localStorage.getItem("modalInputs"));

        // Populate the inputs with the stored values
        houseInput.value = storedInputs.house;
        benchInput.value = storedInputs.bench;
        resourceInput.value = storedInputs.resource;
        landInput.value = storedInputs.land;
    }
    }

    // Function to update the stored values when the modal inputs change
function updateModalInputs() {
    let modalInputs = {
        house: houseInput.value,
        bench: benchInput.value,
        resource: resourceInput.value,
        land: landInput.value
    };

    // Store the inputs in local storage
    localStorage.setItem("modalInputs", JSON.stringify(modalInputs));
}

// Add event listeners to update and populate the modal inputs
houseInput.addEventListener("change", updateModalInputs);
benchInput.addEventListener("change", updateModalInputs);
resourceInput.addEventListener("change", updateModalInputs);
landInput.addEventListener("change", updateModalInputs)
populateModalInputs()
updateBenches()
}

function retainStorePosition() {
    // Function to store the scroll position in local storage
function storeScrollPosition() {
    localStorage.setItem("scrollPosition", window.scrollY);
}

// Function to restore the scroll position from local storage
function restoreScrollPosition() {
    let scrollPosition = localStorage.getItem("scrollPosition");
    if (scrollPosition) {
    window.scrollTo(0, scrollPosition);
    localStorage.removeItem("scrollPosition");
    }
}

// Store the scroll position when the page is unloaded
window.addEventListener("beforeunload", storeScrollPosition);

// Restore the scroll position when the page is loaded
window.addEventListener("load", restoreScrollPosition);
}

function updateBenches() {
    house = document.querySelector("#house").value
    
    benches = houses[house]
    benchSelect = document.querySelector("#bench")
    benchSelect.innerHTML = ""

    for(let b of benches) {
        benchSelect.innerHTML += `<option value=${b}>${b}</option>`
    }
    updateResources()
}

function updateResources() {
    bench = document.querySelector("#bench").value
    resource = document.querySelector("#resource")
    resource.innerHTML = ""
    resourceValues = resourceInput[bench]

    for(let i = 0; i < resourceValues.length; i++) {
        resource.innerHTML += `<option value=${i}>${resourceValues[i]}</option>`
    }
}
let isPingSoundPlaying = false
// Function to update and remove expired timers
function updateTimers() {
    let currentTime = serverStartTime + clientTimeTicker * 1000
    console.log("Current Time: " + currentTime)
    clientTimeTicker += 1
    let durations = document.querySelectorAll(".duration");
    let startTimes = document.querySelectorAll(".startTime");
    let remainingTimes = document.querySelectorAll(".remainingTime");
    let endTimes = document.querySelectorAll(".endTime");
    


    for (let i = 0; i < remainingTimes.length; i++) {
      let card = remainingTimes[i].parentElement.parentElement;
    
      if (card.classList.contains('card-red')) {
        remainingTimes[i].outerHTML = `<div class="remainingTime">${durations[i].textContent.split(" ")[0]}:00:00</div>`;
        continue;
      }
      
      let startTime = Number(startTimes[i].textContent);
      let remainingTime = (currentTime - startTime) / 1000;
      
      let seconds = Math.floor(remainingTime % 60);
      let minutes = Math.floor((remainingTime % 3600) / 60);
      let hours = Math.floor(remainingTime / 3600);
      
      if (card) {
        let duration = durations[i].textContent.split(" ")[0];
        if (hours >= duration) {
          card.classList.remove("card-green");
          card.classList.add("card-red");
          let land = remainingTimes[i].children[0].value
          let house = remainingTimes[i].children[1].value
          let bench = remainingTimes[i].children[2].value
          // showNotification(land, house, bench)
        }
      }
      
      remainingTimes[i].outerHTML = `<div class="remainingTime">${hours}:${minutes}:${seconds}</div>`;
    }
    
    setTimeout(updateTimers, 1000); // Run the update every second
}

const notificationIgnoreList = new Set()


function updateNotifications() {
  function addNotifiedLand(land) {
    if(!localStorage.getItem("notifiedLands")) {
      const notifiedLands = [land]
      localStorage.setItem("notifiedLands", JSON.stringify(notifiedLands))
    } else {
      const notifiedLands = JSON.parse(localStorage.notifiedLands)
      notifiedLands.push(land)
      localStorage.setItem("notifiedLands", JSON.stringify(notifiedLands))
    }
  }
  
  function fetchNotifiedLand() {
    const notifiedLands = localStorage.getItem("notifiedLands")
    return JSON.parse(notifiedLands)
  }
  const lands = document.querySelectorAll(".landBorder")
  for(let land of lands) {
    if(notificationIgnoreList.has(land.id)) continue
    const cards = land.querySelectorAll(".card")
    let isNotification = true
    if(cards.length == 0) continue
    for(let card of cards) {
      if(!card.classList.contains("card-red")) {
        isNotification = false
        break
      }
    }
    const notifiedLands = fetchNotifiedLand()
    if(isNotification) {
      if(!notifiedLands) {
        showNotification(land.id)
        notificationIgnoreList.add(land.id)
        addNotifiedLand(land.id)
      } else {
        if(!notifiedLands.includes(land.id)) {
          showNotification(land.id)
          notificationIgnoreList.add(land.id)
          addNotifiedLand(land.id)
        }
      }

    }
  }

  setTimeout(updateNotifications, 1000)
} 


function playNotificationSound() {
  let audio = new Audio('./audio/ping.mp3');
  audio.play();
}

function showNotification(land, house, bench) {
  if (Notification.permission === 'granted') {
    new Notification('Timer Finished', {
      body: `Timers at ${land} are finished`,
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(function (permission) {
      if (permission === 'granted') {
        new Notification('Timer Finished', {
          body: `Timers at land ${land} are finished`,
        });
      }
    });
  }
}


function hideElements() {
let endTimes = document.querySelectorAll(".endTime")
let startTimes = document.querySelectorAll(".startTime")
let timerID = document.querySelectorAll(".timerID")
timerID.forEach(element => {
    element.style.display = 'none';
})
endTimes.forEach(element => {
    element.style.display = 'none';
});
startTimes.forEach(element => {
    element.style.display = 'none';
});
}

function timerOverlayDisplay() {
// Get all card elements
const cards = document.querySelectorAll('.card');

// Add event listeners for each card
cards.forEach(card => {
    const overlay = card.querySelector('.overlay');
    const deleteButton = card.querySelector('.delete-button');
    const updateButton = card.querySelector('.update-button')
    card.addEventListener('mouseover', () => {
        overlay.style.opacity = '1';
        deleteButton.style.opacity = '1';
        updateButton.style.opacity = "1";
    });

    card.addEventListener('mouseout', () => {
        overlay.style.opacity = '0';
        deleteButton.style.opacity = '0';
        updateButton.style.opacity = "0";

    });
});
}

retainStorePosition()
hideElements()
timerOverlayDisplay()
retainAddTimerInputs()
updateTimers()
updateAddTimerButton()
updateNotifications()
// document.addEventListener('click', playPingSound)