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