# How to run

## Prerequisites

- Node.js <https://www.youtube.com/watch?v=J8ZPZq_34aY>
- Python <https://www.youtube.com/watch?v=yivyNCtVVDk>
- MySQL (Workbench) <https://www.youtube.com/watch?v=u96rVINbAUI>
- Thunder Client (VSCode Extension) (For API Test)
- Postman (Alternative for Thunder Client) <https://www.postman.com/downloads/>

## Folder Structure

Backend - _playerselector_ directory, <br/>
API and endpoints - _selector_ directory, <br/>
frontend - _cricselector_ directory

## Create Virtual Environment

```bash
    python -m venv venv
```

## Activate Virtual Environment

```bash
    cd .\venv\Scripts\
    .\activate
```

## Install Packages

```bash
    pip install -r requirement.txt
```

### Go back to root folder

```bash
    cd ..
    cd ..
```

## Database Sync

```bash
    python .\manage.py makemigrations
    python .\manage.py migrate
```

## Run the Django server

```bash
    python .\manage.py runserver
```

## Install Packages & Run frontend

```bash
    cd .\cricselector\
    npm install
    npm run dev
```

## Standard output in terminal

- Backend

```bash
    System check identified no issues (0 silenced).
    February 15, 2024 - 20:46:14
    Django version 5.0.2, using settings 'playerselector.settings'
    Starting development server at http://127.0.0.1:8000/
    Quit the server with CTRL-BREAK.
```

- Frontend

```bash
      VITE v5.2.7  ready in 2007 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Important

- Run the player SQL directly in database to insert data for testing.
- Import the VSCode Thunder Client (extension) _Request Collection_, or download Postman,
- Please change or modify the requests according to available users or teams or players in your database.
- Use correct ids for the requests according to your database.
