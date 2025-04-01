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
