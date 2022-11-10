import React from "react";
import { useState,useEffect } from "react";
import { fetchData } from "services/api/Api";
import SearchBar from "./Searchbar/Searchbar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import Button from "./Button/Button";
import { Modal } from "./Modal/Modal";
import Loader from "./Loader/Loader";
import Notiflix from "notiflix";


export function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState(null);
  const [total, setTotal] = useState(0);
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (!query) return;
    fetchImages(query, page);
  }, [query, page]);

  const fetchImages = (query, page) => {
    const perPage = 12;
    setIsLoading(true);

    fetchData(query, page, perPage)
      .then(({ hits, totalHits }) => {
        const totalPages = Math.ceil(totalHits / perPage);

        const data = hits.map(({ id, webformatURL, largeImageURL, tags }) => {
          return {
            id,
            webformatURL,
            largeImageURL,
            tags,
          };
        });

        setImages(images => [...images, ...data]);
        setTotal(totalHits);

        if (hits.length === 0) {
          return Notiflix.error('Sorry, no images found. Please, try again!');
        }

        if (page === 1) {
          Notiflix.success(`Hooray! We found ${totalHits} images.`);
        }

        if (page === totalPages) {
          Notiflix.info("You've reached the end of search results.");
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleSearch = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const toggleModal = (largeImageURL, tags) => {
    setShowModal(!showModal);
    setLargeImageURL(largeImageURL);
    setTags(tags);
  };

  const onLoadMore = () => {
    setPage(page => page + 1);
  };

  const loadImages = images.length !== 0;
  const isLastPage = images.length === total;
  const loadMoreBtn = loadImages && !isLoading && !isLastPage;

    return (
      <>
        <SearchBar onSubmit={handleSearch} />

        {isLoading && <Loader />}

        {loadImages && (
          <ImageGallery images={images} onClick={toggleModal} />
        )}

        {loadMoreBtn && <Button onClick={onLoadMore}>Load more</Button>}

        {showModal && (
          <Modal onClose={toggleModal}>
            <img src={largeImageURL} alt={tags} />
          </Modal>
        )}
      </>
    );
}