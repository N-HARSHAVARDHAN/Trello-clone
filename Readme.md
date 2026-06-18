# Trello Board Clone

A simple Trello-style board application built using **HTML, CSS, and JavaScript** with the **Trello REST API**.

The application allows users to manage lists, cards, and checklists directly from a Trello board.

---

## Features

### Lists

* View all lists from a Trello board
* Create new lists
* Rename existing lists
* Delete (archive) lists

### Cards

* View cards inside each list
* Create new cards
* Rename cards
* Archive cards

### Checklists

* Add checklists to cards
* Rename checklists
* Delete checklists
* Add checklist items
* Delete checklist items
* Mark checklist items as complete/incomplete

### User Interface

* Modal popup for entering names
* Card details popup
* Dynamic rendering using JavaScript DOM manipulation
* Responsive Trello-inspired layout

---

## Technologies Used

* HTML5
* CSS3
* JavaScript (ES6)
* Fetch API
* Trello REST API

---

## Project Structure

```text
.
├── images/
├── Config.js
├── index.html
├── script.js
├── style.css
├── .gitignore
└── README.md
```

---

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Create a Trello Board

Create a board in Trello where the application will manage lists and cards.

### 3. Get Trello API Credentials

Generate:

* API Key
* Token
* Board ID

from the Trello Developer Portal.

### 4. Configure Credentials

Create a `Config.js` file:

```javascript
const API_KEY = "YOUR_API_KEY";
const TOKEN = "YOUR_TOKEN";
const BOARD_ID = "YOUR_BOARD_ID";
```

### 5. Run the Application

Open `index.html` in your browser.

---

## Trello API Operations Used

| Operation                    | HTTP Method |
| ---------------------------- | ----------- |
| Get Lists                    | GET         |
| Create List                  | POST        |
| Rename List                  | PUT         |
| Archive List                 | PUT         |
| Get Cards                    | GET         |
| Create Card                  | POST        |
| Rename Card                  | PUT         |
| Archive Card                 | PUT         |
| Create Checklist             | POST        |
| Rename Checklist             | PUT         |
| Delete Checklist             | DELETE      |
| Create Checklist Item        | POST        |
| Delete Checklist Item        | DELETE      |
| Update Checklist Item Status | PUT         |

---

