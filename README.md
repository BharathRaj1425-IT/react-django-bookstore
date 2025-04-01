# **Django + React Full Stack Project (Book Management API)**

This project is a **full-stack web application** using **Django Rest Framework (DRF) as the backend** and **React.js as the frontend**. The API allows users to **create, read, update, and delete (CRUD) books**, and React is used to display and manage them.

## **📌 Features**
- ✅ **REST API** with Django Rest Framework (DRF)  
- ✅ **PostgreSQL** database connection  
- ✅ **CORS support** to allow React frontend to interact with the API  
- ✅ **Axios** for handling HTTP requests in React  
- ✅ **CRUD operations** (Create, Read, Update, Delete) for books  

---

## **📂 Project Structure**
```
/backend (Django Backend)
│── backend/
│── restApi/
│── db.sqlite3
│── manage.py
│── requirements.txt
│── backend/settings.py
│── restApi/models.py
│── restApi/views.py
│── restApi/serializers.py
│── restApi/urls.py
│── backend/urls.py
│── frontend/ (React Frontend)
│── package.json
│── src/
│── src/App.js
│── src/index.js
│── README.md
```

---

## **🚀 Backend Setup (Django API)**

### **1️⃣ Install Dependencies**
```sh
pip install django djangorestframework django-cors-headers psycopg2-binary
```

### **2️⃣ Create a Django Project & App**
```sh
django-admin startproject backend
cd backend
python manage.py startapp restApi
```

### **3️⃣ Configure Database (PostgreSQL)**
Modify `settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'bharathsql',
        'USER': 'postgres',
        'PASSWORD': 'p@ssword',
        'HOST': 'localhost',
    }
}
```

Run **migrations**:

```sh
python manage.py makemigrations
python manage.py migrate
```

### **4️⃣ Define the Book Model (`models.py`)**
```python
from django.db import models

class BookModel(models.Model):
    name = models.CharField(max_length=50)
    writer = models.CharField(max_length=100)
    year = models.CharField(max_length=50)
    main_contents = models.TextField()

    def __str__(self):
        return self.name
```

### **5️⃣ Create API Serializer (`serializers.py`)**
```python
from rest_framework import serializers
from .models import BookModel

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookModel
        fields = '__all__'
```

### **6️⃣ Create API Views (`views.py`)**
```python
from rest_framework import generics
from .serializers import BookSerializer
from .models import BookModel

class BookGetPost(generics.ListCreateAPIView):
    queryset = BookModel.objects.all()
    serializer_class = BookSerializer

class BookPutDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookModel.objects.all()
    serializer_class = BookSerializer
```

### **7️⃣ Configure API URLs (`urls.py`)**
```python
from django.urls import path
from .views import BookGetPost, BookPutDelete

urlpatterns = [
    path('books/', BookGetPost.as_view(), name='book-getpost'),
    path('books/<int:pk>', BookPutDelete.as_view(), name='book-putdelete')
]
```

### **8️⃣ Enable CORS in `settings.py`**
```python
INSTALLED_APPS = [
    'corsheaders',  # Add this
    'rest_framework',
    'restApi',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this
    'django.middleware.common.CommonMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",   # Allow React frontend
]                 
```

### **9️⃣ Run Django Server**
```sh
python manage.py runserver
```

📌 **API Endpoints:**  
- **GET /api/books/** → List all books  
- **POST /api/books/** → Add a new book  
- **GET /api/books/{id}/** → Retrieve a book  
- **PUT /api/books/{id}/** → Update a book  
- **DELETE /api/books/{id}/** → Delete a book  

---

## **🎨 Frontend Setup (React.js)**

### **1️⃣ Create React App**
```sh
npx create-react-app frontend
cd frontend
npm start
```

### **2️⃣ Install Libraries**
```sh
npm install axios bootstrap react-bootrap framer-motion Formik Yup react-icons
```

### **3️⃣ Fetch Data from Django API (`src/comp/BookStore.js`)**
```jsx
import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { FiEdit } from "react-icons/fi";
import { Formik } from 'formik';
import * as Yup from 'yup';
import './BookStore.css';

function BookStore() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [editableData, setEditableData] = useState(null);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        getBookData();
    }, []);

    const getBookData = () => {
        axios.get('http://127.0.0.1:8000/api/books/')
        .then((response) => {
            setData(response.data);
        })
        .catch((error) => {
            console.error("Error fetching book data:", error);
        });
    };

    const filteredData = data.filter(book => 
        book.name.toLowerCase().includes(search.toLowerCase()) ||
        book.writer.toLowerCase().includes(search.toLowerCase())
    );

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Title is required"),
        writer: Yup.string().required("Writer is required"),
        year: Yup.string().required("Year is required"),
        main_contents: Yup.string().required("Main contents are required")
    });

    const handleEdit = (book) => {
        setEditableData(book);
        setEdit(true);
    };

    return (
        <Fragment>
            <Container>
                <h2 className="my-4 text-center">Book Store</h2>
                <InputGroup className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Search by name or writer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                 <InputGroup.Text>🔍</InputGroup.Text>
                </InputGroup>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Title</th>
                            <th>Writer</th>
                            <th>Year</th>
                            <th>Main Contents</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((book, index) => (
                            <tr key={book.id}>
                                <td>{index + 1}</td>
                                <td>{book.name}</td>
                                <td>{book.writer}</td>
                                <td>{book.year}</td>
                                <td>{book.main_contents}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <FiEdit size={22} className="edit-icon" onClick={() => handleEdit(book)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Modal show={edit} onHide={() => setEdit(false)}>
              
                        <Formik
                            initialValues={editableData}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                axios.put(`http://127.0.0.1:8000/api/books/${editableData.id}`, values)
                                    .then(() => {
                                        getBookData();
                                        setEdit(false);
                                    })
                                    .catch((error) => {
                                        console.error("Error updating book data:", error);
                                    });
                                setSubmitting(false);
                            }}
                        >
                            {({ values, errors, handleSubmit, handleChange }) => (
                                <form onSubmit={handleSubmit}>
                                      <Modal.Header closeButton>
                    <Modal.Title>Edit Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Writer</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="writer"
                                            value={values.writer}
                                            onChange={handleChange}
                                            isInvalid={!!errors.writer}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.writer}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Year</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="year"
                                            value={values.year}
                                            onChange={handleChange}
                                            isInvalid={!!errors.year}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.year}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Main Contents</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="main_contents"
                                            value={values.main_contents}
                                            onChange={handleChange}
                                            isInvalid={!!errors.main_contents}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.main_contents}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    </Modal.Body>
<Modal.Footer>
                                    <Button variant="primary" type="submit">Update</Button>
                                    </Modal.Footer>
                                </form>
                            )}
                        </Formik>
            </Modal>
        </Fragment>
    );
}

export default BookStore;
```

### **4️⃣ Run React App**
```sh
npm start
```

📌 **Visit:** `http://localhost:3000/` to see the book list.

---

## **🌟 Future Improvements**
- ✅ Add **Update** and **Delete** functionality  
- ✅ Implement **Authentication & Authorization**  
- ✅ Use **React Router** for navigation  