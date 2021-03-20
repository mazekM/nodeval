const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')

update.addEventListener('click', _ => {
  fetch('/quotes', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alfred de Vigny',
      country: 'France',
      theme: 'Philosophie du loup',
      quote: 'Seul le silence est grand, tout le reste est faiblesse.'
    })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      window.location.reload(true)
    })
})

deleteButton.addEventListener('click', _ => {
  fetch('/quotes', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alfred de Vigny'
    })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      if (response === 'Pas de ciation à supprimer') {
        messageDiv.textContent = 'Pas de citation de Alfred de Vigny à supprimer'
      } else {
        window.location.reload(true)
      }
    })
    .catch(console.error)
})
