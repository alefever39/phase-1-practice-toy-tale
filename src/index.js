let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(data => data.forEach(toy => createNewCard(toy)))

  addNewToy()
});


function createNewCard(toy) {
  const toyCollectionDiv = document.querySelector('div#toy-collection')
  const div = document.createElement('div')
  const h2 = document.createElement('h2')
  const img = document.createElement('img')
  const p = document.createElement('p')
  const btn = document.createElement('button')

  h2.textContent = toy.name
  img.src = toy.image
  img.className = 'toy-avatar'
  p.textContent = `${toy.likes} likes`
  btn.className = 'like-btn'
  btn.id = `${toy.id}`
  btn.textContent = 'Like ❤️'
  btn.addEventListener('click', () => fetchLikeCount(btn.id, p))
  div.className = 'card'

  div.append(h2, img, p, btn)
  toyCollectionDiv.append(div)
}


function addNewToy() {
  const form = document.querySelector('form')
  form.addEventListener('submit', e => {
    e.preventDefault()
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
      "name": `${e.target.name.value}`,
      "image": `${e.target.image.value}`,
      "likes": "0"
      })
    })
    .then(resp => resp.json())
    .then(data => createNewCard(data))
  })
}


function fetchLikeCount(id, p) {
  const Url = `http://localhost:3000/toys/${id}`
  fetch(Url)
  .then(resp => resp.json())
  .then(data => updateLikeCounter(data, id, p))
}


function updateLikeCounter(data, id, p) {
  let likes = data.likes
  let likesInt = parseInt(likes)
  likesInt += 1
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
    "likes": `${likesInt}`
    })
  })
  .then(resp => resp.json())
  .then(data => p.textContent = `${data.likes} likes`)
}
