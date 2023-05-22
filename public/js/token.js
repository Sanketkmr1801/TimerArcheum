const searchButton = document.querySelector(".searchButton")
const walletInput = document.querySelector("#walletID")
const tokenTableBody = document.getElementById("tokenTableBody");
let transactionPageNo = 1
// Truncate string to the specified length
function truncateString(str, maxLength, key, ignoreList) {
    ignoreList = new Set(["name", "symbol", "blockNumber", "ercType", "blockUtcTimestamp", "amountOrTokenId"])
    maxLength = 6
    if(ignoreList.has(key)) {
        return str
    }
    if (str.length > maxLength) {
        return str.substr(0, maxLength / 2) + '...' + str.substr(str.length - ((maxLength) / 2), str.length);
    }
    return str;
}

async function getTokenData(walletID) {
    url = `
    https://scope.boraportal.com/api/addresses/${walletID}/token-balances/list?ercType=ERC20
    `
    return axios.get(url)
    .then(res => {
        return res.data.data
    })
}

async function getTokenTransactionData(walletID, pageNo) {
    url = `
    https://scope.boraportal.com/api/addresses/${walletID}/token-transfers?ercType=ERC20&pageSize=10&pageNum=${pageNo}
    `
    return axios.get(url)
    .then(res => {
        return res.data.data
    })
}

searchButton.addEventListener('click', async p => {
    console.log("workings")
    const walletID = walletInput.value;
    const transactionData = await getTokenTransactionData(walletID, transactionPageNo);
    console.log(transactionData);
    const oldTable = document.querySelector(".transactionTable")
    if(oldTable) oldTable.remove()
    const keyMap = {
        amountOrTokenId: 'amount',
        blockNumber: 'height',
        blockUtcTimestamp: 'time',
        contractAddress: 'contract',
        ercType: 'erc',
        fromAddr: 'from',
        toAddr: 'to'
    };
    const ignoreList = new Set(["name", "iconImage"])
    // Create a new table for the transaction data
    const newTable = document.createElement('table');
    newTable.classList.add('table', 'transactionTable');
    
    // Create the table header
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headerKeys = Object.keys(transactionData.content[0]);
    headerKeys.forEach(key => {
        if(!ignoreList.has(key)) {
            const headerCell = document.createElement('th');
            if(keyMap[key]) key = keyMap[key];
            headerCell.textContent = key
            headerRow.appendChild(headerCell);
        }
    });
    tableHeader.appendChild(headerRow);
    
    // Create the table body
    const tableBody = document.createElement('tbody');
    transactionData.content.forEach(transaction => {
        if(transaction["symbol"].toLowerCase() == "bslt") {
            const row = document.createElement('tr');
            headerKeys.forEach(key => {
                if(!ignoreList.has(key)) {
                    if(key == "blockUtcTimestamp") {
                        transaction[key] = transaction[key].split("T").join(" ")
                    }
                    const cell = document.createElement('td');
                    const truncatedValue = truncateString(transaction[key], 5, key)
                    let value = transaction[key]
                    if(key.toLowerCase() == "symbol") {
                        const imgIcon = document.createElement('img')
                        imgIcon.src = transaction["iconImage"]
                        cell.appendChild(imgIcon)
                    }
                    cell.innerHTML += truncatedValue;
                    cell.setAttribute('title', value);
                    cell.addEventListener('click', () => copyToClipboard(value)); // Add click event listener
                    row.appendChild(cell);
                }
            });
            tableBody.appendChild(row);
        }
    });
    
    // Append table header and body to the table content
    newTable.appendChild(tableHeader);
    newTable.appendChild(tableBody);
    
    // Append the new table below the existing table
    const tableContainer = document.querySelector('.table-container');
    tableContainer.appendChild(newTable);
})

searchButton.addEventListener('click', async p => {
    const walletID = walletInput.value;
    const tokenData = await getTokenData(walletID);
    console.log(tokenData);
    // Clear previous table data
    tokenTableBody.innerHTML = '';

    tokenData.forEach(token => {
        console.log(token.name)
        if (token.symbol === 'BSLT') {
            const row = document.createElement('tr');
            
            // Create the name cell with icon image
            const nameCell = document.createElement('td');
            const iconImg = document.createElement('img');
            iconImg.src = token.iconImage;
            iconImg.classList.add('icon-image');
            nameCell.appendChild(iconImg);
            nameCell.innerHTML += token.name;
            
            // Create the symbol cell
            const symbolCell = document.createElement('td');
            symbolCell.textContent = token.symbol;
            
            // Create the balance cell
            const balanceCell = document.createElement('td');
            balanceCell.textContent = Math.floor(token.balance * 1e6) / 1e6;
            
            // Append cells to the row
            row.appendChild(nameCell);
            row.appendChild(symbolCell);
            row.appendChild(balanceCell);
            
            // Append row to the table body
            tokenTableBody.appendChild(row);
        }
    });
})
// Copy value to clipboard
// Copy value to clipboard
function copyToClipboard(value) {
    navigator.clipboard.writeText(value)
        .then(() => {
            console.log('Value copied to clipboard:', value);
        })
        .catch(err => {
            console.error('Unable to copy value to clipboard:', err);
        });
}