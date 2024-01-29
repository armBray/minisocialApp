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

function getFromDB() {
    return new Promise((resolve, reject) => {
        feedDB.forEach((feed) => {
            feeds.push(feed);
            // console.log('feed pushed');
        });
        resolve(true);
    });
}

const textAreadEl = document.getElementById("text-endorsement")
const inputFromEl = document.getElementById("input-from")
const inputToEl = document.getElementById("input-to")
const addButtonEl = document.getElementById("publish-button")

addButtonEl.addEventListener("click", function() {
    let textAreaValue = textAreadEl.value
    let inputFromValue = inputFromEl.value
    let inputToValue = inputToEl.value
    
    // console.log(textAreaValue)
    // console.log(inputFromValue)
    // console.log(inputToValue)


    const container = document.getElementById("feeds")

    container.innerHTML += `<div class="card" id='card-${feeds.length}'>
                    <h3 id='card-to-${feeds.length}'>To ${inputToValue}</h3>
                    <p id='card-endorsement-${feeds.length}'>${textAreaValue}</p>
                    <div class='card-footer'>
                        <h3 id='card-from-${feeds.length}'>From ${inputFromValue}</h3>
                        <div class='card-like' id='card-like-${feeds.length}'>
                            <img alt='like' class='like' id='like-${feeds.length}' src='./assets/heart-like-empty.svg' height="15px"/>
                            <span id='like-value-${feeds.length}'>${0}</span>
                        </div>
                    </div>
                </div>`

    const feed = {
        to: inputToValue,
        feed: textAreaValue,
        from: inputFromValue,
        likes: 0
    }

    feeds.push(feed);
    console.log(feeds)

    const cardsEL = document.querySelectorAll('.card')
    cardsEL.forEach((card,index) => {
        const likeEl = document.getElementById(`card-like-${index}`)
        const likeImgEl = document.getElementById(`like-${index}`)
        const likeValueEl = document.getElementById(`like-value-${index}`)
        likeEl.addEventListener("click", function() {
            console.log(`pressed like of card ${index}`)
            if (localStorage.getItem(`likeHasBeenClicked[${index}]`))
                alert('You"ve already put like on this feed!')
            else {
                localStorage.setItem(`likeHasBeenClicked[${index}]`, true)
                likeImgEl.setAttribute('src', './assets/heart-like-full.svg')
                likeValueEl.textContent = Number(likeValueEl.textContent) + 1
                feeds[index].likes += 1
                console.log(feeds)
            }
        })
    });
})

async function renderFeed() {
    const container = document.getElementById("feeds")
    let feedDOM = ""
    for (let i = 0; i < feeds.length; i++) {

        if (localStorage.getItem(`likeHasBeenClicked[${i}]`))
            feedDOM += `<div class="card" id='card-${i}'>
                            <h3 id='card-to-${i}'>To ${feeds[i].to}</h3>
                            <p id='card-endorsement-${i}'>${feeds[i].feed}</p>
                            <div class='card-footer'>
                                <h3 id='card-from-${i}'>From ${feeds[i].from}</h3>
                                <div class='card-like' id='card-like-${i}'>
                                    <img alt='like' class='like' id='like-${i}' src='./assets/heart-like-full.svg' height="15px"/>
                                    <span id='like-value-${i}'>${feeds[i].likes}</span>
                                </div>
                            </div>
                        </div>`
        else
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

    }
    return new Promise((resolve, reject) => {
        container.innerHTML = feedDOM
        resolve(true);
    });
}


async function main() {
    await getFromDB()
    await renderFeed()

    if(localStorage.getItem("likeHasBeenClicked[0]"))
        console.log(localStorage.getItem("likeHasBeenClicked[0]"))
    else
        console.log('Nothing in localStorage')
    
    const cardsEL = document.querySelectorAll('.card')
    cardsEL.forEach((card,index) => {
        const likeEl = document.getElementById(`card-like-${index}`)
        const likeImgEl = document.getElementById(`like-${index}`)
        const likeValueEl = document.getElementById(`like-value-${index}`)
        likeEl.addEventListener("click", function() {
            console.log(`pressed like of card ${index}`)
            if (localStorage.getItem(`likeHasBeenClicked[${index}]`))
                alert('You"ve already put like on this feed!')
            else {
                localStorage.setItem(`likeHasBeenClicked[${index}]`, true)
                likeImgEl.setAttribute('src', './assets/heart-like-full.svg')
                likeValueEl.textContent = Number(likeValueEl.textContent) + 1
                feeds[index].likes += 1
                console.log(feeds)
            }
        })
    });

}

main()


/*
- publish new card when button clicked
✓ render filled heart if in local true
✓ add like in array if clicked and local == null
✓ save clicked to local
✓ render new total likes
*/