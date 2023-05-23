const searchButton = document.querySelector(".searchButton")
const walletInput = document.querySelector("#walletID")
const tokenTableBody = document.getElementById("tokenTableBody");
transactionPageNo = 1
const leftButton = document.querySelector(".left-button")
const rightButton = document.querySelector(".right-button")
const circleInput = document.querySelector(".circle-input")
maxTransactionPage = 10 

if(transactionPageNo <= 1) {
    leftButton.disabled = true
} else {
    leftButton.disabled = false
}
circleInput.value = transactionPageNo

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
    https://scope.boraportal.com/api/addresses/${walletID.toLowerCase()}/token-balances/list?ercType=ERC20
    `
    return axios.get(url)
    .then(res => {
        return res.data.data
    })
}

async function getTokenTransactionData(walletID, pageNo) {
    url = `
    https://scope.boraportal.com/api/addresses/${walletID.toLowerCase()}/token-transfers?ercType=ERC20&pageSize=10&pageNum=${pageNo}
    `
    return axios.get(url)
    .then(res => {
        return res.data.data
    })
}

leftButton.addEventListener('click', () => {

    if(transactionPageNo > 1) transactionPageNo -= 1

    if(transactionPageNo <= 1) {
        leftButton.disabled = true
    } else {
        leftButton.disabled = false
    }

    if(transactionPageNo >= maxTransactionPage) {
        rightButton.disabled = true
    } else {
        rightButton.disabled = false
    }

    circleInput.value = transactionPageNo

})

rightButton.addEventListener('click', () => {
    if(transactionPageNo < maxTransactionPage) {
        transactionPageNo += 1
    }
    
    if(transactionPageNo >= maxTransactionPage) {
        rightButton.disabled = true
    } else {
        rightButton.disabled = false
    }

    if(transactionPageNo <= 1) {
        leftButton.disabled = true
    } else {
        leftButton.disabled = false
    }

    circleInput.value = transactionPageNo
})

async function fetchTokenTransaction() {
    let walletID = walletInput.value;
    const transactionData = await getTokenTransactionData(walletID, transactionPageNo);
    console.log(transactionData);
    maxTransactionPage = transactionData.totalPages
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

                    if(key.toLowerCase() == "toaddr") {
                        if(transaction[key] == walletID) {
                            row.classList.add("green-background")
                        } else {
                            row.classList.add("red-background")
                        }
                    }

                    if(key.toLowerCase() == "symbol") {
                        const imgIcon = document.createElement('img')
                        imgIcon.src = transaction["iconImage"]
                        cell.appendChild(imgIcon)
                    }
                    cell.innerHTML += truncatedValue;
                    cell.setAttribute('title', value); 
                    if(key.toLowerCase() == "amountortokenid") {
                        if(row.classList.contains("red-background")) {
                            cell.textContent = "-" + cell.textContent
                        }
                    }
                    cell.addEventListener('click', () => {
                        if (cell.classList.contains('copied')) {
                            return;
                        }

                        const originalCellHTML = cell.innerHTML
                          // Add copied class
                        cell.classList.add('copied');
                        
                        // Set "Copied" text
                        cell.innerHTML = 'copied';
                    
                        copyToClipboard(value)

                          // Reset the cell after 1 second
                        setTimeout(() => {
                            cell.classList.remove('copied');
                            cell.innerHTML = originalCellHTML;
                        }, 500);

                    })
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
}

async function fetchTokenInfo() {
    let walletID = walletInput.value;
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
}

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
searchButton.addEventListener('click', fetchTokenTransaction)
leftButton.addEventListener('click', fetchTokenTransaction)
rightButton.addEventListener('click', fetchTokenTransaction)


searchButton.addEventListener('click', fetchTokenInfo)

fetchTokenInfo()
fetchTokenTransaction()