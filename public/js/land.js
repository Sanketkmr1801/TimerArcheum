const searchButton = document.querySelector(".searchButton")
const searchResultDiv = document.querySelector(".searchResult")
const walletInput = document.querySelector("#walletID")

async function getLandData(walletID) {
    url = `
    https://api.debank.com/collection/nft_list?q=${walletID.toLowerCase()}&limit=20&id=0x56d23f924cd526e5590ed94193a892e913e38079&chain_id=matic&order_by=-value&traits=%5B%5D
    `
    

    return axios.get(url)
    .then(res => {
        return res.data.data
    })
}

async function updateLandValues() {
    searchResultDiv.innerHTML = ""
    const walletID = walletInput.value
    const landData = await getLandData(walletID)
    console.log(landData)

    const nft_list = landData["nft_list"]
    // Iterate over each NFT in the nft_list
    nft_list.forEach(nft => {
    // Create a card element
    const card = document.createElement('div');
    card.classList.add('card');
  
    // Create the card header
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'p-0', 'm-0');
  
    // Create the img element for the card header
    const img = document.createElement('img');
    img.src = nft.thumbnail_url;
  
    // Create the link element for the img
    const link = document.createElement('a');
    link.href = nft.detail_url;
    link.target = '_blank';
    link.appendChild(img);
  
    // Append the link to the card header
    cardHeader.appendChild(link);
  
    // Create the card description
    // Create the card description
    const cardDescription = document.createElement('div');
    cardDescription.classList.add('card-description');

    // Create the inner_id element
    const innerIdDiv = document.createElement('div');
    innerIdDiv.textContent = `#${nft.inner_id}`;

    // Create the nft name element
    const nftNameDiv = document.createElement('div');
    nftNameDiv.textContent = `${nft.name}`;

    // Append the inner_id and nft name elements to the card description
    cardDescription.appendChild(innerIdDiv);
    cardDescription.appendChild(nftNameDiv);
    // Append the card header and card description to the card
    card.appendChild(cardHeader);
    card.appendChild(cardDescription);
  
    // Append the card to the searchResult div
    searchResultDiv.appendChild(card);
    })
}

searchButton.addEventListener('click', updateLandValues)

updateLandValues()
