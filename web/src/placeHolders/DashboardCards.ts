export const mostVotedCards = [
    {
      "created_at": "2022-10-26T21:08:34.755Z",
      "updated_at": "2022-10-26T21:08:34.755Z",
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa1",
      "title": "Sandwich 1",
      "created_by": {
        "username": "JohnDoe",
        "display_name": "John"
      },
      "likes_count": 3,
      "thumbnail_url": "/sandwichImage.png",
      "liked": true
    },
    {
      "created_at": "2022-10-26T21:08:34.755Z",
      "updated_at": "2022-10-26T21:08:34.755Z",
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa2",
      "title": "Sandwich 2",
      "created_by": {
        "username": "JenniferDoe",
        "display_name": "Jane"
      },
      "likes_count": 4,
      "thumbnail_url": "/sandwichImage.png",
      "liked": true
    },
    {
      "created_at": "2022-10-26T21:08:34.755Z",
      "updated_at": "2022-10-26T21:08:34.755Z",
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa3",
      "title": "Sandwich 3",
      "created_by": {
        "username": "JannetDoe",
        "display_name": "Jane"
      },
      "likes_count": 5,
      "thumbnail_url": "/sandwichImage.png",
      "liked": true
    },
    {
      "created_at": "2022-10-26T21:08:34.755Z",
      "updated_at": "2022-10-26T21:08:34.755Z",
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa4",
      "title": "Sandwich 4",
      "created_by": {
        "username": "JaneDoe",
        "display_name": "Jane"
      },
      "likes_count": 6,
      "thumbnail_url": "/sandwichImage.png",
      "liked": false
    },
    {
      "created_at": "2022-10-24T21:08:34.755Z",
      "updated_at": "2022-10-26T21:08:34.755Z",
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa5",
      "title": "Sandwich with long name as a test",
      "created_by": {
        "username": "JannisDoe",
        "display_name": "Jane"
      },
      "likes_count": 7,
      "thumbnail_url": "/sandwichImage.png",
      "liked": false
    }
]

export const oneRecipe = {
  "created_at": "2022-10-26T21:08:34.755Z",
  "updated_at": "2022-10-26T21:08:34.755Z",
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "Sandwich",
  "content_md": "## Ingredients",
  content_html: `
  <h1> Time of preparation </h1>
  <p> 10 minutes </p>

  <h1> Cost </h1>
  <p> $12 MXN </p>

  <h1> Ingredients </h1>
  <ul>
    <li> 1 slice of bread </li>
    <li> 1 slice of cheese </li>
    <li> 1 slice of ham </li>
    <li> 1 slice of tomato </li>
    <li> 1 slice of cucumber </li>
    <li> 1 slice of lettuce </li>
    <li> 1 slice of onion </li>
    <li> 1 slice of mustard </li>
    <li> 1 slice of ketchup </li>
  </ul>

  <h1> Instructions </h1>
  <ol>
  <li> Put the bread on a plate </li>
  <li> Put the cheese on the bread </li>
  <li> Put the ham on the bread </li>
  <li> Put the tomato on the bread </li>
  <li> Put the cucumber on the bread </li>
  <li> Put the lettuce on the bread </li>
  <li> Put the onion on the bread </li>
  <li> Put the mustard on the bread </li>
  <li> Put the ketchup on the bread </li>
  <li> Put the other slice of bread on top </li>
  </ol>`,
  created_by: {
    "username": "JannisDoe",
    "display_name": "Jane"
  },
  likes_count: 10,
  thumbnail_url: '/sandwichImage.png',
  liked: true
}

export const editRecipe = {
  costo: 50,
  tiempo: 10,
  ingredientes: 
  `<ul>
    <li> 1 slice of bread </li>
    <li> 1 slice of cheese </li>
    <li> 1 slice of ham </li>
    <li> 1 slice of tomato </li>
    <li> 1 slice of cucumber </li>
    <li> 1 slice of lettuce </li>
    <li> 1 slice of onion </li>
    <li> 1 slice of mustard </li>
    <li> 1 slice of ketchup </li>
  </ul>`,
  pasos:
  `<ol>
  <li> Put the bread on a plate </li>
  <li> Put the cheese on the bread </li>
  <li> Put the ham on the bread </li>
  <li> Put the tomato on the bread </li>
  <li> Put the cucumber on the bread </li>
  <li> Put the lettuce on the bread </li>
  <li> Put the onion on the bread </li>
  <li> Put the mustard on the bread </li>
  <li> Put the ketchup on the bread </li>
  <li> Put the other slice of bread on top </li>
  </ol>`,
  titulo: 'Sandwich',
}