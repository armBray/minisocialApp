import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import {appSettings ,DATABASE_NAME} from './firebaseConfig.js'

const app = initializeApp(appSettings)
const database = getDatabase(app)
const feedsInDB = ref(database, DATABASE_NAME)

localStorage. clear();

const feedDB = [
    {
        to: 'Chris',
        feed: 'Thank you so much for helping me with the March accounting. Saved so much time because of you! 💜 Alemanno',
        from: 'Alemanno',
        likes: 4
    },
    {
        to: 'Jaker',
        feed: 'That transcription feature you completed for me is amazing. I know you’ve been working hard on it for several months now. 👏👏👏 Really good work 🙌',
        from: 'Santos',
        likes: 2
    },
    {
        to: 'Sandro',
        feed: 'Hi Sandro! Your React Router course is so good. The students are going to LOVE IT. I’m so excited for the launch :) 🔥 Putwelle',
        from: 'Putwelle',
        likes: 2
    }
]

const feeds = []

// call only first time to push items in firebase
function getFromDB() {
    return new Promise((resolve, reject) => {
        feedDB.forEach((feed) => {
            feeds.push(feed);
            push(feedsInDB, feed)
            // console.log('feed pushed');
        });
        resolve(true);
    });
}

const textAreadEl = document.getElementById("text-endorsement")
const inputFromEl = document.getElementById("input-from")
const inputToEl = document.getElementById("input-to")
const addButtonEl = document.getElementById("publish-button")

addButtonEl.addEventListener("click", async function() {
    let textAreaValue = textAreadEl.value
    let inputFromValue = inputFromEl.value
    let inputToValue = inputToEl.value
    
    createCardDB(inputToValue,textAreaValue,inputFromValue)
    clearInputFieldEl()
})

function clearInputFieldEl() {
    textAreadEl.value = ''
    inputFromEl.value = ''
    inputToEl.value = ''
}

function createCardDB(inputToValue,textAreaValue,inputFromValue) {
    const feed = {
        to: inputToValue,
        feed: textAreaValue,
        from: inputFromValue,
        likes: 0
    }

    feeds.push(feed);
    console.log(feeds)
    push(feedsInDB, feed)
}



/*
feedDOM += `<div class="card" id='card-${i}'>
                <h3 id='card-to-${i}'>To ${feeds[i].to}</h3>
                <p id='card-endorsement-${i}'>${feeds[i].feed}</p>
                <div class='card-footer'>
                    <h3 id='card-from-${i}'>From ${feeds[i].from}</h3>
                    <div class='card-like' id='card-like-${i}'>
                        <img alt='like' class='like' id='like-${i}' src='./assets/heart-like-empty.svg' height="15px"/>
                        <span id='like-value-${i}'>${feeds[i].likes}</span>
                    </div>
                </div>
            </div>`
*/


const container = document.getElementById("feeds")

function appendCardToFeedEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let cardDivEl = document.createElement("div")
        cardDivEl.setAttribute('class', `card`)
        cardDivEl.setAttribute('id', `card${itemID}`)

    let cardToEl = document.createElement("h3")
        cardToEl.setAttribute('id', `card-to${itemID}`)
        cardToEl.textContent = 'To ' + itemValue.to
        cardDivEl.append(cardToEl)

    let cardEndorsementEl = document.createElement("p")
        cardEndorsementEl.setAttribute('class', `card-endorsement`)
        cardEndorsementEl.setAttribute('id', `card-endorsement${itemID}`)
        cardEndorsementEl.textContent = itemValue.feed
        cardDivEl.append(cardEndorsementEl)

    let cardFootertEl = document.createElement("div")
        cardFootertEl.setAttribute('class', `card-footer`)
    let cardFromEl = document.createElement("h3")
        cardFromEl.setAttribute('class', `card-from`)
        cardFromEl.setAttribute('id', `card-from${itemID}`)
        cardFromEl.textContent = 'From ' + itemValue.from
        cardFootertEl.append(cardFromEl)
    let cardLikeEl = document.createElement("div")
        cardLikeEl.setAttribute('class', `card-like`)
        cardLikeEl.setAttribute('id', `card-like${itemID}`)
        let cardLikeImgEl = document.createElement("img")
            cardLikeImgEl.setAttribute('alt', `like`)
            cardLikeImgEl.setAttribute('class', `card-like-img`)
            cardLikeImgEl.setAttribute('id', `card-like-img${itemID}`)
            cardLikeImgEl.setAttribute('height', `15px`)
            if (localStorage.getItem(`likeHasBeenClicked[${itemID}]`))
                cardLikeImgEl.setAttribute('src', './assets/heart-like-full.svg')
            else
                cardLikeImgEl.setAttribute('src', './assets/heart-like-empty.svg')
        cardLikeEl.append(cardLikeImgEl)
    
        let deleteEl = document.createElement("button")
            deleteEl.setAttribute('class', `btn-delete`)
            deleteEl.setAttribute('id', `delete-card${itemID}`)
            deleteEl.textContent = 'Delete'
            cardFromEl.after(deleteEl)   

        let cardLikeValueEl = document.createElement("span")
            cardLikeValueEl.setAttribute('id', `card-like-value${itemID}`)
            cardLikeValueEl.textContent = itemValue.likes
        cardLikeEl.append(cardLikeValueEl)

    cardFootertEl.append(cardLikeEl)
    cardDivEl.append(cardFootertEl)
    container.append(cardDivEl)

    deleteEl.addEventListener("click", function() {
        if (itemID === '-NpKZLA35od2G7qS8ntE' || itemID === '-NpKZLA8ILpSB_dLmRCY' || itemID === '-NpKZLA9vgG2GY8Hl9rV')
            alert(`You cannot remove this Endorsement!`)
        else {
            alert(`Endorsement removed!`)
            let exactLocationOfFeedInDB = ref(database, `feeds/${itemID}`)
            remove(exactLocationOfFeedInDB)
        }
    })

    cardLikeEl.addEventListener("click", function() {
        console.log(`pressed like of card ${itemID}`)
        if (localStorage.getItem(`likeHasBeenClicked[${itemID}]`)) {
            alert(`You've already put like on this feed! I'm gonna remove it!`)
            localStorage.removeItem(`likeHasBeenClicked[${itemID}]`)
            cardLikeImgEl.setAttribute('src', './assets/heart-like-empty.svg')
            cardLikeValueEl.textContent = Number(cardLikeValueEl.textContent) - 1
            update(feedsInDB, {[itemID + '/likes'] : cardLikeValueEl.textContent})
        } else {
            localStorage.setItem(`likeHasBeenClicked[${itemID}]`, true)
            cardLikeImgEl.setAttribute('src', './assets/heart-like-full.svg')
            cardLikeValueEl.textContent = Number(cardLikeValueEl.textContent) + 1
            update(feedsInDB, {[itemID + '/likes'] : cardLikeValueEl.textContent})
        }
    })
}

function clearFeedEl() {
    container.innerHTML = ""
}


async function main() {
    onValue(feedsInDB, function(snapshot) {
        clearFeedEl()
        let feedsArray = Object.entries(snapshot.val())
        for (let i = 0; i < feedsArray.length; i++) {
            let currentFeed = feedsArray[i]
            let currentItemID = currentFeed[0]
            let currentItemValue = currentFeed[1]
            console.log(currentItemValue)
            appendCardToFeedEl(currentFeed)
        }
    })
}

main()

