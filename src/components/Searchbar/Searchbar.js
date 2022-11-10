import React from "react";
import { useState } from "react";
import PropTypes from 'prop-types';
import { MdSearch } from "react-icons/md";
import { toast } from 'react-toastify';
import { Header, Form, Button,  Input } from "./Searchbar.styled";

export default function SearchBar({ onSubmit }) {
    const [query, setQuery] = useState('');

    const handleChange = e => {
        setQuery(e.currentTarget.value);
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (query.trim() === '') {
        toast.warn('Please specify your query!');
        return;
        }
        onSubmit(query);
        reset();
    };

    const reset = () => {
        setQuery('');
    };

    return (
        <Header>
        <Form onSubmit={handleSubmit}>
            <Button type="submit">
            <MdSearch style={{ width: 30, height: 30 }} />
            </Button>

            <Input
            type="text"
            name="query"
            value={query}
            onChange={handleChange}
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            />
        </Form>
        </Header>
    );
    }
SearchBar.propTypes = {
    onSubmit: PropTypes.func,
};