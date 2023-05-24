const bslts = document.querySelectorAll(".bslt")
const dollars = document.querySelectorAll(".dollar")
const conversionRateInput = document.querySelector(".circle-input")


async function getBsltConversionRate() {
    let url = 'https://papi.boraportal.com/assets/v1/tokens/'; // Replace 'bslt' with the actual token you want to fetch
  
    try {
      const response = await axios.get(url);
      return response.data.payload; // Assuming the payload contains the conversion rate
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  
async function fetchConversionRate() {
    const bsltToDollar = await getBsltConversionRate();
    console.log(bsltToDollar);
}
  
// Toggle the side navigation bar (Stats Bar)
function toggleStatsBar() {
    var statsBar = document.getElementById("statsBar");
    statsBar.classList.toggle("active");

    var statsBarToggle = document.getElementById("statsBarToggle");
    statsBarToggle.style.display = "none";
}
// Ignore class list
ignoreIdList = new Set(['sidebar', 'statsBarToggle', 'sidebarToggle', 'statsBar']); // Add your desired ignore classes here

function hideStatsBar(event) {
    var statsBar = document.getElementById("statsBar");
    var statsBarToggle = document.getElementById("statsBarToggle");
    var clickedElement = event.target;

    // Check if the clicked element has an ignore ID
    let hasIgnoreId = ignoreIdList.has(clickedElement.id) || ignoreIdList.has(clickedElement.parentElement.id)

    if (!statsBar.contains(clickedElement) && !statsBarToggle.contains(clickedElement) && !hasIgnoreId) {
        statsBar.classList.remove("active");
        statsBarToggle.style.display = "block";
    }
}

// Collapse the stats bar when clicking outside
document.addEventListener("click", hideStatsBar)

function convertBsltToDollars() {
    console.log("working")
    let conversionRate = null
    if(conversionRateInput) {
        conversionRate = conversionRateInput.value
    }

    if(conversionRate) {
        for(let i = 0; i < dollars.length; i++) {
            dollars[i].textContent = Math.floor(bslts[i].value * conversionRate * 1000) / 1000
            if(dollars[i].textContent == "NaN") {
                dollars[i].textContent = ""
            }
        }
    }
}

conversionRateInput.addEventListener('input', convertBsltToDollars)

convertBsltToDollars()

// JavaScript for tab switching
const fundsTab = document.getElementById('fundsTab');
const ahTab = document.getElementById('ahTab');
const fundsSection = document.getElementById('funds');
const ahSection = document.getElementById('ah');

fundsTab.addEventListener('click', function (event) {
  event.preventDefault();
  fundsTab.classList.add('active');
  ahTab.classList.remove('active');
  fundsSection.classList.add('show', 'active');
  ahSection.classList.remove('show', 'active');
});

ahTab.addEventListener('click', function (event) {
  event.preventDefault();
  ahTab.classList.add('active');
  fundsTab.classList.remove('active');
  ahSection.classList.add('show', 'active');
  fundsSection.classList.remove('show', 'active');
});

const archeumAmtInput = document.querySelector("#wrapArcheumAmount")
const bsltAhRateInput = document.querySelector("#bsltAhRate")
const totalBsltAmtInput = document.querySelector("#bsltAh")
const radioGroup = document.querySelector('#archeumPerWrap');

function calculateBsltAh() {
    const wrapAmtInput = document.querySelector('input[name="groupah"]:checked')

    const archeumAmt = archeumAmtInput.value
    const bsltAhRate = bsltAhRateInput.value
    const wrapAmt = wrapAmtInput.value

    let totalBslt = 0
    let boxes = Math.floor(archeumAmt / wrapAmt)
    totalBslt = boxes * bsltAhRate

    totalBsltAmtInput.value = totalBslt
}
radioGroup.addEventListener('change', function(event) {
    // Get the selected radio button value
    var selectedValue = event.target.value;
  
    // Use the selected value as needed
    calculateBsltAh()
  });

archeumAmtInput.addEventListener('input', calculateBsltAh)
bsltAhRateInput.addEventListener('input', calculateBsltAh)

calculateBsltAh()